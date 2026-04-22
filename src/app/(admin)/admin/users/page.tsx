"use client"

import { useCallback,useEffect,useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { AdminBreadcrumb } from "@/styles/components/features/admin/shared/admin-breadcrumb";
import { DataTable } from "@/styles/components/features/admin/shared/data-table";
import { AdminUser,getUserColumns } from "@/styles/components/features/admin/users/users-table";


export default function AdminUsersPage() {
  const [users,setUsers]=useState<AdminUser[]>([])
  const [loading,setLoading]=useState(true)
  const [search,setSearch] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex:0,
    pageSize:10,
  })
  const [total,setTotal]=useState(0);
  const [pageCount,setPageCount]=useState(-1);
  const [currentUserId,setCurrentUserId]=useState<string|undefined>()

  const fetchUsers= useCallback(async()=>{
    setLoading(true);
    try{
      const params = new URLSearchParams({
        page:String(pagination.pageIndex+1),
        pageSize:String(pagination.pageSize),
      })
      if(search.trim()){
        params.set("search",search.trim())
      }

      const response = await fetch(`/api/admin/users?${params}`);
      if(!response.ok) throw new Error("Failed to fetch users");

      const data =  await response.json();
      setUsers(data.users ??[]);
      setTotal(data.total ?? 0);
      setPageCount(data.pageCount ?? -1);
      setCurrentUserId(data.currentUserId);
    }catch{
      toast.error("Не удалось загрузить пользователей")
    } finally{
      setLoading(false)
    }
  },[pagination,search])

  useEffect(()=>{
    fetchUsers();
  },[fetchUsers])

  const handleRoleChange = async (id:string, role:"USER"|"ADMIN")=>{
    try{
      const response = await fetch(`/api/admin/users/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({role}),
      });
      if(!response.ok){
        const error = await response.text();
        throw new Error(error || "Ошибка изменения роли");
      }
      toast.success("Роль обновлена");
      fetchUsers();
    }catch(error){
      const message = error instanceof Error ? error.message:"Ошибка изменения роли";
      toast.error(message)
    }
  }
  const columns = getUserColumns(handleRoleChange,currentUserId);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb/>

      <div>
        <h2 className="text-2xl font-bold"> Пользователи</h2>
        <p className="text-sm text-muted-foreground">
          Всего:{total.toLocaleString("ru-RU")}
        </p>
      </div>
      <DataTable
      columns={columns}
      data={users}
      isLoading={loading}
      searchPlaceholder="Поиск по имени или email..."
      searchValue={search}
      onSearchChange={(value)=>{setSearch(value); setPagination((prev)=>({...prev,pageIndex:0}))}}
      rowCount={total}
      pageCount={pageCount}
      externalPagination={pagination}
      onPaginationChange={setPagination}
      />
    </div>
  )
}
