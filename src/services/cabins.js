import supabase, { describeError, STORAGE_BUCKETS } from "../lib/supabase";

export const CABIN_FILTERS = [
  { value: "all", label: "All" },
  { value: "discounted", label: "With discount" },
  { value: "full-price", label: "No discount" },
];

export const CABIN_SORTS = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "regularPrice-asc", label: "Price (low to high)" },
  { value: "regularPrice-desc", label: "Price (high to low)" },
  { value: "maxCapacity-asc", label: "Capacity (small to large)" },
  { value: "maxCapacity-desc", label: "Capacity (large to small)" },
];

const SORTABLE_COLUMNS = new Set(["name", "regularPrice", "maxCapacity"]);

function parseSort(sort) {
  const [column, direction] = String(sort ?? "").split("-");
  if (!SORTABLE_COLUMNS.has(column)) return { column: "name", ascending: true };
  return { column, ascending: direction !== "desc" };
}

export async function getCabins({ filter = "all", sort = "name-asc" } = {}) {
  const { column, ascending } = parseSort(sort);

  let query = supabase.from("cabins").select("*");

  if (filter === "discounted") query = query.gt("discount", 0);
  if (filter === "full-price") query = query.eq("discount", 0);

  const { data, error } = await query.order(column, { ascending });
  if (error) throw new Error(describeError(error, "Could not load cabins"));
  return data ?? [];
}

export async function getCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(describeError(error, "Could not load the cabin"));
  return data;
}

/**
 * Image names are randomised. The old code uploaded under the raw filename, so
 * two staff members uploading `cabin.jpg` collided, and a duplicated cabin
 * shared one storage object with its original, so deleting either broke both.
 */
function storagePathFor(file) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const random = crypto.randomUUID();
  return `${random}.${extension}`;
}

function publicUrlFor(path) {
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.cabins).getPublicUrl(path);
  return publicUrl;
}

async function uploadImage(file) {
  const path = storagePathFor(file);
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.cabins)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(describeError(error, "Could not upload the photo"));
  return publicUrlFor(path);
}

async function removeImage(imageUrl) {
  const path = imageUrl?.split(`${STORAGE_BUCKETS.cabins}/`).pop();
  if (!path || path === imageUrl) return;
  await supabase.storage.from(STORAGE_BUCKETS.cabins).remove([path]);
}

export async function createCabin(values) {
  const { image, ...fields } = values;
  const imageUrl = await uploadImage(image);

  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...fields, image: imageUrl }])
    .select()
    .single();

  if (error) {
    // Don't leave the uploaded file behind if the row could not be written.
    await removeImage(imageUrl);
    throw new Error(describeError(error, "Could not create the cabin"));
  }
  return data;
}

export async function updateCabin({ id, image, ...fields }) {
  const patch = { ...fields };
  let uploadedUrl = null;

  if (image instanceof File) {
    uploadedUrl = await uploadImage(image);
    patch.image = uploadedUrl;
  }

  const { data, error } = await supabase
    .from("cabins")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (uploadedUrl) await removeImage(uploadedUrl);
    throw new Error(describeError(error, "Could not update the cabin"));
  }
  return data;
}

export async function deleteCabin(cabin) {
  // Delete the row first: a cabin with bookings is blocked by the foreign key,
  // and losing its photo before finding that out would corrupt the record.
  const { error } = await supabase.from("cabins").delete().eq("id", cabin.id);

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "This cabin has bookings against it and cannot be deleted."
      );
    }
    throw new Error(describeError(error, "Could not delete the cabin"));
  }

  await removeImage(cabin.image);
}

/**
 * Copies a cabin, including its photo. The copy gets its own storage object so
 * the two can be edited and deleted independently.
 */
export async function duplicateCabin(cabin) {
  // eslint-disable-next-line no-unused-vars
  const { id, created_at, updated_at, image, name, ...fields } = cabin;

  let imageUrl = image;
  try {
    const response = await fetch(image);
    if (response.ok) {
      const blob = await response.blob();
      const extension = image.split(".").pop()?.split("?")[0] ?? "jpg";
      const path = `${crypto.randomUUID()}.${extension}`;
      const { error: copyError } = await supabase.storage
        .from(STORAGE_BUCKETS.cabins)
        .upload(path, blob, { cacheControl: "3600", contentType: blob.type });
      if (!copyError) imageUrl = publicUrlFor(path);
    }
  } catch {
    // Falling back to the shared URL is better than failing the duplicate.
  }

  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...fields, name: `${name} (copy)`, image: imageUrl }])
    .select()
    .single();

  if (error) throw new Error(describeError(error, "Could not duplicate the cabin"));
  return data;
}
