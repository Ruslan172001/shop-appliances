import { NextRequest,NextResponse } from "next/server";
import {auth} from "@/lib/auth"
import prisma from "@/lib/prisma";

async function ensureAdmin(){
  const session = await auth();
  if(!session || session.user?.role !=='ADMIN'){
    return null
  }
  return session
}

async function recalculateProductStats(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });

  const reviewCount = reviews.length;
  const rating =
    reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

  await prisma.product.update({
    where: { id: productId },
    data: { reviewCount, rating },
  });
}

export async function GET(request:NextRequest){
  try{
    const session = await ensureAdmin();
    if(!session){
      return new NextResponse("Unauthorized",{status:401})
    }

    const {searchParams} = new URL(request.url);
    const page = Number(searchParams.get("page"))||1;
    const pageSize = Number(searchParams.get("pageSize"))||10;
    const search = (searchParams.get("search")||"").trim();
    const rating = Number(searchParams.get("rating"))||0;

    const where:Record<string,unknown> = {};

    if(search){
      where.OR=[
        {product:{name:{contains:search,mode:"insensitive"}}},
        {user:{name:{contains:search,mode:"insensitive"}}},
        {user:{email:{contains:search,mode:"insensitive"}}},
        {comment:{contains:search,mode:"insensitive"}}
      ]
    }
    if(rating>=1 && rating<=5){
      where.rating = rating
    }

    const [reviews,total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip:(page-1)*pageSize,
        take:pageSize,
        orderBy:{createdAt:"desc"},
        include:{
          user:{select:{id:true,name:true,email:true}},
        product:{select:{id:true,name:true,slug:true}}
      }
      }),
      prisma.review.count({where})
    ])

    return NextResponse.json({
      reviews:reviews.map((review)=>({
        id:review.id,
        rating:review.rating,
        comment:review.comment,
        createdAt:review.createdAt,
        user:review.user,
        product:review.product,
      })),
      total,
      pageCount:Math.ceil(total/pageSize)
    })
  }catch(error){
    console.error("[ADMIN_REVIEWS_GET]",error)
    return new NextResponse("Internal Server Error",{status:500});
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await ensureAdmin();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { id, rating, comment } = await request.json();

    if (!id || typeof rating !== "number" || rating < 1 || rating > 5) {
      return new NextResponse("Bad request", { status: 400 });
    }

    const existingReview = await prisma.review.findUnique({
      where:{id},
      select:{productId:true},
    })

    if(!existingReview){
      return new NextResponse("Review not found",{status:404});
    }

    const updated = await prisma.review.update({
      where:{id},
      data:{
        rating,
        comment:typeof comment ==="string" ? comment.trim() || null : null,
      },
      include:{
        user:{select:{id:true,name:true,email:true}},
        product:{select:{id:true,name:true,slug:true}}
      }
    })
    await recalculateProductStats(existingReview.productId)

    return NextResponse.json({
      id:updated.id,
      rating:updated.rating,
      comment:updated.comment,
      createdAt:updated.createdAt,
      user:updated.user,
      product:updated.product,
    })
  } catch (error) {
    console.error("[ADMIN_REVIEWS_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const session = await ensureAdmin();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { id } = await request.json();
    if (!id) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    const review = await prisma.review.findUnique({
      where: { id },
      select: { productId: true },
    });
    if (!review) {
      return new NextResponse("Review not found", { status: 404 });
    }
    await prisma.review.delete({ where: { id } });
    await recalculateProductStats(review.productId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_REVIEWS_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
