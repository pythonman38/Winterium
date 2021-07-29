import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IShoppingCart, ShoppingCartItem } from '../shared/models/shoppingCart';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  shoppingCart$: Observable<IShoppingCart>;

  constructor(private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.shoppingCart$ = this.shoppingCartService.shoppingCart$;
  }

  removeShoppingCartItem(item: ShoppingCartItem) {
    this.shoppingCartService.removeItemFromShoppingCart(item);
  }

  incrementItemQuantity(item: ShoppingCartItem) {
    this.shoppingCartService.incrementItemQuantity(item);
  }
  
  decrementItemQuantity(item: ShoppingCartItem) {
    this.shoppingCartService.decrementItemQuantity(item);
  }

}
