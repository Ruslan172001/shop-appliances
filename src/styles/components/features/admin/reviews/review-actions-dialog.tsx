"use client";

import { useEffect,useState } from "react";
import { Dialog,DialogContent,DialogFooter,DialogHeader,DialogTitle } from "@/styles/components/ui/dialog";
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle } from "@/styles/components/ui/alert-dialog";
import { Button } from "@/styles/components/ui/button";
import { Label } from "@/styles/components/ui/label";
import { Textarea } from "@/styles/components/ui/textarea";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/styles/components/ui/select";
import { ReviewModerationCard } from "./review-moderation-card";
import { AdminReview } from "./reviews-table";
import { toast } from "sonner";


interface ReviewEditDialogProps{
    review:AdminReview|null;
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    onSaved:()=>void;
}

export function ReviewEditDialog({
    review,
    open,
    onOpenChange,
    onSaved
}:ReviewEditDialogProps){
    const [rating,setRating]=useState(5);
    const [comment,setComment]=useState("")
    const [saving,setSaving]=useState(false);

    useEffect(()=>{
        if(review && open){
            setRating(review.rating);
            setComment(review.comment ??"")
        }
    },[review,open])

    const handleSave = async()=>{
        if(!review) return
        setSaving(true)
        try{
            const response = await fetch("/api/admin/reviews",{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    id:review.id,
                    rating,
                    comment
                })
            })
            if(response.ok){
                toast.success("Отзыв обновлен");
                onOpenChange(false);
                onSaved();
            }else{
                toast.error("Не удалось сохранить отзыв");
            }
        }catch{
            toast.error("Не удалось сохранить отзыв");

        }finally{
            setSaving(false)
        }
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Редактировать отзыв</DialogTitle>
                </DialogHeader>
                {review && (
                   <div className="space-y-4">
                    <ReviewModerationCard review={review}/>
                    <div className="space-y-2">
                        <Label htmlFor="review-rating">Оценка</Label>
                        <Select value={String(rating)} onValueChange={(value)=>setRating(Number(value))}>
                            <SelectTrigger id="review-rating" className="w-full">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {[1,2,3,4,5].map((n)=>(
                                    <SelectItem key={n} value={String(n)}>
                                        {n} из 5
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="review-comment">Комментарий</Label>
                        <Textarea id="review-comment"
                        rows={4}
                        value={comment}
                        onChange={(event)=>setComment(event.target.value)}
                        placeholder="Текст отзыва..."/>
                    
                    </div>
                   </div>
                )}
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={()=>onOpenChange(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleSave} disabled={saving||!review}>
                        Сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface ReviewDeleteDialogProps{
    review:AdminReview|null;
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    onDeleted:()=>void
}

export function ReviewDeleteDialog({
    review,
    open,
    onOpenChange,
    onDeleted
}:ReviewDeleteDialogProps){
    const [deleting,setDeleting]=useState(false);

    const handleDelete= async()=>{
        if(!review) return
        setDeleting(true)
        try{
            const response = await fetch("/api/admin/reviews",{
                method:"DELETE",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({id:review.id}),
            })
            if(response.ok){
                toast.success("Отзыв удален")
                onOpenChange(false)
                onDeleted()
            }else{
                toast.error("Не удалось удалить отзыв")
            }
        }catch{
            toast.error("Не удалось удалить отзыв")
        }finally{
            setDeleting(false)
        }
    }
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                         Удалить отзыв?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {review ? (
                            <>
                            Отзыв на "{review.product.name}" будет удален безвозвратно. 
                            Средний рейтинг товара будет пересчитан.
                            </>
                        ):(
                            ""
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>Отмена</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={(event)=>{event.preventDefault(); void handleDelete()}} disabled={deleting||!review}>
                    Удалить
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}