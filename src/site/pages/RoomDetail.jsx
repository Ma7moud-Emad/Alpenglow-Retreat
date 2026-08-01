import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import {
  HiOutlineArrowLongRight,
  HiOutlineCheck,
  HiOutlineStar,
} from "react-icons/hi2";
import {
  Body,
  Container,
  Display,
  Eyebrow,
  Grid,
  Heading,
  Lede,
  Section,
} from "../ui/primitives";
import EnquiryForm from "../ui/EnquiryForm";
import RoomCard from "../ui/RoomCard";
import { usePublicRoom, usePublicRooms } from "../../hooks/usePublicSite";
import { nightlyRate } from "../../services/publicSite";
import { formatCurrency, pluralise } from "../../lib/format";
import Skeleton from "../../ui/Skeleton";
import ErrorState from "../../ui/ErrorState";
import PageMeta from "../../ui/PageMeta";
import { breadcrumbSchema, roomSchema } from "../../lib/seo";

const Hero = styled.div`
  position: relative;
  aspect-ratio: 21 / 9;
  min-height: 34rem;
  max-height: 62rem;
  overflow: hidden;
  background: linear-gradient(140deg, var(--pine-700), var(--pine-950));

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10, 22, 15, 0.1) 40%,
      rgba(10, 22, 15, 0.78) 100%
    );
  }

  @media (max-width: 700px) {
    aspect-ratio: 4 / 3;
  }
`;

const HeroCaption = styled(Container)`
  position: absolute;
  inset: auto 0 0 0;
  z-index: 1;
  padding-bottom: var(--space-10);
  color: var(--site-on-dark);
  --text: var(--site-on-dark);
`;

const Crumb = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--site-on-dark-soft);
  margin-bottom: var(--space-4);

  & a:hover {
    color: var(--site-on-dark);
    text-decoration: underline;
  }
`;

const HeroTitle = styled.h1`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(3.2rem, 1.8rem + 4vw, 6.4rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--site-on-dark);
`;

const HeroTagline = styled.p`
  margin-top: var(--space-3);
  font-size: clamp(1.6rem, 1.4rem + 0.5vw, 2rem);
  color: var(--site-on-dark-soft);
  max-width: 50ch;
`;

const Layout = styled.div`
  display: grid;
  gap: var(--space-12);
  grid-template-columns: 1.6fr 1fr;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Specs = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--space-6);
  padding-block: var(--space-8);
  margin-block: var(--space-8);
  border-block: 1px solid var(--site-line);

  & dt {
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--site-ink-muted);
    margin-bottom: var(--space-2);
  }
  & dd {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: 400;
  }
`;

const AmenityList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
  gap: var(--space-3) var(--space-6);
  margin-top: var(--space-6);

  & li {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    color: var(--site-ink-soft);
  }
  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--site-accent);
    flex-shrink: 0;
  }
`;

/* Sticky booking panel that follows the reader down the long description. */
const Panel = styled.aside`
  position: sticky;
  top: 10.4rem;
  background-color: var(--site-surface);
  border: 1px solid var(--site-line);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: 0 18px 40px -28px rgba(18, 36, 26, 0.4);

  @media (max-width: 1000px) {
    position: static;
  }
`;

const PriceBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  flex-wrap: wrap;
  padding-bottom: var(--space-5);
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--site-line);

  & strong {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 400;
    line-height: 1;
  }
  & span {
    color: var(--site-ink-muted);
    font-size: var(--text-sm);
  }
  & s {
    color: var(--site-ink-muted);
  }
`;

const Save = styled.span`
  display: inline-block;
  padding: 0.3rem var(--space-2);
  border-radius: var(--radius-full);
  background-color: var(--site-accent-soft);
  color: var(--ember-700);
  font-size: var(--text-xs);
  font-weight: 600;
`;

const RatingLine = styled.p`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: var(--text-sm);
  color: var(--site-ink-soft);
  margin-bottom: var(--space-6);

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--ember-500);
  }
`;

const Loading = styled(Container)`
  padding-block: var(--space-16);
  display: grid;
  gap: var(--space-6);
`;

export default function RoomDetail() {
  const { slug } = useParams();
  const { data: room, isPending, error, refetch } = usePublicRoom(slug);
  const { data: allRooms = [] } = usePublicRooms();

  if (isPending) {
    return (
      <Loading>
        <Skeleton $height="44rem" $radius="var(--radius-lg)" />
        <Skeleton $height="3rem" $width="40%" />
        <Skeleton $height="16rem" />
      </Loading>
    );
  }

  if (error) {
    return (
      <Section $tone="light">
        <Container>
          <ErrorState
            title="We could not find that room"
            error={error}
            onRetry={refetch}
          />
          <div style={{ textAlign: "center" }}>
            <Link to="/rooms" style={{ textDecoration: "underline" }}>
              Back to all rooms
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  const rate = nightlyRate(room);
  const hasDiscount = Number(room.discount) > 0;
  const others = allRooms.filter((r) => r.id !== room.id).slice(0, 3);

  return (
    <>
      <PageMeta
        title={room.name}
        path={`/rooms/${room.slug}`}
        description={
          room.tagline
            ? `${room.tagline} Sleeps ${room.maxCapacity}, from ${rate} a night at Alpenglow Retreat.`
            : room.description?.slice(0, 155)
        }
        image={room.image || undefined}
        type="product"
        schema={[
          roomSchema(room),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Rooms", path: "/rooms" },
            { name: room.name, path: `/rooms/${room.slug}` },
          ]),
        ]}
      />

      <Hero>
        {/* On failure the element removes itself, leaving the pine gradient
            behind rather than a broken-image icon and alt text. */}
        {room.image && (
          <img
            src={room.image}
            alt={room.name}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        )}
        <HeroCaption>
          <Crumb aria-label="Breadcrumb">
            <Link to="/rooms">Rooms</Link>
            <span aria-hidden="true">/</span>
            <span>{room.name}</span>
          </Crumb>
          <HeroTitle>{room.name}</HeroTitle>
          <HeroTagline>{room.tagline}</HeroTagline>
        </HeroCaption>
      </Hero>

      <Section $tone="light">
        <Container>
          <Layout>
            <div>
              <Eyebrow>The room</Eyebrow>
              <Lede>{room.description}</Lede>

              <Specs>
                <div>
                  <dt>Sleeps</dt>
                  <dd>{pluralise(room.maxCapacity, "guest")}</dd>
                </div>
                {room.bed_type && (
                  <div>
                    <dt>Beds</dt>
                    <dd>{room.bed_type}</dd>
                  </div>
                )}
                {room.size_sqm && (
                  <div>
                    <dt>Size</dt>
                    <dd>{room.size_sqm} m²</dd>
                  </div>
                )}
                {room.rating && (
                  <div>
                    <dt>Guest rating</dt>
                    <dd>{Number(room.rating).toFixed(1)} / 5</dd>
                  </div>
                )}
              </Specs>

              <Heading as="h2">What is in it</Heading>
              <AmenityList>
                {room.amenities?.map((item) => (
                  <li key={item}>
                    <HiOutlineCheck aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </AmenityList>

              <Body style={{ marginTop: "var(--space-10)" }}>
                Every cabin comes with firewood, fast Wi-Fi, and the run of the
                estate: four hundred acres of marked trails, the lake, the
                sauna and the reading room in the old lodge. Breakfast can be
                delivered to your door at whatever hour suits you.
              </Body>
            </div>

            <Panel>
              <PriceBlock>
                {hasDiscount && <s>{formatCurrency(room.regularPrice)}</s>}
                <strong>{formatCurrency(rate)}</strong>
                <span>per night</span>
                {hasDiscount && <Save>Save {formatCurrency(room.discount)}</Save>}
              </PriceBlock>

              {room.rating && (
                <RatingLine>
                  <HiOutlineStar aria-hidden="true" />
                  {Number(room.rating).toFixed(1)} out of 5 from recent guests
                </RatingLine>
              )}

              <EnquiryForm roomId={room.id} compact />
            </Panel>
          </Layout>
        </Container>
      </Section>

      {others.length > 0 && (
        <Section $tone="alt">
          <Container>
            <div style={{ marginBottom: "var(--space-10)" }}>
              <Eyebrow>Also on the estate</Eyebrow>
              <Display>You might prefer one of these.</Display>
            </div>
            <Grid $min="30rem">
              {others.map((other) => (
                <RoomCard key={other.id} room={other} />
              ))}
            </Grid>
            <div style={{ marginTop: "var(--space-10)" }}>
              <Link
                to="/rooms"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  fontWeight: 500,
                }}
              >
                See all fifteen rooms <HiOutlineArrowLongRight aria-hidden="true" />
              </Link>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
