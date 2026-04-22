"use client";

import Link from "next/link";
import { StarRating } from "@/styles/components/shared/star-rating";
import type {AdminReview} from "./reviews-table"

interface ReviewModerationCardProps{
    review:AdminReview;
}

export function ReviewModerationCard({review}:ReviewModerationCardProps){
    return(
        <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 space-y-1">
                    <p className="text-muted-foreground text-xs">Товар</p>
                    <Link
                    href={`/product/${review.product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline break-words"
                    >{review.product.name}
                    </Link>
                </div>
            <StarRating rating={review.rating} size="sm"/>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>Пользователь:{" "}
                    <span className="text-foreground">
                        {review.user.name||review.user.email||"-"}
                    </span>
                </span>
                <span>{review.user.email}</span>
                <span>
                    {new Date(review.createdAt).toLocaleString("ru-RU",{
                        dateStyle:"short",
                        timeStyle:"short",
                    })}
                </span>
            </div>
        </div>
    )
}