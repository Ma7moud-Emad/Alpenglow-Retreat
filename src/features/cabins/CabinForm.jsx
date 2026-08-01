import { useForm } from "react-hook-form";
import styled from "styled-components";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import {
  Form,
  FormActions,
  FormField,
  Input,
  Textarea,
} from "../../ui/Form";
import { useCreateCabin, useUpdateCabin } from "../../hooks/useCabins";

const Row = styled.div`
  display: grid;
  gap: var(--space-4);

  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Preview = styled.img`
  width: 100%;
  max-width: 18rem;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  margin-bottom: var(--space-2);
`;

const EMPTY = {
  name: "",
  maxCapacity: 2,
  regularPrice: 100,
  discount: 0,
  description: "",
};

export default function CabinForm({ isOpen, onClose, cabin }) {
  const isEditing = Boolean(cabin?.id);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: isEditing ? cabin : EMPTY });

  const { mutate: create, isPending: isCreating } = useCreateCabin();
  const { mutate: update, isPending: isUpdating } = useUpdateCabin();
  const isSaving = isCreating || isUpdating;

  function close() {
    reset(isEditing ? cabin : EMPTY);
    onClose();
  }

  function onSubmit(values) {
    const payload = {
      name: values.name.trim(),
      maxCapacity: Number(values.maxCapacity),
      regularPrice: Number(values.regularPrice),
      discount: Number(values.discount),
      description: values.description.trim(),
    };

    // react-hook-form hands back a FileList; only send a file if one was picked.
    const file = values.image?.[0];

    if (isEditing) {
      update({ id: cabin.id, ...payload, ...(file ? { image: file } : {}) }, { onSuccess: close });
    } else {
      create({ ...payload, image: file }, { onSuccess: close });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={isEditing ? `Edit ${cabin.name}` : "Add a new cabin"}
      description={
        isEditing
          ? "Leave the photo empty to keep the current one."
          : "Cabins appear on the bookings screen as soon as they are created."
      }
      width="62rem"
    >
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Cabin name" error={errors.name?.message}>
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="e.g. Cedar Retreat"
              {...register("name", {
                required: "Give the cabin a name",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
            />
          )}
        </FormField>

        <Row>
          <FormField
            label="Maximum capacity"
            error={errors.maxCapacity?.message}
            help="Between 1 and 30 guests"
          >
            {(field) => (
              <Input
                {...field}
                type="number"
                min={1}
                max={30}
                {...register("maxCapacity", {
                  required: "Capacity is required",
                  min: { value: 1, message: "At least 1 guest" },
                  max: { value: 30, message: "At most 30 guests" },
                  valueAsNumber: true,
                })}
              />
            )}
          </FormField>

          <FormField label="Regular price" error={errors.regularPrice?.message}>
            {(field) => (
              <Input
                {...field}
                type="number"
                min={1}
                {...register("regularPrice", {
                  required: "A nightly rate is required",
                  min: { value: 1, message: "Must be more than 0" },
                  valueAsNumber: true,
                })}
              />
            )}
          </FormField>
        </Row>

        <FormField
          label="Discount"
          error={errors.discount?.message}
          help="Use 0 for no discount. It cannot exceed the regular price."
        >
          {(field) => (
            <Input
              {...field}
              type="number"
              min={0}
              {...register("discount", {
                required: "Enter 0 if there is no discount",
                min: { value: 0, message: "Cannot be negative" },
                valueAsNumber: true,
                validate: (value) =>
                  Number(value) <= Number(getValues("regularPrice")) ||
                  "Discount cannot be more than the regular price",
              })}
            />
          )}
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          {(field) => (
            <Textarea
              {...field}
              placeholder="What makes this cabin worth booking?"
              {...register("description", {
                required: "Describe the cabin",
                minLength: { value: 10, message: "At least 10 characters" },
              })}
            />
          )}
        </FormField>

        <FormField
          label={isEditing ? "Replace photo" : "Cabin photo"}
          error={errors.image?.message}
        >
          {(field) => (
            <>
              {isEditing && cabin.image && (
                <Preview src={cabin.image} alt={`Current photo of ${cabin.name}`} />
              )}
              <Input
                {...field}
                type="file"
                accept="image/*"
                {...register("image", {
                  validate: (value) =>
                    isEditing ||
                    value?.length > 0 ||
                    "A photo is required for a new cabin",
                })}
              />
            </>
          )}
        </FormField>

        <FormActions>
          <Button type="button" variant="secondary" onClick={close} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving} disabled={isEditing && !isDirty}>
            {isEditing ? "Save changes" : "Create cabin"}
          </Button>
        </FormActions>
      </Form>
    </Modal>
  );
}
