import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;

  constructor(private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
  }

  addItemToShoppingCart() {
    this.shoppingCartService.addItemToShoppingCart(this.product);
  }

}
