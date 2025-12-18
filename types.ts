
export enum AppView {
  STORE = 'STORE',
  CART = 'CART',
  AI_ASSISTANT = 'AI_ASSISTANT',
  CATEGORIES = 'CATEGORIES',
  SUB_CATEGORY_LIST = 'SUB_CATEGORY_LIST',
  SUB_CATEGORY_DETAIL = 'SUB_CATEGORY_DETAIL',
  LOGIN = 'LOGIN',
  OTP_VERIFY = 'OTP_VERIFY',
  CHECKOUT = 'CHECKOUT',
  // Missing views required by Sidebar component
  DASHBOARD = 'DASHBOARD',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  VOICE = 'VOICE',
  SEARCH = 'SEARCH'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  category: string;
  subCategory?: string;
  image: string;
  rating?: number;
  ingredients?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
