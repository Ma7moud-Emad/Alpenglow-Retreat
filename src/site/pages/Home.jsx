import styled from "styled-components";
import {
  HiOutlineArrowLongRight,
  HiOutlineBeaker,
  HiOutlineBookOpen,
  HiOutlineCake,
  HiOutlineChevronDown,
  HiOutlineFire,
  HiOutlineGlobeAlt,
  HiOutlineMoon,
  HiOutlineMusicalNote,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineWifi,
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
  SectionIntro,
  SiteLinkButton,
  TextLink,
} from "../ui/primitives";
import RoomCard from "../ui/RoomCard";
import { usePublicRooms } from "../../hooks/usePublicSite";
import Skeleton from "../../ui/Skeleton";
import Backdrop from "../ui/Backdrop";
import PageMeta from "../../ui/PageMeta";
import { heroImage, nightImage } from "../../lib/images";
import { lodgingSchema } from "../../lib/seo";

/* ---------------------------------------------------------------- hero -- */

const Hero = styled.header`
  position: relative;
  isolation: isolate;
  min-height: min(92dvh, 88rem);
  display: flex;
  align-items: flex-end;
  color: var(--site-on-dark);
  --text: var(--site-on-dark);

  /* Graded rather than a flat wash: dark at the top so the transparent header
     stays legible, briefly lighter to let the photograph breathe, then dark
     again through the band where the headline and buttons sit. */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(10, 22, 15, 0.6) 0%,
      rgba(10, 22, 15, 0.26) 24%,
      rgba(10, 22, 15, 0.62) 52%,
      rgba(10, 22, 15, 0.86) 82%,
      var(--site-deep) 100%
    );
  }
`;

const HeroInner = styled(Container)`
  position: relative;
  z-index: 2;
  padding-bottom: var(--space-20);
  padding-top: var(--space-24);
`;

const HeroTitle = styled.h1`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(4.2rem, 2rem + 6.4vw, 9.6rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
  max-width: 16ch;
  text-wrap: balance;
  color: var(--site-on-dark);
  /* Sits directly on photography, so it needs its own shadow rather than
     relying on the scrim alone. */
  text-shadow: 0 2px 30px rgba(10, 22, 15, 0.45);

  & em {
    font-style: italic;
    color: var(--ember-300);
  }
`;

const HeroLede = styled.p`
  margin-top: var(--space-6);
  max-width: 52ch;
  font-size: clamp(1.6rem, 1.4rem + 0.5vw, 2rem);
  line-height: 1.65;
  color: var(--site-on-dark-soft);
`;

const HeroActions = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-8);
  flex-wrap: wrap;
`;

const ScrollHint = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-16);
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--site-on-dark-soft);

  & svg {
    width: 1.8rem;
    height: 1.8rem;
    animation: nudge 2.4s var(--ease) infinite;
  }
  @keyframes nudge {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(4px); }
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

/* ------------------------------------------------------------- welcome -- */

const SplitIntro = styled.div`
  display: grid;
  gap: var(--space-12);
  grid-template-columns: 1fr 1fr;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
`;

const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  margin-top: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--site-line);

  & dt {
    font-family: var(--font-display);
    font-size: clamp(3rem, 2rem + 2vw, 4.4rem);
    font-weight: 400;
    line-height: 1;
    color: var(--site-ink);
  }
  & dd {
    margin-top: var(--space-2);
    font-size: var(--text-sm);
    color: var(--site-ink-muted);
    line-height: 1.5;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
`;

/* ---------------------------------------------------------- highlights -- */

const HighlightCard = styled.article`
  & > span {
    display: grid;
    place-items: center;
    width: 5.6rem;
    height: 5.6rem;
    border-radius: 50%;
    background-color: var(--site-accent-soft);
    color: var(--site-accent-bright);
    margin-bottom: var(--space-5);
  }
  & svg {
    width: 2.6rem;
    height: 2.6rem;
  }
  & h3 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: var(--text-xl);
  }
  & p {
    margin-top: var(--space-3);
    color: var(--site-ink-soft);
    line-height: 1.7;
  }
`;

/* ------------------------------------------------------------ stargaze -- */

const NightSection = styled(Section)`
  position: relative;
  color: var(--site-on-dark);
  isolation: isolate;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
      100deg,
      var(--pine-950) 8%,
      rgba(10, 22, 15, 0.82) 42%,
      rgba(10, 22, 15, 0.35) 100%
    );
  }
`;

const NightInner = styled.div`
  max-width: 60rem;

  & h2 {
    color: var(--site-on-dark);
  }
`;

/* ---------------------------------------------------------- amenities --- */

const AmenityGrid = styled.ul`
  display: grid;
  gap: var(--space-1);
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
`;

const Amenity = styled.li`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--site-line);

  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--site-accent);
    flex-shrink: 0;
  }
  & strong {
    display: block;
    font-weight: 500;
  }
  & small {
    color: var(--site-ink-muted);
    font-size: var(--text-sm);
  }
`;

/* -------------------------------------------------------- testimonials -- */

const QuoteGrid = styled.div`
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
`;

const Quote = styled.figure`
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-8);
  background-color: var(--site-surface);
  border: 1px solid var(--site-line);
  border-radius: var(--radius-lg);

  & blockquote {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    font-weight: 400;
    line-height: 1.55;
    letter-spacing: -0.01em;
    flex: 1;
  }
  & figcaption {
    font-size: var(--text-sm);
    color: var(--site-ink-muted);
    padding-top: var(--space-4);
    border-top: 1px solid var(--site-line);
  }
  & figcaption strong {
    display: block;
    color: var(--site-ink);
    font-weight: 500;
    margin-bottom: 0.2rem;
  }
`;

/* -------------------------------------------------------------- final --- */

const Cta = styled.div`
  text-align: center;
  max-width: 62rem;
  margin-inline: auto;

  & h2 {
    color: var(--site-on-dark);
  }
`;

const CtaActions = styled.div`
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  margin-top: var(--space-8);
`;

const CardsSkeleton = styled.div`
  display: grid;
  gap: var(--space-8);
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
`;

const HIGHLIGHTS = [
  {
    icon: <HiOutlineFire />,
    title: "A fire in every cabin",
    text: "Real wood-burning stoves, laid before you arrive, with a basket of split birch on the hearth and more outside the door.",
  },
  {
    icon: <HiOutlineMoon />,
    title: "No light for forty miles",
    text: "We are far enough from anywhere that the Milky Way is visible on any clear night. Telescopes are free to borrow from reception.",
  },
  {
    icon: <HiOutlineSparkles />,
    title: "Cedar tubs under the sky",
    text: "Nine of the fifteen cabins have their own outdoor hot tub, heated year-round and set away from any sightline.",
  },
];

const AMENITIES = [
  { icon: <HiOutlineCake />, title: "Breakfast to the door", note: "Delivered in a basket at the hour you choose" },
  { icon: <HiOutlineWifi />, title: "Fast Wi-Fi throughout", note: "Fibre to every cabin, if you must" },
  { icon: <HiOutlineBeaker />, title: "Wood-fired sauna", note: "Down by the lake, open until ten" },
  { icon: <HiOutlineGlobeAlt />, title: "Four hundred acres", note: "Marked trails from every doorstep" },
  { icon: <HiOutlineBookOpen />, title: "The reading room", note: "In the old lodge, with the good chairs" },
  { icon: <HiOutlineMusicalNote />, title: "Friday night sessions", note: "Local players in the lodge bar" },
  { icon: <HiOutlineSun />, title: "Guided dawn walks", note: "Tuesdays and Saturdays, weather allowing" },
  { icon: <HiOutlineSparkles />, title: "Dogs welcome", note: "In seven of our cabins, at no charge" },
];

const TESTIMONIALS = [
  {
    quote:
      "We booked two nights and rebooked for a week before we had left. The silence takes about a day to get used to, and then you cannot do without it.",
    name: "Hannah & Tomas",
    detail: "Whispering Pines · October",
  },
  {
    quote:
      "I have stayed in more expensive places that got less right. The fire was laid, the tub was hot, and nobody bothered us once.",
    name: "Priya Raghavan",
    detail: "Silver Birch Hideaway · February",
  },
  {
    quote:
      "Twelve of us in the lodge for my father's seventieth. They handled every meal and left us entirely alone the rest of the time.",
    name: "The Okonkwo family",
    detail: "Cedar Creek Lodge · June",
  },
];

export default function Home() {
  const { data: rooms = [], isPending } = usePublicRooms();
  const featured = rooms.slice(0, 3);

  return (
    <>
      <PageMeta path="/" schema={lodgingSchema()} />

      <Hero>
        <Backdrop image={heroImage} priority position="center" />
        <HeroInner>
          <HeroTitle>
            The light gets here <em>last</em>.
          </HeroTitle>
          <HeroLede>
            Fifteen cabins on four hundred acres of pine and meadow. An hour past
            the last traffic light, and about twenty minutes past the last of the
            phone signal.
          </HeroLede>
          <HeroActions>
            <SiteLinkButton to="/rooms" $variant="primary">
              Explore the rooms
            </SiteLinkButton>
            <SiteLinkButton to="/contact" $variant="outline-light">
              Check availability
            </SiteLinkButton>
          </HeroActions>
          <ScrollHint>
            <span>Scroll</span>
            <HiOutlineChevronDown aria-hidden="true" />
          </ScrollHint>
        </HeroInner>
      </Hero>

      <Section $tone="light">
        <Container>
          <SplitIntro>
            <div>
              <Eyebrow>Since 1974</Eyebrow>
              <Display>
                A working estate that happens to take <em>guests</em>.
              </Display>
            </div>
            <div>
              <Lede>
                Alpenglow began as a forestry holding and still is one. The cabins
                went up slowly, one or two a decade, each sited where the land
                suggested rather than where a plan said.
              </Lede>
              <Body style={{ marginTop: "var(--space-5)" }}>
                That is why no two are alike, why some are a twenty-minute walk
                from the lodge, and why we cap the estate at fifteen. It is also
                why you will not find a conference suite, a lobby television, or
                anyone trying to sell you a spa package.
              </Body>
              <div style={{ marginTop: "var(--space-6)" }}>
                <TextLink to="/experience">
                  More about the retreat <HiOutlineArrowLongRight aria-hidden="true" />
                </TextLink>
              </div>
            </div>
          </SplitIntro>

          <Stats>
            <div>
              <dt>15</dt>
              <dd>Cabins, and never more than fifteen</dd>
            </div>
            <div>
              <dt>400</dt>
              <dd>Acres of pine, meadow and lakeshore</dd>
            </div>
            <div>
              <dt>50</dt>
              <dd>Years in the same family</dd>
            </div>
          </Stats>
        </Container>
      </Section>

      <Section $tone="white">
        <Container>
          <SectionIntro $center>
            <Eyebrow>What you get</Eyebrow>
            <Display>Not much. On purpose.</Display>
            <Lede>
              We have spent fifty years removing things rather than adding them.
              What is left is what we think actually matters.
            </Lede>
          </SectionIntro>

          <Grid $min="30rem" $gap="var(--space-10)">
            {HIGHLIGHTS.map((item) => (
              <HighlightCard key={item.title}>
                <span aria-hidden="true">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </HighlightCard>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section $tone="alt">
        <Container>
          <SectionIntro>
            <Eyebrow>The cabins</Eyebrow>
            <Display>Fifteen rooms, no two alike.</Display>
            <Lede>
              From a single room with a deep tub by the window to a twelve-bed
              lodge with a fireplace you can stand inside.
            </Lede>
          </SectionIntro>

          {isPending ? (
            <CardsSkeleton aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} $height="46rem" $radius="var(--radius-lg)" />
              ))}
            </CardsSkeleton>
          ) : (
            <Grid $min="30rem">
              {featured.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </Grid>
          )}

          <div style={{ marginTop: "var(--space-10)", textAlign: "center" }}>
            <SiteLinkButton to="/rooms" $variant="outline">
              See all fifteen rooms
            </SiteLinkButton>
          </div>
        </Container>
      </Section>

      <NightSection>
        <Backdrop image={nightImage} layer={-2} />
        <Container>
          <NightInner>
            <Eyebrow>After dark</Eyebrow>
            <Display>
              You will see more stars here than you have in <em>years</em>.
            </Display>
            <Lede $onDark style={{ marginTop: "var(--space-6)" }}>
              The nearest town of any size is forty miles south, which makes this
              one of the darkest measured skies in the region. On a clear
              moonless night the Milky Way casts a shadow.
            </Lede>
            <Body $onDark style={{ marginTop: "var(--space-5)" }}>
              Reception keeps two telescopes and a set of star charts. Ask at the
              desk and someone will point you at whatever is worth looking at
              that week.
            </Body>
          </NightInner>
        </Container>
      </NightSection>

      <Section $tone="white">
        <Container>
          <SectionIntro $center>
            <Eyebrow>On the estate</Eyebrow>
            <Display>Everything else you might want.</Display>
          </SectionIntro>

          <AmenityGrid>
            {AMENITIES.map((item) => (
              <Amenity key={item.title}>
                <span aria-hidden="true">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.note}</small>
                </div>
              </Amenity>
            ))}
          </AmenityGrid>
        </Container>
      </Section>

      <Section $tone="light">
        <Container>
          <SectionIntro $center>
            <Eyebrow>Guests</Eyebrow>
            <Display>What people say afterwards.</Display>
          </SectionIntro>

          <QuoteGrid>
            {TESTIMONIALS.map((item) => (
              <Quote key={item.name}>
                <blockquote>“{item.quote}”</blockquote>
                <figcaption>
                  <strong>{item.name}</strong>
                  {item.detail}
                </figcaption>
              </Quote>
            ))}
          </QuoteGrid>
        </Container>
      </Section>

      <Section $tone="deep">
        <Container>
          <Cta>
            <Eyebrow>Stay with us</Eyebrow>
            <Display>
              The valley is quiet <em>most</em> of the year.
            </Display>
            <Lede $onDark style={{ marginTop: "var(--space-6)", marginInline: "auto" }}>
              Tell us roughly when you would like to come and how many of you
              there are. We will reply within a day with what is free.
            </Lede>
            <CtaActions>
              <SiteLinkButton to="/contact" $variant="primary">
                Check availability
              </SiteLinkButton>
              <SiteLinkButton to="/rooms" $variant="outline-light">
                Browse the rooms
              </SiteLinkButton>
            </CtaActions>
          </Cta>
        </Container>
      </Section>
    </>
  );
}
