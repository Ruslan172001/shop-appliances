import { Spinner } from "@/styles/components/ui/spinner";

export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex items-center justify-center p-4"
    >
      <p>Загрузка...</p>
      <Spinner />
    </div>
  );
}
