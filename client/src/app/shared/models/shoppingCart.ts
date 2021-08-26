import {v4 as uuidv4} from 'uuid';

export interface IShoppingCart {
    id: string;
    items: ShoppingCartItem[];
    clientSecret?: string;
    paymentIntentId?: string;
    deliveryMethodId?: number;
    shippingPrice?: number;
}

export interface ShoppingCartItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export class ShoppingCart implements IShoppingCart {
    id = uuidv4();
    items: ShoppingCartItem[] = [];
}

export interface ShoppingCartTotals {
    shipping: number;
    subtotal: number;
    total: number;
}