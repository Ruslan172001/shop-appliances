import { NextRequest,NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try{
        const session = await auth();

        if(!session || session.user?.role !== "ADMIN"){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {searchParams} = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const search = (searchParams.get("search")||"").trim();

    const where : Record<string,unknown> = {};

    if(search){
        where.OR=[
            {name:{contains:search,mode:"insensitive"}},
            {email:{contains:search,mode:"insensitive"}}
        ];
    }

    const [users,total] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy:{createdAt:"desc"},
            skip:(page-1)*pageSize,
            select:{
                id:true,
                name:true,
                email:true,
                role:true,
                createdAt:true,
                updatedAt:true,
            }
        }),
        prisma.user.count({where}),
    ])

    return NextResponse.json({
        users,
        total,
        pageCount:Math.ceil(total/pageSize),
        currentUserId: session.user.id,
    })
}catch(error){
    console.error("[ADMIN_USERS_GET]",error);
    return new NextResponse("Internal Server Error",{status:500});
}
}