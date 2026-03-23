export enum PromoType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
}

export interface IPromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
}

export interface IApplyPromoResult {
  success: boolean;
  error?: string;
  discount?: number;
  finalAmount?: number;
}
