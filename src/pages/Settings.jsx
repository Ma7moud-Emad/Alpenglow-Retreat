import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import PageHeader from "../ui/PageHeader";
import Card, { CardBody, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import Button from "../ui/Button";
import { Form, FormActions, FormField, Input } from "../ui/Form";
import ErrorState from "../ui/ErrorState";
import { SkeletonStack } from "../ui/Skeleton";
import useAuth from "../hooks/useAuth";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";

const Narrow = styled.div`
  max-width: 68rem;
`;

const Row = styled.div`
  display: grid;
  gap: var(--space-4);

  @media (min-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ReadOnlyNotice = styled.p`
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  background-color: var(--info-soft);
  color: var(--info-text);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
`;

export default function Settings() {
  const { isAdmin } = useAuth();
  const { data: settings, isPending, error, refetch } = useSettings();
  const { mutate: save, isPending: isSaving } = useUpdateSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  // Seed the form once the row arrives, and re-seed after a successful save so
  // `isDirty` returns to false.
  useEffect(() => {
    if (settings) {
      reset({
        minBookingLength: settings.minBookingLength,
        maxBookingLength: settings.maxBookingLength,
        maxGuestsPreBookings: settings.maxGuestsPreBookings,
        breakfastPrice: settings.breakfastPrice,
      });
    }
  }, [settings, reset]);

  const minBookingLength = watch("minBookingLength");

  function onSubmit(values) {
    save({
      minBookingLength: Number(values.minBookingLength),
      maxBookingLength: Number(values.maxBookingLength),
      maxGuestsPreBookings: Number(values.maxGuestsPreBookings),
      breakfastPrice: Number(values.breakfastPrice),
    });
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Hotel-wide rules applied to every new booking"
      />

      <Narrow>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Booking policy</CardTitle>
              <CardDescription>
                The breakfast rate is charged per guest, per night at check-in.
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            {error ? (
              <ErrorState error={error} onRetry={refetch} />
            ) : isPending ? (
              <SkeletonStack $padding="0" />
            ) : (
              <>
                {!isAdmin && (
                  <ReadOnlyNotice>
                    These values are read-only for your role. Ask an admin to
                    change them.
                  </ReadOnlyNotice>
                )}

                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Row>
                    <FormField
                      label="Minimum nights per booking"
                      error={errors.minBookingLength?.message}
                    >
                      {(field) => (
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          disabled={!isAdmin}
                          {...register("minBookingLength", {
                            required: "Required",
                            min: { value: 1, message: "At least 1 night" },
                            valueAsNumber: true,
                          })}
                        />
                      )}
                    </FormField>

                    <FormField
                      label="Maximum nights per booking"
                      error={errors.maxBookingLength?.message}
                    >
                      {(field) => (
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          disabled={!isAdmin}
                          {...register("maxBookingLength", {
                            required: "Required",
                            valueAsNumber: true,
                            validate: (value) =>
                              Number(value) >= Number(minBookingLength) ||
                              "Cannot be lower than the minimum",
                          })}
                        />
                      )}
                    </FormField>
                  </Row>

                  <Row>
                    <FormField
                      label="Maximum guests per booking"
                      error={errors.maxGuestsPreBookings?.message}
                    >
                      {(field) => (
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          disabled={!isAdmin}
                          {...register("maxGuestsPreBookings", {
                            required: "Required",
                            min: { value: 1, message: "At least 1 guest" },
                            valueAsNumber: true,
                          })}
                        />
                      )}
                    </FormField>

                    <FormField
                      label="Breakfast price"
                      help="Per guest, per night"
                      error={errors.breakfastPrice?.message}
                    >
                      {(field) => (
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          step="0.01"
                          disabled={!isAdmin}
                          {...register("breakfastPrice", {
                            required: "Required",
                            min: { value: 0, message: "Cannot be negative" },
                            valueAsNumber: true,
                          })}
                        />
                      )}
                    </FormField>
                  </Row>

                  {isAdmin && (
                    <FormActions>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => reset()}
                        disabled={!isDirty || isSaving}
                      >
                        Discard changes
                      </Button>
                      <Button type="submit" isLoading={isSaving} disabled={!isDirty}>
                        Save settings
                      </Button>
                    </FormActions>
                  )}
                </Form>
              </>
            )}
          </CardBody>
        </Card>
      </Narrow>
    </>
  );
}
