import {
  ArrowUpRight,
  AudioLines,
  Camera,
  ChevronRight,
  Clock3,
  Mic,
  Orbit,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";

export const projects = [
  {
    name: "AI Yordamchi",
    category: "AI EXPERIENCE",
    description: "A little intelligence. A lot of personality.",
    detail:
      "A multilingual AI assistant with custom characters, voice recognition, and auto-read speech. Designed to make everyday conversations feel more natural, accessible, and personal.",
    tags: ["AI integration", "Web Speech API", "Interactive UI"],
    url: "https://vercel.app",
    kind: "ai",
  },
  {
    name: "Muhammad Safo Camera",
    category: "CREATIVE TOOL",
    description: "Your browser. Your own creative studio.",
    detail:
      "A browser-based pro camera studio with photo and video modes, flexible aspect ratios, grid overlays, and a built-in gallery. A focused studio experience, with no extra app to install.",
    tags: ["MediaDevices API", "HTML5 Canvas", "Photo & video"],
    url: "https://vercel.app",
    kind: "camera",
  },
  {
    name: "3D Solar System",
    category: "IMMERSIVE WEB",
    description: "A small window into an infinite universe.",
    detail:
      "An interactive space and planetary visualization built for the web. Explore a three-dimensional solar system and discover how motion, scale, and perspective bring a digital universe to life.",
    tags: ["Three.js", "WebGL", "3D interaction"],
    url: "https://vercel.com",
    kind: "space",
  },
  {
    name: "Flip Clock Studio",
    category: "EVERYDAY EXPERIMENT",
    description: "Make a little more time for the moment.",
    detail:
      "A minimalist aesthetic time suite featuring a retro flip clock, timer, and stopwatch. A quiet, thoughtfully designed utility that puts typography and subtle motion at the center.",
    tags: ["Creative UI", "Animation", "Time utilities"],
    url: "https://vercel.app",
    kind: "clock",
  },
];
export type Project = (typeof projects)[number];

export function ProjectArt({ kind }: { kind: string }) {
  return (
    <div className={`project-art art-${kind}`} aria-hidden="true">
      {kind === "ai" ? (
        <>
          <div className="mini-top">
            <Sparkles size={12} />
            <span>Yordamchi</span>
            <span className="mini-dot" />
          </div>
          <div className="ai-orb">
            <AudioLines size={39} strokeWidth={1.2} />
          </div>
          <p>How can I help you dream?</p>
          <div className="ai-input">
            Ask me anything <Mic size={13} />
          </div>
        </>
      ) : kind === "camera" ? (
        <>
          <div className="camera-mini">
            <span>
              SAFO <b>CAMERA</b>
            </span>
            <Camera size={14} />
          </div>
          <div className="camera-view">
            <div className="view-grid" />
            <div className="camera-flower">✳</div>
            <span className="rec">● LIVE</span>
            <span className="ratio">16 : 9</span>
          </div>
          <div className="camera-controls">
            <span>PHOTO</span>
            <i />
            <span>VIDEO</span>
          </div>
        </>
      ) : kind === "space" ? (
        <>
          <div className="stars" />
          <div className="space-orbit o1" />
          <div className="space-orbit o2" />
          <div className="space-orbit o3" />
          <div className="sun" />
          <div className="planet p1" />
          <div className="planet p2" />
          <div className="planet p3" />
          <span className="space-caption">
            <Orbit size={12} /> OUR SOLAR SYSTEM
          </span>
        </>
      ) : (
        <>
          <span className="clock-mini">
            <Clock3 size={12} /> FLIP CLOCK STUDIO
          </span>
          <div className="flip-time">
            <div>10</div>
            <span>:</span>
            <div>24</div>
          </div>
          <div className="clock-tabs">
            <span className="selected">Clock</span>
            <span>Timer</span>
            <span>Stopwatch</span>
          </div>
          <small>A little time. A little peace.</small>
        </>
      )}
    </div>
  );
}

export function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      className="project-card reveal"
      onClick={onOpen}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--rx", `${-(e.clientY - r.top - r.height / 2) / 60}deg`);
        e.currentTarget.style.setProperty("--ry", `${(e.clientX - r.left - r.width / 2) / 60}deg`);
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--rx", "0deg");
        e.currentTarget.style.setProperty("--ry", "0deg");
      }}
    >
      <ProjectArt kind={project.kind} />
      <div className="project-info">
        <div className="project-meta">
          <span>{project.category}</span>
          <span>0{index + 1}</span>
        </div>
        <div className="project-title">
          <h3>{project.name}</h3>
          <span className="round-arrow">
            <ArrowUpRight size={19} />
          </span>
        </div>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.tags.slice(0, 2).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </button>
  );
}

export function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const box = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    box.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const els = box.current?.querySelectorAll<HTMLElement>("button,a");
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" data-lenis-prevent>
      <button className="backdrop-dismiss" aria-label="Dismiss case study" onClick={onClose} tabIndex={-1} />
      <dialog
        className="case-modal"
        open
        aria-modal="true"
        aria-labelledby="case-title"
        ref={box}
        tabIndex={-1}
      >
        <button className="close-modal" onClick={onClose} aria-label="Close case study">
          <X size={20} />
        </button>
        <ProjectArt kind={project.kind} />
        <div className="case-body">
          <span className="eyebrow">SELECTED EXPERIMENT / {project.category}</span>
          <h2 id="case-title">{project.name}</h2>
          <p>{project.detail}</p>
          <div className="project-tags">
            {project.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="case-note">
            <Sparkles size={17} />
            <span>
              An exploration of useful ideas, playful interactions, and thoughtful web experiences.
            </span>
          </div>
          <a className="dark-button" href={project.url} target="_blank" rel="noreferrer">
            Launch Live App <ArrowUpRight size={18} />
          </a>
          <small className="destination-note">
            Opens the supplied {new URL(project.url).hostname} destination.
          </small>
          <button className="text-button" onClick={onClose}>
            Back to the journey <ChevronRight size={14} />
          </button>
        </div>
      </dialog>
    </div>
  );
}
