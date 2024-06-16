import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../interfaces/product';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { PurchaseHistory } from '../../interfaces/purchase-history';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent implements OnInit {
  shoppingCartProducts: Product[] = [];
  boughtProducts: Product[] = [];
  user: User | undefined | null;
  purchaseHistory: PurchaseHistory[] = [];
  @ViewChild('star1') star1: ElementRef;
  @ViewChild('star2') star2: ElementRef;
  @ViewChild('star3') star3: ElementRef;
  @ViewChild('star4') star4: ElementRef;
  @ViewChild('star5') star5: ElementRef;
  comment = 'Круто!';
  commentLeft: boolean = true;
  constructor(
    public router: Router,
    private userService: UserService,
    private productService: ProductService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.updateShoppingCart();
  }

  updateShoppingCart() {
    this.shoppingCartProducts = [];
    this.boughtProducts = [];
    const id = this.cookie.get('user');
    this.userService.getCurrentUser(Number(id)).subscribe((res) => {
      this.user = res;
      if (this.user) {
        this.productService
          .getProductsFromShoppingCart(this.user.id)
          .subscribe((purchaseHistory: PurchaseHistory[]) => {
            this.purchaseHistory = purchaseHistory;
            for (let history of purchaseHistory) {
              this.productService
                .getProductById(history.product)
                .subscribe((prod: Product) => {
                  if (!history.paid) {
                    this.shoppingCartProducts.push(prod);
                  } else {
                    this.boughtProducts.push(prod);
                  }
                });
            }
          });
      }
    });
  }

  buy(product: Product) {
    const purchaseHistory: PurchaseHistory = this.purchaseHistory.filter(
      (history) => history.product === product.id
    )[0];
    this.productService
      .buyProduct(purchaseHistory)
      .subscribe((result) => this.updateShoppingCart());
  }

  rate(product: Product, rating: number) {
    product.rating = rating;
  }

  leaveComment(product: Product) {
    if (product.commentContext) {
      alert('Спасибо за ваш отзыв!');
      product.commentLeft = true;
    } else {
      alert("Напишите комментарий");
    }
  }
}
