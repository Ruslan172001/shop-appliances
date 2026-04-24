"use client";

import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { Mail, Calendar } from "lucide-react";
import type { Session } from "next-auth";
import { getInitials, formatDate } from "@/lib/user-utils";
import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileInfoProps {
  user: Session["user"];
  createdAt?: string;
}

export function ProfileInfo({ user, createdAt }: ProfileInfoProps) {
  const initials = getInitials(user.name || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Личная информация
          <EditProfileDialog user={user} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="text-xl font-semibold">
            {user.name || "Пользователь"}
          </h3>
          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
            {user.role === "ADMIN" ? "Администратор" : "Пользователь"}
          </Badge>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Электронная почта</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Дата регистрации</p>
              <p className="font-medium">
                {createdAt ? formatDate(new Date(createdAt)) : "-"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
