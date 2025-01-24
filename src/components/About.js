import {
  AcademicCapIcon,
  BriefcaseIcon
} from "@heroicons/react/20/solid";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

// const features = [
//   {
//     name: "Email:",
//     description: "kristan.e.panton@pace.edu",
//     icon: AtSymbolIcon,
//   },
//   {
//     name: "Location:",
//     description: "NY 10562",
//     icon: MapPinIcon,
//   },
// ];

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);
  return (
    <div
      className="relative isolate overflow-hidden  px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      id="about"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <h2 className="text-lg leading-7">Get to know more</h2>
              <p className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
                About Me
              </p>
              <p className="mt-6 text-lg leading-8" data-aos="fade-right">
                Hello, I'm Kristan Panton, a Computer Science student at Pace
                University with a concentration in Software Engineering. I have
                a passion for developing innovative solutions and have worked on
                various projects ranging from mobile apps to full-stack web
                applications. My technical skills include programming languages
                like C, C++, Python, Java, and JavaScript, and I am proficient
                in frameworks and technologies such as React Native, Supabase,
                and MongoDB. I am also experienced in using tools like VS Code,
                Git, and Unity. I am committed to continuous learning and am
                always looking for new challenges to improve my skills.
              </p>
            </div>
          </div>
        </div>
        <div
          className="-ml-12 -mt-12 p-12 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden"
          data-aos="fade-left"
        >
          <img
            className="w-[38rem] ring-2 ring-base-300 max-w-none rounded-xl shadow-xl sm:w-[57rem]"
            src="/about-pic.jpg"
            alt="Person"
          />
        </div>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:gap-x-8 lg:px-8">
          <div className="text-base leading-7">
            <div className="grid gap-x-6 sm:grid-cols-2">
              <div
                className="ring-2 ring-base-300 bg-base-200 rounded-2xl mt-10 p-5 shadow-xl"
                data-aos="zoom-in"
              >
                <BriefcaseIcon className="h-5 w-5 mx-auto" aria-hidden="true" />
                <h2 className=" text-2xl text-center font-bold tracking-tight">
                  Experience
                </h2>
                <p className="mt-3 list-item list-inside">
                  Full Stack Developer at Temps Are Us, Inc. - Developed a job
                  listing application using React Native and Supabase.
                </p>
                <p className="mt-3 list-item list-inside">
                  Licensed Salesperson at Weichert Realtors - Led property
                  showings and optimized client communication.
                </p>
                <p className="mt-3 list-item list-inside">
                  Research Intern at Louis Stokes Alliances for Minority
                  Participation - Developed a Python-based GUI for diagnosing
                  manufacturing defects.
                </p>
              </div>
              <div
                className="ring-2 ring-base-300 bg-base-200 rounded-2xl mt-10 p-5 shadow-xl"
                data-aos="zoom-in"
              >
                <AcademicCapIcon
                  className="h-5 w-5 mx-auto"
                  aria-hidden="true"
                />
                <h2 className="text-2xl text-center font-bold tracking-tigh">
                  Education
                </h2>
                <p className="mt-3 list-item list-inside">
                  Bachelor of Science in Computer Science, Pace University,
                  Dean’s List, Minor in Mathematics.
                </p>
                <p className="mt-3 list-item list-inside">
                  Relevant Coursework: Web Authoring & Digital Media, Data
                  Structures & Algorithms, Software Engineering.
                </p>
              </div>
            </div>
            {/* <dl
              className="mt-10 space-y-8 text-base leading-7 lg:max-w-none"
              data-aos="fade-right"
            >
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-9">
                  <dt className="inline font-semibold">
                    <feature.icon
                      className="absolute left-1 top-1 h-5 w-5"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>{" "}
                  <dd className="inline">{feature.description}</dd>
                </div>
              ))}
            </dl> */}
          </div>
        </div>
      </div>
    </div>
  );
}
