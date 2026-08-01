import styled from "styled-components";
import {
  HiOutlineClock,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";
import {
  Body,
  Container,
  Display,
  Eyebrow,
  Heading,
  Lede,
  Section,
  SectionIntro,
} from "../ui/primitives";
import EnquiryForm from "../ui/EnquiryForm";
import PageMeta from "../../ui/PageMeta";
import { breadcrumbSchema } from "../../lib/seo";

const Layout = styled.div`
  display: grid;
  gap: var(--space-16);
  grid-template-columns: 1fr 1fr;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }
`;

const FormCard = styled.div`
  background-color: var(--site-bg-alt);
  border: 1px solid var(--site-line);
  border-radius: var(--radius-lg);
  padding: var(--space-8);

  @media (max-width: 600px) {
    padding: var(--space-5);
  }
`;

const Details = styled.ul`
  display: grid;
  gap: var(--space-6);
  margin-top: var(--space-8);

  & li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-4);
  }
  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--site-accent);
    flex-shrink: 0;
    margin-top: 0.2rem;
  }
  & strong {
    display: block;
    font-weight: 500;
    margin-bottom: 0.4rem;
  }
  & span,
  & a {
    color: var(--site-ink-soft);
    line-height: 1.6;
  }
  & a:hover {
    color: var(--site-accent);
  }
`;

/* A drawn map rather than an embedded one: no third-party script, no cookie
   banner, and it still communicates "we are a long way out". */
const MapCard = styled.div`
  margin-top: var(--space-10);
  border: 1px solid var(--site-line);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--site-bg-alt);

  & figcaption {
    padding: var(--space-4) var(--space-5);
    font-size: var(--text-sm);
    color: var(--site-ink-muted);
    border-top: 1px solid var(--site-line);
  }
`;

const MapArt = styled.svg`
  width: 100%;
  height: auto;
  display: block;
  background-color: var(--pine-950);
`;

const Faq = styled.div`
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  margin-top: var(--space-10);

  & h3 {
    font-size: var(--text-md);
    font-weight: 600;
    margin-bottom: var(--space-2);
  }
  & p {
    color: var(--site-ink-soft);
    line-height: 1.7;
  }
`;

export default function Contact() {
  return (
    <>
      <PageMeta
        title="Contact"
        path="/contact"
        description="Send an enquiry and we will confirm by email, or reach reception directly. Vale Road, Pine Hollow, open all year."
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <Section $tone="light">
        <Container>
          <SectionIntro>
            <Eyebrow>Check availability</Eyebrow>
            <Display as="h1">
              Tell us when, and we will tell you <em>what is free</em>.
            </Display>
            <Lede>
              We do not run an instant-booking system on purpose. A person reads
              every enquiry and replies within a day, usually sooner.
            </Lede>
          </SectionIntro>

          <Layout>
            <FormCard>
              <EnquiryForm />
            </FormCard>

            <div>
              <Heading as="h2">Or reach us directly</Heading>
              <Body style={{ marginTop: "var(--space-4)" }}>
                The desk is staffed seven days a week. If you are already on your
                way and running late, call rather than email.
              </Body>

              <Details>
                <li>
                  <HiOutlineMapPin aria-hidden="true" />
                  <div>
                    <strong>Alpenglow Retreat</strong>
                    <span>
                      Vale Road, Pine Hollow
                      <br />
                      Open all year
                    </span>
                  </div>
                </li>
                <li>
                  <HiOutlinePhone aria-hidden="true" />
                  <div>
                    <strong>Reception</strong>
                    <a href="tel:+15550142200">+1 555 014 2200</a>
                  </div>
                </li>
                <li>
                  <HiOutlineEnvelope aria-hidden="true" />
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:stay@alpenglow.test">stay@alpenglow.test</a>
                  </div>
                </li>
                <li>
                  <HiOutlineClock aria-hidden="true" />
                  <div>
                    <strong>Desk hours</strong>
                    <span>
                      7am – 10pm daily. Late arrivals welcome with notice.
                    </span>
                  </div>
                </li>
              </Details>

              <MapCard as="figure">
                <MapArt viewBox="0 0 600 300" role="img" aria-label="Sketch map of the estate and the road in">
                  <defs>
                    <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1c352a" />
                      <stop offset="100%" stopColor="#0a160f" />
                    </linearGradient>
                  </defs>

                  {/* ridgeline */}
                  <path d="M0 190 L90 120 L150 165 L230 90 L310 160 L390 110 L470 170 L540 130 L600 175 L600 300 L0 300 Z"
                        fill="url(#ridge)" />
                  {/* lake */}
                  <ellipse cx="200" cy="245" rx="86" ry="26" fill="#132b23" />
                  {/* road in */}
                  <path d="M0 285 C 140 275, 240 250, 330 230 S 470 200, 600 205"
                        stroke="#bfaa89" strokeWidth="2.5" strokeDasharray="10 8" fill="none" />
                  {/* cabins */}
                  {[[350,215],[398,205],[300,232],[440,198],[470,208],[262,238]].map(([x,y]) => (
                    <g key={`${x}-${y}`}>
                      <path d={`M${x-6} ${y} L${x} ${y-7} L${x+6} ${y} Z`} fill="#e8834c" />
                      <rect x={x-4} y={y} width="8" height="6" fill="#e8834c" opacity="0.75" />
                    </g>
                  ))}
                  {/* sun */}
                  <circle cx="505" cy="72" r="22" fill="#eda36c" opacity="0.9" />

                  <text x="24" y="272" fill="#bfaa89" fontSize="13" fontFamily="Inter, sans-serif">
                    Vale Road
                  </text>
                  <text x="150" y="250" fill="#5f8d76" fontSize="13" fontFamily="Inter, sans-serif">
                    the lake
                  </text>
                  <text x="392" y="185" fill="#f3f1ec" fontSize="14" fontFamily="Inter, sans-serif">
                    the cabins
                  </text>
                </MapArt>
                <figcaption>
                  An hour from the city, then six miles of graded track. Full
                  directions come with your confirmation.
                </figcaption>
              </MapCard>
            </div>
          </Layout>
        </Container>
      </Section>

      <Section $tone="alt">
        <Container>
          <Heading as="h2">Before you ask</Heading>
          <Faq>
            <div>
              <h3>Do you take deposits?</h3>
              <p>
                Half on confirmation, the balance on arrival. We take cards at
                the desk; nothing is charged when you send an enquiry.
              </p>
            </div>
            <div>
              <h3>What if the weather turns?</h3>
              <p>
                Every cabin is heated and the track is cleared through winter. We
                have not been cut off since 2018.
              </p>
            </div>
            <div>
              <h3>Can we bring a dog?</h3>
              <p>
                In seven of the cabins, at no extra charge. Say so in your
                enquiry and we will put you in one of them.
              </p>
            </div>
            <div>
              <h3>Is there a minimum stay?</h3>
              <p>
                Yes, and it varies by season. The form will tell you the current
                minimum as you pick your dates.
              </p>
            </div>
          </Faq>
        </Container>
      </Section>
    </>
  );
}
