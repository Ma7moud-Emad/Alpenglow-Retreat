import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Keeps list state (filter, sort, page, search) in the query string.
 *
 * Filters used to live in component state, so a filtered view could not be
 * linked to or bookmarked, and the browser back button jumped past the whole
 * screen instead of undoing the last filter change.
 */
export default function useUrlState(defaults) {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    const next = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const value = searchParams.get(key);
      if (value !== null) next[key] = value;
    }
    return next;
  }, [searchParams, defaults]);

  const setState = useCallback(
    (patch) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(patch)) {
            // Omit defaults so the common view keeps a clean URL.
            if (value == null || value === "" || value === defaults[key]) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          }
          // Any change to the result set invalidates the current page number.
          if (!("page" in patch) && "page" in defaults) next.delete("page");
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams, defaults]
  );

  return [state, setState];
}
