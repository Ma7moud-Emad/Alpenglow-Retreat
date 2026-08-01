import styled from "styled-components";
import { Link } from "react-router-dom";
import { HiOutlineArrowLongRight, HiOutlineStar, HiOutlineUsers } from "react-icons/hi2";
import { formatCurrency, pluralise } from "../../lib/format";
import { nightlyRate } from "../../services/publicSite";

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: var(--site-surface);
  border: 1px solid var(--site-line);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--duration-slow) var(--ease-out),
    box-shadow var(--duration-slow) var(--ease-out);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 48px -20px rgba(18, 36, 26, 0.28);
  }
`;

const Frame = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: linear-gradient(140deg, var(--pine-800), var(--pine-950));

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s var(--ease-out);
  }
  ${Card}:hover & img {
    transform: scale(1.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  padding: 0.5rem var(--space-3);
  border-radius: var(--radius-full);
  /* ember-500 under white text is 3.5:1, and this is 11px. */
  background-color: var(--ember-600);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const Rating = styled.span`
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem var(--space-3);
  border-radius: var(--radius-full);
  background-color: rgba(251, 249, 245, 0.94);
  color: var(--site-ink);
  font-size: var(--text-xs);
  font-weight: 600;

  & svg {
    width: 1.4rem;
    height: 1.4rem;
    color: var(--ember-500);
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-6);
`;

const Name = styled.h3`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: var(--text-xl);
  letter-spacing: -0.015em;
`;

const Tagline = styled.p`
  margin-top: var(--space-2);
  color: var(--site-ink-soft);
  line-height: 1.6;
  flex: 1;
`;

const Meta = styled.ul`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  color: var(--site-ink-muted);

  & li {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }
  & svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Foot = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  margin-top: var(--space-6);
  padding-top: var(--space-5);
  border-top: 1px solid var(--site-line);
`;

const Price = styled.p`
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  & strong {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-weight: 400;
  }
  & small {
    font-size: var(--text-xs);
    color: var(--site-ink-muted);
    margin-top: 0.4rem;
  }
  & s {
    color: var(--site-ink-muted);
    font-size: var(--text-sm);
    margin-right: 0.6rem;
    text-decoration-thickness: 1px;
  }
`;

const More = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--site-accent);

  & svg {
    width: 1.8rem;
    height: 1.8rem;
    transition: transform var(--duration) var(--ease);
  }
  ${Card}:hover & svg {
    transform: translateX(4px);
  }
`;

export default function RoomCard({ room, titleAs = "h3" }) {
  const rate = nightlyRate(room);
  const hasDiscount = Number(room.discount) > 0;

  return (
    <Card to={`/rooms/${room.slug}`}>
      <Frame>
        {room.image && <img src={room.image} alt="" loading="lazy" />}
        {hasDiscount && <Badge>Save {formatCurrency(room.discount)}</Badge>}
        {room.rating && (
          <Rating>
            <HiOutlineStar aria-hidden="true" />
            {Number(room.rating).toFixed(1)}
          </Rating>
        )}
      </Frame>

      <Body>
        <Name as={titleAs}>{room.name}</Name>
        <Tagline>{room.tagline}</Tagline>

        <Meta>
          <li>
            <HiOutlineUsers aria-hidden="true" />
            {pluralise(room.maxCapacity, "guest")}
          </li>
          {room.bed_type && <li>{room.bed_type}</li>}
          {room.size_sqm && <li>{room.size_sqm} m²</li>}
        </Meta>

        <Foot>
          <Price>
            <span>
              {hasDiscount && <s>{formatCurrency(room.regularPrice)}</s>}
              <strong>{formatCurrency(rate)}</strong>
            </span>
            <small>per night</small>
          </Price>
          <More>
            View room <HiOutlineArrowLongRight aria-hidden="true" />
          </More>
        </Foot>
      </Body>
    </Card>
  );
}
