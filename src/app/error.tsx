"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <h2>Произошла ошибка</h2>
      <p>{error.message || "Что-то пошло не так"}</p>
      <button onClick={() => unstable_retry()}>Попробовать снова</button>
    </div>
  );
}
