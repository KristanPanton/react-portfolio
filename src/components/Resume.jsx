import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function Resume() {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <div
      className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-0"
      id="resume"
    >
      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none" data-aos="fade-up">
          <div className="comic-card bg-base-100 p-6 sm:p-8 rounded-xl">
            <h2 className="section-label">View my credentials</h2>
            <p className="mt-2 text-4xl section-title sm:text-6xl mb-8">
              Resume
            </p>
            <div className="w-full" style={{ height: "80vh", minHeight: "600px" }}>
              <iframe
                src="/Kristan_Panton_Resume.pdf"
                title="Kristan Panton Resume"
                className="w-full h-full rounded-lg border border-base-300"
                style={{ display: "block" }}
              />
            </div>
            <div className="mt-6 flex justify-center">
              <a
                href="/Kristan_Panton_Resume.pdf"
                download
                className="comic-card px-6 py-3 rounded-lg font-semibold text-sm transition hover:opacity-80"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
