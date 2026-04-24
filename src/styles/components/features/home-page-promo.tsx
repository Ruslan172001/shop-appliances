import { getHomepagePromo } from "@/lib/promo-service";
import { PromoBanner } from "../ui/promo-banner";

export async function HomepagePromo() {
  const promo = await getHomepagePromo();
  if (!promo) return null;

  return <PromoBanner promo={promo} />;
}
