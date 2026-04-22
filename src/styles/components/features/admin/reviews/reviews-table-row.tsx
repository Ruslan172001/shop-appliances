"use client";

interface ReviewCommentPreviewProps{
    comment:string|null;
}

export function ReviewCommentPreview({comment}:ReviewCommentPreviewProps){
    if(!comment?.trim()){
        return (
            <span className="text-muted-foreground text-sm italic">Нет комментариев</span>
        )
    }
    return(
        <p className="text-sm line-clamp-2 max-w-xs" title={comment}>
            {comment}
        </p>
    )
}