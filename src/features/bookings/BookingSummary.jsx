import styled from "styled-components";
import {
  HiOutlineBanknotes,
  HiOutlineCheckCircle,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineHomeModern,
  HiOutlineUser,
} from "react-icons/hi2";
import Card from "../../ui/Card";
import Badge, { StatusBadge } from "../../ui/Badge";
import Thumb from "../../ui/Thumb";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  pluralise,
} from "../../lib/format";

const Banner = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  padding: var(--space-5);
  background: linear-gradient(135deg, var(--brand-600), var(--brand-800));
  color: #fff;
`;

const BannerMain = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);

  & svg {
    width: 2.6rem;
    height: 2.6rem;
    opacity: 0.9;
  }
  & h2 {
    font-size: var(--text-lg);
    color: #fff;
  }
`;

const BannerDates = styled.p`
  font-size: var(--text-sm);
  opacity: 0.9;
`;

const Sections = styled.div`
  display: grid;
  gap: var(--space-5);
  padding: var(--space-5);

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Block = styled.section`
  min-width: 0;
`;

const BlockTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: var(--space-3);

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const DefinitionList = styled.dl`
  display: grid;
  grid-template-columns: minmax(10rem, auto) 1fr;
  gap: var(--space-2) var(--space-4);
  font-size: var(--text-sm);

  & dt {
    color: var(--text-muted);
  }
  & dd {
    color: var(--text);
    word-break: break-word;
  }
`;

const CabinPhoto = styled.div`
  margin-bottom: var(--space-3);
`;

const Prices = styled.div`
  border-top: 1px solid var(--border);
  padding: var(--space-4) var(--space-5);
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  font-size: var(--text-sm);
  padding: 0.4rem 0;
  color: var(--text-secondary);

  &[data-total="true"] {
    margin-top: var(--space-2);
    padding-top: var(--space-3);
    border-top: 1px solid var(--border);
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--text);
  }

  & span:last-child {
    font-variant-numeric: tabular-nums;
  }
`;

const Footer = styled.footer`
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--border);
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-align: right;
`;

/**
 * The full record for one booking, shared by the detail page and the check-in
 * screen so both always show the same figures.
 */
export default function BookingSummary({ booking }) {
  const { cabins: cabin, guests: guest } = booking;
  const cabinPrice = Number(booking.cabinPrice ?? 0);
  const extrasPrice = Number(booking.extrasPrice ?? 0);

  return (
    <Card>
      <Banner>
        <BannerMain>
          <HiOutlineHomeModern aria-hidden="true" />
          <div>
            <h2>
              {pluralise(booking.numNights, "night")} in {cabin?.name ?? "cabin"}
            </h2>
            <BannerDates>
              {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
            </BannerDates>
          </div>
        </BannerMain>
        <StatusBadge status={booking.status} />
      </Banner>

      <Sections>
        <Block>
          <BlockTitle>
            <HiOutlineUser aria-hidden="true" /> Guest
          </BlockTitle>
          <DefinitionList>
            <dt>Name</dt>
            <dd>{guest?.fullName ?? "–"}</dd>
            <dt>Email</dt>
            <dd>{guest?.email ?? "–"}</dd>
            <dt>Nationality</dt>
            <dd>{guest?.nationality ?? "–"}</dd>
            <dt>National ID</dt>
            <dd>{guest?.nationalID ?? "–"}</dd>
            <dt>Party size</dt>
            <dd>{pluralise(booking.numGuests, "guest")}</dd>
          </DefinitionList>
        </Block>

        <Block>
          <BlockTitle>
            <HiOutlineHomeModern aria-hidden="true" /> Cabin
          </BlockTitle>
          <CabinPhoto>
            <Thumb
              src={cabin?.image}
              alt={cabin?.name ? `Photo of ${cabin.name}` : ""}
              width="22rem"
              height="16.5rem"
              radius="var(--radius-md)"
            />
          </CabinPhoto>
          <DefinitionList>
            <dt>Cabin</dt>
            <dd>{cabin?.name ?? "–"}</dd>
            <dt>Sleeps up to</dt>
            <dd>{cabin ? pluralise(cabin.maxCapacity, "guest") : "–"}</dd>
            <dt>Rate</dt>
            <dd>{formatCurrency(cabin?.regularPrice)} / night</dd>
          </DefinitionList>
        </Block>

        <Block>
          <BlockTitle>
            <HiOutlineCheckCircle aria-hidden="true" /> Extras
          </BlockTitle>
          <DefinitionList>
            <dt>Breakfast</dt>
            <dd>
              <Badge $tone={booking.hasBreakfast ? "success" : "neutral"}>
                {booking.hasBreakfast ? "Included" : "Not included"}
              </Badge>
            </dd>
            <dt>Payment</dt>
            <dd>
              <Badge $tone={booking.isPaid ? "success" : "warning"}>
                {booking.isPaid ? "Paid" : "Due at property"}
              </Badge>
            </dd>
          </DefinitionList>
        </Block>

        <Block>
          <BlockTitle>
            <HiOutlineChatBubbleBottomCenterText aria-hidden="true" /> Observations
          </BlockTitle>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
            {booking.observations?.trim() || "No notes were left for this stay."}
          </p>
        </Block>
      </Sections>

      <Prices>
        <BlockTitle>
          <HiOutlineBanknotes aria-hidden="true" /> Price breakdown
        </BlockTitle>
        <PriceRow>
          <span>
            Cabin · {pluralise(booking.numNights, "night")}
          </span>
          <span>{formatCurrency(cabinPrice, { cents: true })}</span>
        </PriceRow>
        <PriceRow>
          <span>Extras{booking.hasBreakfast ? " · breakfast" : ""}</span>
          <span>{formatCurrency(extrasPrice, { cents: true })}</span>
        </PriceRow>
        <PriceRow data-total="true">
          <span>Total</span>
          <span>{formatCurrency(booking.totalPrice, { cents: true })}</span>
        </PriceRow>
      </Prices>

      <Footer>Booked {formatDateTime(booking.created_at)}</Footer>
    </Card>
  );
}
