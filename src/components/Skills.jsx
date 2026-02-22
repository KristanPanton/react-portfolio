import { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import AOS from "aos";
import "aos/dist/aos.css";

const skills = [
  { name: "TypeScript", icon: CheckCircleIcon },
  { name: "React Native", icon: CheckCircleIcon },
  { name: "React", icon: CheckCircleIcon },
  { name: "Node.js", icon: CheckCircleIcon },
  { name: "Expo", icon: CheckCircleIcon },
  { name: "Express", icon: CheckCircleIcon },
  { name: "Git/Version Control", icon: CheckCircleIcon },
  { name: "Python", icon: CheckCircleIcon },
  { name: "C/C++", icon: CheckCircleIcon },
  { name: "Java", icon: CheckCircleIcon },
  { name: "Supabase", icon: CheckCircleIcon },
  { name: "Unity/C#", icon: CheckCircleIcon },
  { name: "Redis", icon: CheckCircleIcon },
  { name: "RabbitMQ", icon: CheckCircleIcon },
  { name: "Postman", icon: CheckCircleIcon },
  { name: "Sentry", icon: CheckCircleIcon },
];

export default function Skills() {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);
  
  return (
    <div className="py-12 sm:py-32" id="skills">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-label">Explore my</h2>
          <p className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl section-title">
            Skills
          </p>
        </div>
        <div className="mt-8 sm:mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="bg-base-100 comic-card p-3 sm:p-4"
              data-aos="zoom-in"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <skill.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                <h3 className="text-sm sm:text-base font-semibold">{skill.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
