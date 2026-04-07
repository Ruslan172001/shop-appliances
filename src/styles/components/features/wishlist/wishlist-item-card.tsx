import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import Image from "next/image";
import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";
import type { IWishlistItem } from "types";
interface WishlistItemCardProps {
  item: IWishlistItem;
  onRemoveItem: (productId: string) => void;
}
export default function WishlistItemCard({
  item,
  onRemoveItem,
}: WishlistItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.price}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image src={item.image} width={100} height={100} alt={item.name} />
      </CardContent>
      <CardFooter>
        <Button onClick={() => onRemoveItem(item.productId)}>
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  );
}
