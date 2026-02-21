import { useEffect, useState } from "react";

export default function Quote() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/quotes/random")
      .then((r) => r.json())
      .then((data) => setQuote({ text: data.quote, author: data.author }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-6 py-12 lg:px-8 flex justify-center" data-aos="fade-up">
      <div className="quote_container comic-card bg-base-100 p-8 w-full max-w-2xl">
        {loading ? (
          <p className="opacity-40 text-center font-body">Loading quote…</p>
        ) : quote ? (
          <>
            <blockquote className="quote_text">
              {quote.text}
            </blockquote>
            <cite className="author">{quote.author}</cite>
          </>
        ) : (
          <p className="opacity-40 text-center font-body">Quote unavailable.</p>
        )}
      </div>
    </div>
  );
}
