import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { IShoppingCart, ShoppingCartItem } from '../../models/shoppingCart';

@Component({
  selector: 'app-shopping-cart-summary',
  templateUrl: './shopping-cart-summary.component.html',
  styleUrls: ['./shopping-cart-summary.component.scss']
})
export class ShoppingCartSummaryComponent implements OnInit {
  shoppingCart$: Observable<IShoppingCart>;
  @Output() decrement: EventEmitter<ShoppingCartItem> = new EventEmitter<ShoppingCartItem>();
  @Output() increment: EventEmitter<ShoppingCartItem> = new EventEmitter<ShoppingCartItem>();
  @Output() remove: EventEmitter<ShoppingCartItem> = new EventEmitter<ShoppingCartItem>();
  @Input() isShoppingCart = true;

  constructor(private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.shoppingCart$ = this.shoppingCartService.shoppingCart$;
  }

  decrementItemQuantity(item: ShoppingCartItem) {
    this.decrement.emit(item);
  }

  incrementItemQuantity(item: ShoppingCartItem) {
    this.increment.emit(item);
  }

  removeShoppingCartItem(item: ShoppingCartItem) {
    this.remove.emit(item);
  }

}
