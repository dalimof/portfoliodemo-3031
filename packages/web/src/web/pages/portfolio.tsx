import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Braces,
  Check,
  Code2,
  Flower2,
  Grid2X2,
  Layers3,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import { CaseStudy, ProjectCard, projects, type Project } from "../components/projects";
import { ContactCard } from "../components/contact-card";

gsap.registerPlugin(ScrollTrigger);
const DreamScene = lazy(() =>
  import("../components/dream-scene").then((m) => ({ default: m.DreamScene })),
);
const chapters = ["Home", "About", "Projects", "Skills", "Contact"];
const skills = [
  {
    title: "Frontend & 3D",
    icon: Braces,
    items: ["React", "Next.js", "TypeScript", "Three.js / WebGL", "GSAP", "Tailwind CSS"],
  },
  {
    title: "AI & Web APIs",
    icon: Sparkles,
    items: [
      "LLM & Groq Integration",
      "Web Speech & Audio APIs",
      "Camera MediaDevices API",
      "HTML5 Canvas",
    ],
  },
  {
    title: "Design & Deployment",
    icon: Layers3,
    items: ["Interactive UI/UX", "Responsive Design", "Vercel"],
  },
];

export default function Portfolio() {
  const [quick, setQuick] = useState(false);
  const [active, setActive] = useState(0);
  const [percent, setPercent] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const [experiments, setExperiments] = useState(false);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const progress = useRef(0);
  const lenis = useRef<Lenis | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const closeModal = useCallback(() => setSelected(null), []);
  const jump = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis.current) lenis.current.scrollTo(el, { duration: 1.65, offset: 0 });
      else el.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    },
    [reduced],
  );
  useEffect(() => {
    if (!reduced) {
      const smooth = new Lenis({ duration: 1.25, smoothWheel: true, lerp: 0.065 });
      lenis.current = smooth;
      smooth.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => smooth.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        smooth.destroy();
        lenis.current = null;
      };
    }
  }, [reduced]);
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-entrance",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3, stagger: 0.12, ease: "power3.out", delay: 0.2 },
      );
      if (!reduced)
        gsap.utils
          .toArray<HTMLElement>(".reveal")
          .forEach((el) =>
            gsap.fromTo(
              el,
              { opacity: 0, y: 42 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 92%", once: true },
              },
            ),
          );
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.current = self.progress;
          setPercent(Math.round(self.progress * 100));
        },
      });
      chapters.forEach((c, i) =>
        ScrollTrigger.create({
          trigger: `#${c.toLowerCase()}`,
          start: "top 52%",
          end: "bottom 52%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        }),
      );
    }, root);
    ScrollTrigger.refresh();
    return () => context.revert();
  }, [quick, reduced]);
  useEffect(() => {
    if (selected) lenis.current?.stop();
    else lenis.current?.start();
  }, [selected]);
  return (
    <div ref={root} className={`portfolio ${quick ? "quick-mode" : ""}`}>
      {!quick && (
        <Suspense fallback={<div className="dream-scene" aria-hidden="true" />}>
          <DreamScene progress={progress} reduced={reduced} />
        </Suspense>
      )}
      <div
        className="scene-tint"
        style={{ opacity: quick ? 1 : Math.min(0.83, percent / 14) }}
        aria-hidden="true"
      />
      <header className={`site-header ${active > 0 || quick ? "header-dark" : ""}`}>
        <button className="wordmark" onClick={() => jump("home")} aria-label="Muhammadsafo home">
          muhammadsafo<span>®</span>
          <small>CREATIVE DEVELOPER</small>
        </button>
        <button
          className={`quick-toggle ${quick ? "enabled" : ""}`}
          aria-pressed={quick}
          onClick={() => {
            lenis.current?.scrollTo(0, { immediate: true, force: true });
            window.scrollTo({ top: 0, behavior: "instant" });
            setQuick((q) => !q);
            progress.current = 0;
            setPercent(0);
            setActive(0);
          }}
        >
          {quick ? <Layers3 size={15} /> : <Grid2X2 size={15} />}
          <span>{quick ? "3D Experience" : "Quick View"}</span>
          <span className="toggle-track">
            <i />
          </span>
        </button>
      </header>
      <nav
        className={`chapter-nav ${active > 0 || quick ? "nav-dark" : ""}`}
        aria-label="Jump to section"
      >
        <span className="nav-progress">{String(percent).padStart(2, "0")}%</span>
        <div className="nav-track">
          <i style={{ height: `${percent}%` }} />
        </div>
        {chapters.map((name, i) => (
          <button
            key={name}
            aria-label={`Go to ${name}`}
            aria-current={active === i ? "location" : undefined}
            className={active === i ? "active" : ""}
            onClick={() => jump(name.toLowerCase())}
          >
            <span className="nav-label">{name}</span>
            <i />
          </button>
        ))}
        <span className="nav-end">05</span>
      </nav>
      <main>
        <section id="home" className="hero">
          <div className="hero-bottom">
            <div className="hero-identity">
              <span className="hero-eyebrow hero-entrance">
                <span className="small-star">✦</span> INDEPENDENT CREATIVE DEVELOPER
              </span>
              <h1 className="hero-entrance">
                Muhammadsafo<span className="hero-period">.</span>
                <span className="sr-only"> — Creative Developer</span>
              </h1>
              <p className="hero-tagline hero-entrance">
                A little code. <em>A lot of imagination.</em>
              </p>
            </div>
            <div className="hero-aside hero-entrance">
              <span className="project-count">
                <i />
                <b>20+</b> COMPLETED PROJECTS
              </span>
              <p>
                Building digital experiences
                <br />
                that feel a little more <em>alive.</em>
              </p>
              <button onClick={() => jump("projects")} className="hero-work">
                Explore my work <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
          <div className="hero-footer hero-entrance">
            <span>CODE WITH PURPOSE. CREATE WITH FEELING.</span>
            <button className="scroll-explore" onClick={() => jump("about")}>
              <span className="mouse-icon">
                <i />
              </span>{" "}
              Scroll to explore <ArrowDown size={13} />
            </button>
            <span className="world-label">
              <i /> AVAILABLE FOR SELECT PROJECTS
            </span>
          </div>
          <div className="quick-hero-art" aria-hidden="true" />
        </section>
        <section id="about" className="about chapter">
          <div className="section-kicker reveal">
            <span>01 / THE DEVELOPER</span>
            <span>IMAGINATION, MEET IMPLEMENTATION.</span>
          </div>
          <div className="about-layout">
            <div>
              <h2 className="reveal">
                Not just websites.
                <br />
                <em>Little worlds.</em>
              </h2>
              <div className="about-seal reveal">
                <Flower2 size={29} strokeWidth={1} />
                <span>
                  CURIOUS BY NATURE.
                  <br />
                  CREATIVE BY CODE.
                </span>
              </div>
            </div>
            <div className="about-copy reveal">
              <span className="eyebrow">HEY, I'M MUHAMMADSAFO</span>
              <p className="bio">
                I craft immersive, interactive web experiences where clean code meets imaginative
                design—turning bold ideas into smooth, memorable digital worlds.
              </p>
              <p className="secondary-copy">
                From AI-powered conversations to playful 3D explorations, I turn curiosity into
                things you can click, feel, and get a little lost in.
              </p>
              <div className="about-stats">
                <div>
                  <strong>
                    20<span>+</span>
                  </strong>
                  <span>Completed projects</span>
                </div>
                <div>
                  <Code2 size={32} strokeWidth={1.1} />
                  <span>Endless curiosity</span>
                </div>
                <div>
                  <span className="stat-star">✧</span>
                  <span>One creative mind</span>
                </div>
              </div>
            </div>
          </div>
          <button className="text-button reveal" onClick={() => jump("projects")}>
            A few things I've brought to life <ArrowDown size={16} />
          </button>
        </section>
        <section id="projects" className="projects chapter">
          <div className="section-kicker reveal">
            <span>02 / SELECTED WORK</span>
            <span>IDEAS MADE INTERACTIVE.</span>
          </div>
          <div className="section-heading reveal">
            <h2>
              Made to <em>be explored.</em>
            </h2>
            <p>
              Four experiments. Different worlds.
              <br />
              The same love for the craft.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.name}
                project={project}
                index={i}
                onOpen={() => setSelected(project)}
              />
            ))}
          </div>
          <div className="more-projects reveal">
            <span>
              <Sparkles size={20} /> There's always another idea in the works.
            </span>
            <button
              className="text-button"
              onClick={() => setExperiments((e) => !e)}
              aria-expanded={experiments}
            >
              Explore 20+ more web experiments & apps <ArrowUpRight size={17} />
            </button>
          </div>
          {experiments && (
            <section className="experiment-note" aria-label="More web experiments">
              <h3>The experiments don't stop here.</h3>
              <p>
                Ask me about my collection of web experiments, creative tools, and apps. Let's find
                something that inspires your next idea.
              </p>
              <a
                href="https://t.me/dalimoff"
                target="_blank"
                rel="noreferrer"
                className="dark-button"
              >
                Explore with me on Telegram <ArrowUpRight size={16} />
              </a>
            </section>
          )}
        </section>
        <section id="skills" className="skills chapter">
          <div className="section-kicker reveal">
            <span>03 / THE TOOLKIT</span>
            <span>THE MAGIC BEHIND THE MOMENT.</span>
          </div>
          <div className="section-heading reveal">
            <h2>
              A creative mind.
              <br />
              <em>A considered stack.</em>
            </h2>
            <p>
              The right tools to turn
              <br />
              “what if” into “here it is”.
            </p>
          </div>
          <div className="skill-groups">
            {skills.map(({ title, icon: Icon, items }, i) => (
              <div className="skill-group reveal" key={title}>
                <div className="skill-group-heading">
                  <span className="skill-icon">
                    <Icon size={22} strokeWidth={1.4} />
                  </span>
                  <h3>{title}</h3>
                  <span className="skill-number">0{i + 1}</span>
                </div>
                <div className="skill-pills">
                  {items.map((t) => (
                    <span key={t}>
                      {t}
                      <Check size={12} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="skill-outro reveal">
            <Flower2 size={20} /> Always learning. Always making something new.
          </p>
        </section>
        <section id="contact" className="contact chapter">
          <div className="section-kicker reveal">
            <span>04 / SAY HELLO</span>
            <span>EVERY GREAT THING STARTS WITH A CONVERSATION.</span>
          </div>
          <div className="section-heading reveal">
            <h2>
              Let's build
              <br />
              <em>something unexpected.</em>
            </h2>
            <MoveUpRight className="contact-heading-arrow" size={74} strokeWidth={0.6} />
          </div>
          <ContactCard />
          <footer className="footer">
            <div>
              <button className="footer-brand" onClick={() => jump("home")}>
                muhammadsafo<sup>®</sup>
              </button>
              <p>Imagination, brought to life.</p>
            </div>
            <span>© {new Date().getFullYear()} MUHAMMADSAFO</span>
            <button className="back-top" onClick={() => jump("home")}>
              Fly back to top{" "}
              <span>
                <ArrowUp size={18} />
              </span>
            </button>
          </footer>
        </section>
      </main>
      {selected && <CaseStudy project={selected} onClose={closeModal} />}
    </div>
  );
}
