import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_URL = "/Kristan_Panton_Resume.pdf";

export default function Resume() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const onResize = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    onResize();
    const observer = new ResizeObserver(onResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [onResize]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

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

            {/* PDF Viewer */}
            <div ref={containerRef} className="w-full flex flex-col items-center">
              <Document
                file={PDF_URL}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center py-24 text-base-content opacity-50">
                    Loading resume…
                  </div>
                }
                error={
                  <div className="flex items-center justify-center py-24 text-error">
                    Failed to load resume.
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  width={containerWidth ? Math.min(containerWidth, 900) : undefined}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                  className="rounded-lg overflow-hidden shadow-md"
                />
              </Document>

              {/* Page navigation */}
              {numPages && numPages > 1 && (
                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="comic-card px-4 py-2 rounded-lg font-semibold text-sm transition hover:opacity-80 disabled:opacity-30"
                  >
                    ← Prev
                  </button>
                  <span className="text-sm opacity-60">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
                    disabled={pageNumber >= numPages}
                    className="comic-card px-4 py-2 rounded-lg font-semibold text-sm transition hover:opacity-80 disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <a
                href={PDF_URL}
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
