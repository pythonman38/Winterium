import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/shared/models/order';
import { IShoppingCart } from 'src/app/shared/models/shoppingCart';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  constructor(private shoppingCartService: ShoppingCartService, private checkoutService: CheckoutService, private toastr: ToastrService,
      private router: Router) { }

  ngOnInit(): void {
  }

  submitOrder() {
    const shoppingCart = this.shoppingCartService.getCurrentShoppingCartValue();
    const orderToCreate = this.getOrderToCreate(shoppingCart);
    this.checkoutService.createOrder(orderToCreate).subscribe((order: Order) => {
      this.toastr.success('Order created successfully');
      this.shoppingCartService.deleteLocalShoppingCart(shoppingCart.id);
      const navigationExtras: NavigationExtras = { state: order };
      this.router.navigate(['checkout/success'], navigationExtras);
    }, error => {
      this.toastr.error(error.message);
      console.log(error);
    });
  }

  private getOrderToCreate(shoppingCart: IShoppingCart) {
    return {
      shoppingCartId: shoppingCart.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }

}
