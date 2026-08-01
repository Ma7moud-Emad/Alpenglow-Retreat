import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { HiOutlineCheckCircle, HiOutlinePaperAirplane } from "react-icons/hi2";
import { SiteButton } from "./primitives";
import { useSubmitEnquiry, usePublicRooms } from "../../hooks/usePublicSite";
import { useSettings } from "../../hooks/useSettings";
import { toISODate, pluralise, formatCurrency } from "../../lib/format";

const Form = styled.form`
  display: grid;
  gap: var(--space-5);
`;

const Row = styled.div`
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(${({ $cols }) => $cols ?? 2}, 1fr);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  & label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--site-ink);
    margin-bottom: 0.7rem;
  }

  & input,
  & select,
  & textarea {
    font-family: var(--font-body);
    font-size: var(--text-md);
    color: var(--site-ink);
    background-color: var(--site-surface);
    border: 1px solid var(--site-line);
    border-radius: var(--radius-sm);
    padding: 1.2rem var(--space-4);
    transition: border-color var(--duration) var(--ease),
      box-shadow var(--duration) var(--ease);
  }
  & textarea {
    min-height: 12rem;
    resize: vertical;
  }
  & select {
    cursor: pointer;
  }

  & input:focus,
  & select:focus,
  & textarea:focus {
    outline: none;
    border-color: var(--site-accent);
    box-shadow: 0 0 0 3px rgba(221, 102, 50, 0.18);
  }

  & input[aria-invalid="true"],
  & select[aria-invalid="true"],
  & textarea[aria-invalid="true"] {
    border-color: #c4372a;
  }

  & small {
    margin-top: 0.6rem;
    font-size: var(--text-xs);
    color: var(--site-ink-muted);
  }
  & [role="alert"] {
    margin-top: 0.6rem;
    font-size: var(--text-xs);
    color: #b03024;
  }
`;

const Success = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
  padding: var(--space-12) var(--space-6);
  background-color: var(--site-surface);
  border: 1px solid var(--site-line);
  border-radius: var(--radius-lg);

  & svg {
    width: 5.2rem;
    height: 5.2rem;
    color: var(--site-accent);
  }
  & h3 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: var(--text-2xl);
  }
  & p {
    color: var(--site-ink-soft);
    max-width: 46ch;
    line-height: 1.7;
  }
`;

const FormError = styled.p`
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  background-color: #fdecea;
  color: #b03024;
  font-size: var(--text-sm);
`;

const Note = styled.p`
  font-size: var(--text-sm);
  color: var(--site-ink-muted);
  line-height: 1.6;
`;

const today = toISODate(new Date());

/**
 * Enquiry form. Writes to reservation_requests, which anonymous visitors may
 * insert into and never read back.
 *
 * The stay rules are pulled from the hotel's own settings rather than hardcoded,
 * so changing the minimum stay in the dashboard changes the public form too.
 */
export default function EnquiryForm({ roomId = null, compact = false }) {
  const [isSent, setIsSent] = useState(false);
  const { data: rooms = [] } = usePublicRooms();
  const { data: settings } = useSettings();
  const { mutate, isPending, error } = useSubmitEnquiry();

  const minNights = settings?.minBookingLength ?? 1;
  const maxNights = settings?.maxBookingLength ?? 90;
  const maxGuests = settings?.maxGuestsPreBookings ?? 30;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cabinId: roomId ? String(roomId) : "",
      numGuests: 2,
      startDate: "",
      endDate: "",
    },
  });

  function onSubmit(values) {
    mutate(
      {
        cabinId: values.cabinId ? Number(values.cabinId) : null,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        startDate: values.startDate,
        endDate: values.endDate,
        numGuests: values.numGuests,
        message: values.message,
      },
      { onSuccess: () => setIsSent(true) }
    );
  }

  if (isSent) {
    return (
      <Success role="status">
        <HiOutlineCheckCircle aria-hidden="true" />
        <h3>Thank you, that has reached us.</h3>
        <p>
          Someone at the desk will reply within a day with what is free on those
          dates. Nothing is booked or charged yet.
        </p>
      </Success>
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && <FormError role="alert">{error.message}</FormError>}

      <Row>
        <Field>
          <label htmlFor="enq-name">Your name</label>
          <input
            id="enq-name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.fullName ? "true" : undefined}
            {...register("fullName", {
              required: "Please tell us your name",
              minLength: { value: 2, message: "That looks too short" },
            })}
          />
          {errors.fullName && <span role="alert">{errors.fullName.message}</span>}
        </Field>

        <Field>
          <label htmlFor="enq-email">Email</label>
          <input
            id="enq-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : undefined}
            {...register("email", {
              required: "We need an email to reply to",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                message: "That does not look like an email address",
              },
            })}
          />
          {errors.email && <span role="alert">{errors.email.message}</span>}
        </Field>
      </Row>

      <Row>
        <Field>
          <label htmlFor="enq-arrive">Arriving</label>
          <input
            id="enq-arrive"
            type="date"
            min={today}
            aria-invalid={errors.startDate ? "true" : undefined}
            {...register("startDate", {
              required: "Pick an arrival date",
              validate: (value) =>
                value >= today || "That date has already passed",
            })}
          />
          {errors.startDate && <span role="alert">{errors.startDate.message}</span>}
        </Field>

        <Field>
          <label htmlFor="enq-leave">Leaving</label>
          <input
            id="enq-leave"
            type="date"
            min={today}
            aria-invalid={errors.endDate ? "true" : undefined}
            {...register("endDate", {
              required: "Pick a departure date",
              validate: (value) => {
                const start = getValues("startDate");
                if (!start) return true;
                const nights = Math.round(
                  (new Date(value) - new Date(start)) / 86_400_000
                );
                if (nights <= 0) return "Departure must be after arrival";
                if (nights < minNights)
                  return `Our minimum stay is ${pluralise(minNights, "night")}`;
                if (nights > maxNights)
                  return `Our maximum stay is ${pluralise(maxNights, "night")}`;
                return true;
              },
            })}
          />
          {errors.endDate && <span role="alert">{errors.endDate.message}</span>}
        </Field>
      </Row>

      <Row>
        <Field>
          <label htmlFor="enq-guests">Guests</label>
          <input
            id="enq-guests"
            type="number"
            min={1}
            max={maxGuests}
            aria-invalid={errors.numGuests ? "true" : undefined}
            {...register("numGuests", {
              required: "How many of you?",
              valueAsNumber: true,
              min: { value: 1, message: "At least one guest" },
              max: {
                value: maxGuests,
                message: `We can take up to ${maxGuests} per booking`,
              },
            })}
          />
          {settings && <small>Minimum stay {pluralise(minNights, "night")}</small>}
          {errors.numGuests && <span role="alert">{errors.numGuests.message}</span>}
        </Field>

        <Field>
          <label htmlFor="enq-phone">Phone (optional)</label>
          <input
            id="enq-phone"
            type="tel"
            autoComplete="tel"
            {...register("phone", {
              maxLength: { value: 40, message: "That number looks too long" },
            })}
          />
          {errors.phone && <span role="alert">{errors.phone.message}</span>}
        </Field>
      </Row>

      {!compact && (
        <Field>
          <label htmlFor="enq-room">Room (optional)</label>
          <select id="enq-room" {...register("cabinId")}>
            <option value="">No preference, suggest something</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}, {formatCurrency(room.regularPrice - room.discount)}/night
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field>
        <label htmlFor="enq-message">Anything we should know? (optional)</label>
        <textarea
          id="enq-message"
          placeholder="Dogs, dietary needs, a birthday, arriving late…"
          {...register("message", {
            maxLength: { value: 2000, message: "Please keep it under 2000 characters" },
          })}
        />
        {errors.message && <span role="alert">{errors.message.message}</span>}
      </Field>

      <SiteButton type="submit" $variant="primary" disabled={isPending}>
        <HiOutlinePaperAirplane aria-hidden="true" />
        {isPending ? "Sending…" : "Send enquiry"}
      </SiteButton>

      <Note>
        This is an enquiry, not a booking. Nothing is charged and no card is
        needed. We will confirm by email first.
      </Note>
    </Form>
  );
}
