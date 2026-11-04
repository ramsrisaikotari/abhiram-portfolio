import { useEffect } from "react";
import Footer from "./Footer";

export default function NotFound() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Page not found | Abhi Ram Kotari";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <>
      <main className="not-found section-shell">
        <h1>Page not found</h1>
        <a className="button button-primary" href="/">Back to homepage</a>
      </main>
      <Footer />
    </>
  );
}
