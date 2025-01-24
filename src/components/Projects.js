import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";

const allProjects = [
  {
    id: 1,
    name: "Get that A!",
    href: "https://kristanpanton.itch.io/get-that-a",
    imageSrc: "/get-that-a-screenshot (Custom).png",
    used: "Unity, C#",
    description:
      "First project for CS-321 - Intro to Game Programming. Simple platformer with wall jumping.",
  },
  {
    id: 2,
    name: "Color Match!",
    href: "https://kristanpanton.itch.io/color-match",
    imageSrc: "/colormatch.png",
    used: "Unity, C#",
    description:
      "Match the balls with their corresponding colors. WASD to move. Power up coin lets you grab (Press space).",
  },
  {
    id: 3,
    name: "Elby",
    href: "",
    imageSrc: "/elby (Custom).png",
    used: "React Native, Supabase, Clerk",
    description:
      "Mobile app for tracking mileage, logging expenses, and ensuring IRS compliance for short-term rental owners.",
  },
  {
    id: 4,
    name: "Killer Night",
    href: "https://kristanpanton.itch.io/killer-night",
    imageSrc: "/KillerNightScreenshot (Custom).png",
    used: "Unity, C#",
    description:
      "Find the skull in each level and escape. It's gonna be a killer night.",
  },
  {
    id: 5,
    name: "My Digital Garden",
    href: "https://kristans-garden.vercel.app",
    imageSrc: "/kristans-garden (Custom).png",
    used: "Next.js, React",
    description: "Just a place where I'll be posting notes.",
  },
  {
    id: 6,
    name: "Sensor Monitoring System",
    href: "",
    imageSrc: "/sensor-monitor.png",
    used: "Python, NumPy, Discord API",
    description:
      "Automated system tracking environmental data from IoT devices with real-time anomaly detection and alerts.",
  },
  {
    id: 7,
    name: "The Playgrounds",
    href: "",
    imageSrc: "/playgrounds.png",
    used: "Unity, C#",
    description:
      "Pastel-styled 3D world FPS with rag doll physics, projectile weapons, and enemy waves.",
  },
];

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll ? allProjects : allProjects.slice(0, 4);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <div id="projects">
      <div className="mx-auto max-w-2xl px-6 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        <h2 className="text-lg leading-7">Browse my recent</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
          Projects
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className="group relative ring-2 ring-base-300 bg-base-200 rounded-2xl shadow-xl"
              data-aos="flip-left"
            >
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:brightness-75 duration-300 delay-100 lg:h-80 rounded-t-2xl ">
                <img
                  src={project.imageSrc}
                  alt={project.name}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between p-4">
                <div className="p-4">
                  <h3 className="text-lg font-bold">
                    <a href={project.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {project.name}
                    </a>
                  </h3>
                  <p className="mt-1 mb-5 text-sm">{project.description}</p>
                  <p className="text-sm font-medium">{project.used}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <button
            className="btn btn-outline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View More"}
          </button>
        </div>
      </div>
    </div>
  );
}
