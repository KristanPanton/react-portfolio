import { AcademicCapIcon, BriefcaseIcon } from "@heroicons/react/20/solid";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

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
            <div className="mt-10">
              <h2 className="text-3xl font-bold text-center mb-6 sm:mb-10">
                Professional Timeline
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 w-1 h-full bg-base-300"></div>

                {/* Timeline items */}
                <div className="space-y-8 sm:space-y-12">
                  {/* Full Stack Developer */}
                  <div className="relative" data-aos="fade-right">
                    <div className="sm:ml-auto sm:w-1/2 ml-12 sm:pr-10">
                      <div className="p-3 sm:p-4 bg-base-200 rounded-lg shadow-xl ring-2 ring-base-300">
                        <div className="flex items-center mb-2">
                          <BriefcaseIcon className="h-5 w-5 mr-2" />
                          <h3 className="text-lg font-bold">
                            Full Stack Developer
                          </h3>
                        </div>
                        <p className="text-sm mb-1">
                          Temps Are Us, Inc. | Medway, Massachusetts
                        </p>
                        <p className="text-sm mb-2">June 2024 – Present</p>
                        <ul className="list-disc pl-4">
                          <li>
                            Developed job listing application using React Native
                            and Supabase which connected dental temp workers
                            with hiring dental offices, reducing administration
                            burden.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Licensed Salesperson */}
                  <div className="relative" data-aos="fade-left">
                    <div className="ml-12 sm:w-1/2 sm:pl-10 sm:ml-0">
                      <div className="p-3 sm:p-4 bg-base-200 rounded-lg shadow-xl ring-2 ring-base-300">
                        <div className="flex items-center mb-2">
                          <BriefcaseIcon className="h-5 w-5 mr-2" />
                          <h3 className="text-lg font-bold">
                            Licensed Salesperson
                          </h3>
                        </div>
                        <p className="text-sm mb-1">
                          Weichert Realtors | Larchmont, NY
                        </p>
                        <p className="text-sm mb-2">April 2022 – Present</p>
                        <ul className="list-disc pl-4">
                          <li>
                            Led 25+ property showings, coordinating targeted
                            email marketing campaigns that improved client
                            engagement by 30%.
                          </li>
                          <li>
                            Optimized communication with 1,000+ prospects by
                            implementing automated follow-ups using kvCORE,
                            increasing response rates by 20%.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Research Intern */}
                  <div className="relative" data-aos="fade-right">
                    <div className="sm:ml-auto sm:w-1/2 ml-12 sm:pr-10">
                      <div className="p-3 sm:p-4 bg-base-200 rounded-lg shadow-xl ring-2 ring-base-300">
                        <div className="flex items-center mb-2">
                          <BriefcaseIcon className="h-5 w-5 mr-2" />
                          <h3 className="text-lg font-bold">
                            Research Intern (Seasonal)
                          </h3>
                        </div>
                        <p className="text-sm mb-1">
                          Louis Stokes Alliances for Minority Participation |
                          Binghamton, NY
                        </p>
                        <p className="text-sm mb-2">June 2020 – July 2021</p>
                        <ul className="list-disc pl-4">
                          <li>
                            Developed a Python-based GUI to diagnose 7 classes
                            of manufacturing defects using scraped data from
                            Beautiful Soup.
                          </li>
                          <li>
                            Led comparative analysis of 7+ self-driving car
                            simulation software, identifying the top 2 most
                            accessible and high performing platforms, later used
                            by research teams for autonomous vehicle testing.
                          </li>
                          <li>
                            Presented research findings at UB Research
                            Conference and Illinois TRIO McNair Virtual
                            Symposium to audiences of 30+ peers and researchers.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="relative" data-aos="fade-left">
                    <div className="ml-12 sm:w-1/2 sm:pl-10 sm:ml-0">
                      <div className="p-3 sm:p-4 bg-base-200 rounded-lg shadow-xl ring-2 ring-base-300">
                        <div className="flex items-center mb-2">
                          <AcademicCapIcon className="h-5 w-5 mr-2" />
                          <h3 className="text-lg font-bold">
                            Bachelor of Science in Computer Science
                          </h3>
                        </div>
                        <p className="text-sm mb-1">Pace University</p>
                        <p className="text-sm mb-2">2020 - Present</p>
                        <p>Dean's List, Minor in Mathematics</p>
                        <p>
                          Key Courses: Web Authoring & Digital Media, Data
                          Structures & Algorithms, Software Engineering
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
