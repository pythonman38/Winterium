import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  deliveryMethods: DeliveryMethod[];

  constructor(private checkoutService: CheckoutService, private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe((dm: DeliveryMethod[]) =>
    {
      this.deliveryMethods = dm;
    }, error => {
      console.log(error);
    })
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    this.shoppingCartService.setShippingPrice(deliveryMethod);
  }

}
