import styled from "styled-components";
import {
  Body,
  Container,
  Display,
  Eyebrow,
  Heading,
  Lede,
  Section,
  SectionIntro,
  SiteLinkButton,
} from "../ui/primitives";
import { heroImage } from "../../lib/images";
import PageMeta from "../../ui/PageMeta";
import { breadcrumbSchema } from "../../lib/seo";

const Intro = styled.div`
  display: grid;
  gap: var(--space-12);
  grid-template-columns: 1fr 1fr;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
`;

const Portrait = styled.div`
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: linear-gradient(140deg, var(--pine-700), var(--pine-950));

  & picture {
    display: block;
    width: 100%;
    height: 100%;
  }

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 900px) {
    aspect-ratio: 16 / 10;
  }
`;

/* Timeline: a vertical rule with year markers hanging off it. */
const Timeline = styled.ol`
  position: relative;
  display: grid;
  gap: var(--space-10);
  padding-left: var(--space-10);

  &::before {
    content: "";
    position: absolute;
    left: 0.7rem;
    top: 0.8rem;
    bottom: 0.8rem;
    width: 1px;
    background-color: var(--site-line);
  }

  @media (max-width: 600px) {
    padding-left: var(--space-8);
  }
`;

const Moment = styled.li`
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: calc(var(--space-10) * -1);
    top: 0.9rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background-color: var(--site-bg);
    border: 2px solid var(--site-accent);
  }

  & h3 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: var(--text-xl);
  }
  & span {
    display: block;
    font-size: var(--text-sm);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--site-accent);
    margin-bottom: var(--space-2);
  }
  & p {
    margin-top: var(--space-3);
    color: var(--site-ink-soft);
    line-height: 1.7;
    max-width: 62ch;
  }

  @media (max-width: 600px) {
    &::before {
      left: calc(var(--space-8) * -1);
    }
  }
`;

const SeasonGrid = styled.div`
  display: grid;
  gap: var(--space-8);
  grid-template-columns: repeat(auto-fit, minmax(26rem, 1fr));
`;

const Season = styled.article`
  padding: var(--space-8);
  border: 1px solid var(--site-line-dark);
  border-radius: var(--radius-lg);

  & h3 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: var(--text-2xl);
    color: var(--site-on-dark);
  }
  & p {
    margin-top: var(--space-4);
    color: var(--site-on-dark-soft);
    line-height: 1.7;
  }
`;

const HouseRules = styled.ul`
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fit, minmax(28rem, 1fr));
  margin-top: var(--space-8);

  & li {
    padding-top: var(--space-5);
    border-top: 2px solid var(--site-ink);
  }
  & strong {
    display: block;
    font-size: var(--text-md);
    margin-bottom: var(--space-2);
  }
  & span {
    color: var(--site-ink-soft);
    line-height: 1.7;
  }
`;

const Closing = styled.div`
  text-align: center;

  & h2 {
    color: var(--site-on-dark);
  }
`;

const MOMENTS = [
  {
    year: "1974",
    title: "A forestry holding, and one cabin",
    text: "Elsa Ranft bought four hundred acres of neglected pine with the intention of managing it properly. The first cabin went up for her own use, at the top of what is now the wildflower meadow.",
  },
  {
    year: "1981",
    title: "The first guests, more or less by accident",
    text: "Walkers kept asking to stay. Elsa built two more cabins, put a sign at the road, and never advertised again.",
  },
  {
    year: "1996",
    title: "The lodge",
    text: "The old barn was rebuilt as the lodge: the reading room, the bar, the kitchen that can cook for forty. It is still where everyone ends up after dark.",
  },
  {
    year: "2009",
    title: "The dark-sky survey",
    text: "A visiting astronomer measured the sky above the meadow and told us it was among the darkest in the region. We bought two telescopes the following spring.",
  },
  {
    year: "Today",
    title: "Fifteen cabins, and that is the limit",
    text: "Elsa's granddaughter runs the estate now. The forestry work continues. We have turned down every offer to expand.",
  },
];

const SEASONS = [
  {
    title: "Spring",
    text: "The meadow comes up first, then the lilac by the walled garden. Best month for the dawn walks: everything is loud at five in the morning and silent by nine.",
  },
  {
    title: "Summer",
    text: "Long light until eleven at night. The lake is warm enough by July. This is when the wildflowers are waist-high and the Grand is booked a year out.",
  },
  {
    title: "Autumn",
    text: "Our favourite, and the quietest. The birches turn, the tubs start to feel like a good idea again, and the alpenglow on the ridge lasts nearly an hour.",
  },
  {
    title: "Winter",
    text: "Snow from December, usually deep. Every cabin is properly heated and every fire is laid. The sauna is at its best when it is minus fifteen outside.",
  },
];

export default function Experience() {
  return (
    <>
      <PageMeta
        title="The retreat"
        path="/experience"
        description="Fifty years of a working forestry estate that happens to take guests. The history, a season-by-season guide, what is on the four hundred acres, and how to find us."
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "The retreat", path: "/experience" },
        ])}
      />

      <Section $tone="light">
        <Container>
          <SectionIntro>
            <Eyebrow>The retreat</Eyebrow>
            <Display as="h1">
              Fifty years of <em>not</em> expanding.
            </Display>
          </SectionIntro>

          <Intro>
            <div>
              <Lede>
                Alpenglow is a working forestry estate that has taken guests
                since 1981, largely because people kept asking.
              </Lede>
              <Body style={{ marginTop: "var(--space-5)" }}>
                We have been offered money to put up another twenty cabins more
                times than we can count. The answer has always been no, and it
                will keep being no. Fifteen is the number at which you can walk
                out of your door at night and not see another light.
              </Body>
              <Body style={{ marginTop: "var(--space-4)" }}>
                What that means in practice: no check-in queue, no wristbands, no
                buffet. Someone meets you at your cabin with the key. The fire is
                already laid. After that we mostly leave you alone, which is what
                nearly everyone turns out to want.
              </Body>
            </div>
            <Portrait>
              <picture>
                <source
                  type="image/webp"
                  srcSet={heroImage.webp}
                  sizes="(max-width: 900px) 100vw, 40vw"
                />
                <img
                  src={heroImage.src}
                  srcSet={heroImage.jpeg}
                  sizes="(max-width: 900px) 100vw, 40vw"
                  alt="The estate at dusk"
                  width={heroImage.width}
                  height={heroImage.height}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </Portrait>
          </Intro>
        </Container>
      </Section>

      <Section $tone="white">
        <Container>
          <SectionIntro>
            <Eyebrow>How we got here</Eyebrow>
            <Display>A slow fifty years.</Display>
          </SectionIntro>

          <Timeline>
            {MOMENTS.map((moment) => (
              <Moment key={moment.year}>
                <span>{moment.year}</span>
                <h3>{moment.title}</h3>
                <p>{moment.text}</p>
              </Moment>
            ))}
          </Timeline>
        </Container>
      </Section>

      <Section $tone="deep">
        <Container>
          <SectionIntro>
            <Eyebrow>When to come</Eyebrow>
            <Display>There is no bad month, only different ones.</Display>
          </SectionIntro>

          <SeasonGrid>
            {SEASONS.map((season) => (
              <Season key={season.title}>
                <h3>{season.title}</h3>
                <p>{season.text}</p>
              </Season>
            ))}
          </SeasonGrid>
        </Container>
      </Section>

      <Section $tone="light">
        <Container>
          <SectionIntro>
            <Eyebrow>Good to know</Eyebrow>
            <Display>The practical bits.</Display>
          </SectionIntro>

          <HouseRules>
            <li>
              <strong>Arrival &amp; departure</strong>
              <span>
                Cabins are ready from 3pm and we ask that you leave by 11am.
                Reception is staffed 7am to 10pm; later arrivals are fine if you
                tell us.
              </span>
            </li>
            <li>
              <strong>Dogs</strong>
              <span>
                Welcome in seven of the fifteen cabins at no extra charge. They
                need to be on a lead near the lambing fields in spring.
              </span>
            </li>
            <li>
              <strong>Breakfast</strong>
              <span>
                Delivered to your door in a basket at whatever hour you choose,
                or eaten in the lodge with everyone else. Charged per guest, per
                night.
              </span>
            </li>
            <li>
              <strong>Getting here</strong>
              <span>
                An hour from the nearest city by car. The last stretch is
                unpaved but graded. Any car manages it. We can arrange a pickup
                from the station.
              </span>
            </li>
            <li>
              <strong>Phone signal</strong>
              <span>
                Patchy at best, and absent in the far cabins. The Wi-Fi is fibre
                and genuinely fast, so calls over it work fine.
              </span>
            </li>
            <li>
              <strong>Children</strong>
              <span>
                Very welcome. The lodge has a box of things for wet afternoons
                and the lake is shallow for a long way out.
              </span>
            </li>
          </HouseRules>
        </Container>
      </Section>

      <Section $tone="deep">
        <Container>
          <Closing>
            <Display>Come and see it.</Display>
            <Lede $onDark style={{ marginTop: "var(--space-5)", marginInline: "auto" }}>
              Tell us roughly when, and how many of you. We will write back
              within a day.
            </Lede>
            <div style={{ marginTop: "var(--space-8)" }}>
              <SiteLinkButton to="/contact" $variant="primary">
                Check availability
              </SiteLinkButton>
            </div>
          </Closing>
        </Container>
      </Section>
    </>
  );
}
