interface PromoSexctionProps {
  children: React.ReactNode;
}
export function PromoSection({ children }: PromoSexctionProps) {
  return <div className="flex flex-col gap-4">{children}</div>;
}
