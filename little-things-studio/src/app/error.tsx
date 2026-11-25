"use client";
import { useEffect } from "react";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="px-page flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center" role="alert">
      <p className="t-label-md text-error">Something went wrong</p>
      <h1 className="t-headline-lg text-primary">We dropped a little thing.</h1>
      <p className="t-body-md max-w-md text-on-surface-variant">An unexpected error occurred while loading this page. You can try again.</p>
      <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
    </section>
  );
}
