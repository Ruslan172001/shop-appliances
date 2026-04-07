"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/styles/components/ui/tabs";
import { ProfileInfo } from "@/styles/components/features/profile/profile-info";
import { OrderList } from "@/styles/components/features/profile/order-list";
import ReviewList from "@/styles/components/features/profile/review-list";
import { Spinner } from "@/styles/components/ui/spinner";
import { Package, MessageSquare, User } from "lucide-react";

function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    () => searchParams.get("tab") || "info",
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/profile?tab=${value}`);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-8">Личный кабинет</h1>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Заказы</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Отзывы</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <ProfileInfo user={session.user} createdAt={session.user.createdAt} />
        </TabsContent>
        <TabsContent value="orders">
          <OrderList />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-100">
          <Spinner />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
