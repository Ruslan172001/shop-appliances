"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/styles/components/ui/badge";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/styles/components/ui/select";

export interface AdminUser {
    id:string;
    name:string|null;
    email:string;
    role:"USER"|"ADMIN";
    createdAt:string;
}

export function getUserColumns(
    onRoleChange:(id:string,role:"USER" | "ADMIN")=>void,
    currentUserId?:string,
):ColumnDef<AdminUser>[]{
    return [
        {
            accessorKey:"name",
            header:"Пользователь",
            cell:({row})=>{
                const user = row.original;
                return(
                    <div className="min-w-[220px]">
                        <div className="font-medium">{user.name||"Без имени"}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                )
            }
        },
        {
            accessorKey:"role",
            header:"Роль",
            cell:({row})=>{
                const user = row.original;
                const isSelf = currentUserId === user.id;

                return(
                    <div className="flex items-center gap-2">
                        <Badge variant={user.role ==="ADMIN"?"default":"secondary"}>
                            {user.role}
                        </Badge>
                        <Select value={user.role}
                        onValueChange={(value)=>onRoleChange(user.id,value as "USER"|"ADMIN")} disabled={isSelf}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USER">USER</SelectItem>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )
            }
        },
        {
            accessorKey:"createdAt",
            header:"Дата регистрации",
            cell:({row})=>{
                const date = new Date(row.original.createdAt);
                return (
                    <span className="text-sm text-muted-foreground">
                        {date.toLocaleString("ru-RU")}
                    </span>
                )
            }
        }

    ]
}