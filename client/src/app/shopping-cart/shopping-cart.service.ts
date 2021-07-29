import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../shared/models/product';
import { IShoppingCart, ShoppingCart, ShoppingCartItem, ShoppingCartTotals } from '../shared/models/shoppingCart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  baseUrl = environment.apiUrl;
  private shoppingCartSource = new BehaviorSubject<IShoppingCart>(null);
  private shoppingCartTotalSource = new BehaviorSubject<ShoppingCartTotals>(null);
  shoppingCart$ = this.shoppingCartSource.asObservable();
  shoppingCartTotal$ = this.shoppingCartTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  getShoppingCart(id: string) {
    return this.http.get(this.baseUrl + 'shoppingcart?id=' + id).pipe(
      map((shoppingCart: IShoppingCart) => {
        this.shoppingCartSource.next(shoppingCart);
        this.calculateTotals();
      })
    );
  }

  setShoppingCart(shoppingCart: IShoppingCart) {
    return this.http.post(this.baseUrl + 'shoppingcart', shoppingCart).subscribe((response: IShoppingCart) => {
      this.shoppingCartSource.next(response);
      this.calculateTotals();
    }, error => {
      console.log(error);
    });
  }

  getCurrentShoppingCartValue() {
    return this.shoppingCartSource.value;
  }

  addItemToShoppingCart(item: Product, quantity = 1) {
    const itemToAdd: ShoppingCartItem = this.mapProductItemToShoppingCartItem(item, quantity);
    const shoppingCart = this.getCurrentShoppingCartValue() ?? this.createShoppingCart();
    shoppingCart.items = this.addOrUpdateItem(shoppingCart.items, itemToAdd, quantity);
    this.setShoppingCart(shoppingCart);
  }

  incrementItemQuantity(item: ShoppingCartItem) {
    const shoppingCart = this.getCurrentShoppingCartValue();
    const foundItemIndex = shoppingCart.items.findIndex(x => x.id === item.id);
    shoppingCart.items[foundItemIndex].quantity++;
    this.setShoppingCart(shoppingCart);
  }

  decrementItemQuantity(item: ShoppingCartItem) {
    const shoppingCart = this.getCurrentShoppingCartValue();
    const foundItemIndex = shoppingCart.items.findIndex(x => x.id === item.id);
    if (shoppingCart.items[foundItemIndex].quantity > 1) {
      shoppingCart.items[foundItemIndex].quantity--;
      this.setShoppingCart(shoppingCart);
    } else {
      this.removeItemFromShoppingCart(item);
    }
  }

  removeItemFromShoppingCart(item: ShoppingCartItem) {
    const shoppingCart = this.getCurrentShoppingCartValue();
    if (shoppingCart.items.some(x => x.id === item.id)) {
      shoppingCart.items = shoppingCart.items.filter(i => i.id !== item.id);
      if (shoppingCart.items.length > 0) {
        this.setShoppingCart(shoppingCart);
      } else {
        this.deleteShoppingCart(shoppingCart);
      }
    }
  }

  deleteShoppingCart(shoppingCart: IShoppingCart) {
    return this.http.delete(this.baseUrl + 'shoppingcart?id=' + shoppingCart.id).subscribe(() => {
      this.shoppingCartSource.next(null);
      this.shoppingCartTotalSource.next(null);
      localStorage.removeItem('shoppingCart_id');
    }, error => {
      console.log(error);
    });
  }

  private calculateTotals() {
    const shoppingCart = this.getCurrentShoppingCartValue();
    const shipping = 0;
    const subtotal = shoppingCart.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.shoppingCartTotalSource.next({ shipping, total, subtotal });
  }

  private addOrUpdateItem(items: ShoppingCartItem[], itemToAdd: ShoppingCartItem, quantity: number): ShoppingCartItem[] {
    const index = items.findIndex((i => i.id === itemToAdd.id));
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private createShoppingCart(): IShoppingCart {
    const shoppingCart = new ShoppingCart();
    localStorage.setItem('shoppingCart_id', shoppingCart.id);
    return shoppingCart;
  }

  private mapProductItemToShoppingCartItem(item: Product, quantity: number): ShoppingCartItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }

}



