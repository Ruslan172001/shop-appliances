"use client";

import {useCallback,useEffect,useState} from "react"
import { DataTable } from "@/styles/components/features/admin/shared/data-table";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { getReviewColumns, type AdminReview } from "@/styles/components/features/admin/reviews/reviews-table";
import { ReviewFilters } from "@/styles/components/features/admin/reviews/review-filters";
import { ReviewEditDialog,ReviewDeleteDialog } from "@/styles/components/features/admin/reviews/review-actions-dialog";

export default function AdminReviewsPage(){
    const [reviews,setReviews] = useState<AdminReview[]>([])
    const [loading,setLoading]=useState(true);
    const [search,setSearch]=useState("")
    const [selectedRating, setSelectedRating]=useState("all");
    const [pagination,setPagination]=useState<PaginationState>({
        pageIndex:0,
        pageSize:10,
    })
    const [total,setTotal]=useState(0)
    const [pageCount,setPageCount] = useState(-1);
    const [editReview,setEditReview]=useState<AdminReview|null>(null);
    const[editOpen,setEditOpen]=useState(false);
    const [deleteReview,setDeleteReview]=useState<AdminReview|null>(null);
    const [deleteOpen,setDeleteOpen]=useState(false);

    const fetchReviews = useCallback(async ()=>{
        setLoading(true);

        try{
            const params = new URLSearchParams({
                page:String(pagination.pageIndex+1),
                pageSize:String(pagination.pageSize),
            })
            if(search.trim()) params.set("search",search.trim());
            if(selectedRating!=="all") params.set("rating",selectedRating);

            const response = await fetch(`/api/admin/reviews?${params}`);

            if (!response.ok) {
                toast.error("Ошибка при загрузке отзывов");
                return;
            }
            const data = await response.json();
            setReviews(data.reviews??[]);
            setTotal(data.total ?? 0);
            setPageCount(data.pageCount ?? -1);

        } catch {
            toast.error("Ошибка при загрузке отзывов");
        }finally{
            setLoading(false);
        }
    },[pagination,search,selectedRating]);

    useEffect(()=>{
        void fetchReviews()
    },[fetchReviews]);

    const columns = getReviewColumns(
        (review)=>{
            setEditReview(review);
            setEditOpen(true);
        },
        (review)=>{
            setDeleteReview(review);
            setDeleteOpen(true);
        }
    )

    return (
        <div className="space-y-6">
            <AdminBreadcrumb/>
            <div>
                <h2 className="text-2xl font-bold">Отзывы</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Всего:{total.toLocaleString("ru-RU")}
                </p>
            </div>
            <DataTable
            columns={columns}
            data={reviews}
            isLoading={loading}
            searchPlaceholder="Товар, пользователь, email, текст..."
            searchValue={search}
            onSearchChange={setSearch}
            rowCount={total}
            pageCount={pageCount}
            externalPagination={pagination}
            onPaginationChange={setPagination}
            filters={
                <ReviewFilters
                selectedRating={selectedRating}
                onRatingChange={(rating)=>{
                    setSelectedRating(rating);
                    setPagination((prev)=>({...prev,pageIndex:0}));
                }}
                />
            }
            />
            <ReviewEditDialog
            review={editReview}
            open={editOpen}
            onOpenChange={(open)=>{
                setEditOpen(open);
                if(!open) setEditReview(null)
            }}
        onSaved={()=>void fetchReviews()}
            />
            <ReviewDeleteDialog
            review={deleteReview}
            open={deleteOpen}
            onOpenChange={(open)=>{
                setDeleteOpen(open);
                if(!open) setDeleteReview(null)
            }}
        onDeleted={()=>void fetchReviews()}
            />
        </div>
    )
}