import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import LiveProjectButton from '../components/LiveProjectButton';

const projects = [
  {
    number: '01',
    category: 'Client',
    name: 'Nextlevel Studio',
    col1img1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1img2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    col2img:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
  {
    number: '02',
    category: 'Personal',
    name: 'Aura Brand Identity',
    col1img1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    col1img2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2img:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },
  {
    number: '03',
    category: 'Client',
    name: 'Solaris Digital',
    col1img1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    col1img2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    col2img:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  },
];

const TOTAL_CARDS = projects.length;

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const targetScale = 1 - (TOTAL_CARDS - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  const borderRadius = 'clamp(40px, 5vw, 60px)';

  return (
    <div
      ref={cardRef}
      className="h-[85vh] flex items-start justify-center"
      style={{ paddingTop: `${index * 28}px` }}
    >
      <motion.div
        className="
          sticky top-24 md:top-32
          w-full border-2 border-[#D7E2EA] bg-[#0C0C0C]
          p-4 sm:p-6 md:p-8
          origin-top
        "
        style={{
          scale,
          borderRadius,
          top: `calc(6rem + ${index * 28}px)`,
        }}
      >
        {/* ── TOP ROW ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4 sm:mb-6">
          {/* Number */}
          <span
            className="hero-heading font-black leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 120px)' }}
          >
            {project.number}
          </span>

          {/* Category + Name */}
          <div className="flex flex-col items-start">
            <span
              className="text-[#D7E2EA] font-light uppercase tracking-widest opacity-60"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1rem)' }}
            >
              {project.category}
            </span>
            <span
              className="text-[#D7E2EA] font-black uppercase tracking-tight leading-none"
              style={{ fontSize: 'clamp(1.2rem, 3vw, 2.8rem)' }}
            >
              {project.name}
            </span>
          </div>

          {/* Live Project button */}
          <LiveProjectButton />
        </div>

        {/* ── BOTTOM GRID ── */}
        <div className="flex gap-3 sm:gap-4">
          {/* Left col — 40% width, 2 stacked images */}
          <div className="flex flex-col gap-3 sm:gap-4" style={{ flex: '0 0 40%' }}>
            <img
              src={project.col1img1}
              alt={`${project.name} preview 1`}
              loading="lazy"
              className="w-full object-cover"
              style={{
                borderRadius,
                height: 'clamp(130px, 16vw, 230px)',
              }}
            />
            <img
              src={project.col1img2}
              alt={`${project.name} preview 2`}
              loading="lazy"
              className="w-full object-cover"
              style={{
                borderRadius,
                height: 'clamp(160px, 22vw, 340px)',
              }}
            />
          </div>

          {/* Right col — 60% width, 1 tall image */}
          <div style={{ flex: '1' }}>
            <img
              src={project.col2img}
              alt={`${project.name} main`}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ borderRadius }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="
        bg-[#0C0C0C]
        rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        -mt-10 sm:-mt-12 md:-mt-14
        z-10 relative
        px-5 sm:px-8 md:px-10
        pt-20 sm:pt-24 md:pt-32
        pb-32
      "
    >
      {/* Heading */}
      <FadeIn delay={0} y={40} className="mb-12 sm:mb-16 md:mb-20">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Project
        </h2>
      </FadeIn>

      {/* Sticky stacking cards */}
      <div className="flex flex-col">
        {projects.map((project, i) => (
          <ProjectCard key={project.number} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
