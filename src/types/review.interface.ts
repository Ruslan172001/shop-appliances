export interface IReview {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  userName?: string;
  userImage?: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewWithProduct extends IReview {
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ICreateReviewInput {
  productId: string;
  rating: number;
  comment?: string;
}

export interface IReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
