import { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import AOS from "aos";
import "aos/dist/aos.css";

const skills = [
  { name: "JavaScript/TypeScript", icon: CheckCircleIcon },
  { name: "React Native", icon: CheckCircleIcon },
  { name: "Web Development", icon: CheckCircleIcon },
  { name: "Git/Version Control", icon: CheckCircleIcon },
  { name: "Python", icon: CheckCircleIcon },
  { name: "C/C++", icon: CheckCircleIcon },
  { name: "Java", icon: CheckCircleIcon },
  { name: "MongoDB/Supabase", icon: CheckCircleIcon },
  { name: "Unity/C#", icon: CheckCircleIcon },
  { name: "Firebase/Express", icon: CheckCircleIcon },
];

export default function Skills() {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);
  
  return (
    <div className="py-24 sm:py-32" id="skills">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl leading-7">Explore my</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
            Skills
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="bg-base-200 ring-2 ring-base-300 rounded-2xl p-4 shadow-xl"
              data-aos="zoom-in"
            >
              <div className="flex items-center space-x-3">
                <skill.icon className="h-6 w-6" aria-hidden="true" />
                <h3 className="text-lg font-semibold">{skill.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
