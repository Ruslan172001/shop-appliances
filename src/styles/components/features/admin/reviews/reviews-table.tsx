"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/styles/components/ui/button";
import { StarRating } from "@/styles/components/shared/star-rating";
import Link from "next/link";
import { ExternalLink,Pencil,Trash2 } from "lucide-react";
import {ReviewCommentPreview} from "./reviews-table-row" 

export interface AdminReview{
    id:string;
    rating:number;
    comment:string|null;
    createdAt:string;
    user:{id:string;name:string|null;email:string|null};
    product:{id:string;name:string;slug:string};
}

export function getReviewColumns(
    onEdit:(review:AdminReview)=>void,
    onDelete:(review:AdminReview)=>void,
):ColumnDef<AdminReview>[]{
    return [
        {
            accessorKey:"product",
            header:"Товар",
            cell:({row})=>{
                const review = row.original;
                return (
                    <div className="max-w-[14rem]">
                        <Link
                        href={`/product/${review.product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline line-clamp-2 inline-flex items-start gap-1"
                        >
                            {review.product.name}
                            <ExternalLink className="h-3 w-3 shrink-0 mt-0.5 opacity-60"/>
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">
                            {review.user.name ||review.user.email||"Пользователь"}
                        </p>
                    </div>
                )
            }
        },
        {
            accessorKey:"rating",
            header:"Оценка",
            cell:({row})=>(
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <StarRating rating={row.original.rating} size="sm"/>
                    <span className="text-sm tabular-nums">{row.original.rating}</span>
                </div>
            )
        },
        {
            accessorKey:"comment",
            header:"Комментарий",
            cell:({row})=>(
                <ReviewCommentPreview comment={row.original.comment}/>
            ),
        },
        {
            accessorKey:"createdAt",
            header:"Дата",
            cell:({row})=>{
                const raw = row.original.createdAt;
                const d = raw ? new Date(raw) : null;
                const label =
                    d && !Number.isNaN(d.getTime())
                        ? d.toLocaleDateString("ru-RU")
                        : "—";
                return (
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {label}
                    </span>
                );
            },
        },
        {
            id:"actions",
            header:"Действия",
            cell:({row})=>{
                const review = row.original;
                return (
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" aria-label="Редактировать отзыв" onClick={()=>onEdit(review)}>
                            <Pencil className="h-3.5 w-3.5"/>
                        </Button>
                        <Button variant="outline" size="icon-sm" className="text-destructive hover:text-destructive" aria-label="Удалить отзыв" onClick={()=>onDelete(review)}>
                            <Trash2 className="h-3.5 w-3.5"/>
                        </Button>
                    </div>
                )
            },
            enableSorting:false,
        }
    ]
}