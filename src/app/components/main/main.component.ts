import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SetProduct } from '../../interfaces/set-product';
import { ProductService } from '../../services/product.service';
import { PurchaseHistory } from '../../interfaces/purchase-history';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  searchValue: string = '';
  users: User[] | undefined;
  products: Product[] | undefined;
  allProducts: Product[] | undefined;
  viewType = false;
  user: User | undefined;

  filtersForm = new FormGroup({
    itemName: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    property: new FormControl('', Validators.required),
    filterBy: new FormControl('', Validators.required),
  });

  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    specification: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    cost: new FormControl('', Validators.required),
  });

  addProductWindow: boolean = false;
  notification: string | undefined | null = 'Проверка';

  constructor(
    public router: Router,
    private http: HttpClient,
    private cookie: CookieService,
    public dialog: MatDialog,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.cookie.get('user');
    this.getUserById(Number(id)).subscribe(
      (result: User) => {
        this.user = result;
        console.log(result);
        if (this.user.role === 2) {
          this.viewType = true;
          this.updateProducts(this.user.id);
        } else {
          this.getProducts().subscribe((res: Product[]) => {
            this.products = res;
            this.allProducts = res;
          });
        }
      },
      (error) => {
        this.router.navigate(['login']);
      }
    );

    this.getUsers().subscribe((objs) => {
      this.users = objs;
      console.log(this.users);
    });
  }

  updateProducts(id: number) {
    this.getProductsByVendor(id).subscribe((res: Product[]) => {
      this.products = res;
    });
  }

  search() {
    console.log(this.searchValue);
  }

  applyFilters() {
    if (this.filtersForm.value.itemName !== '') {
      this.products = this.products.filter((product) =>
        product.product_name.includes(this.filtersForm.value.itemName)
      );
    }
    // console.log(this.filtersForm.value);
    if (this.filtersForm.value.property !== '') {
      this.products = this.products.filter((product) =>
        product.specification.includes(this.filtersForm.value.property)
      );
    }

    if (this.filtersForm.value.quantity !== '') {
      console.log(Number(this.filtersForm.value.quantity));
      console.log(this.products[0].quantity);
      this.products = this.products.filter((product) => {
        return product.quantity >= Number(this.filtersForm.value.quantity);
      });
    }

    if (
      this.filtersForm.value.itemName === '' &&
      this.filtersForm.value.quantity === '' &&
      this.filtersForm.value.property === ''
    ) {
      this.products = this.allProducts;
    }
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8000/api/users');
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:8000/api/products');
  }
  getProductsByVendor(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `http://localhost:8000/api/products/vendor/${id}`
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`http://localhost:8000/api/users/${id}`);
  }

  setProduct(product: SetProduct): Observable<Product> {
    return this.http.post<Product>(
      'http://localhost:8000/api/product/add',
      product
    );
  }

  changeTheme() {
    this.viewType = !this.viewType;
  }

  addProduct() {
    const product: SetProduct = {
      product_name: this.productForm.value?.name,
      specification: this.productForm.value?.specification,
      quantity: Number(this.productForm.value?.quantity),
      cost: Number(this.productForm.value?.cost),
      vendor: this.user?.id,
      average_rating: 0,
      number_of_ratings: 0,
    };
    this.setProduct(product).subscribe(
      (res: Product) => {
        if (this.user) {
          this.updateProducts(this.user.id);
        }
        alert(`Добавлен продукт ${res.product_name}`);
      },
      (error) => {
        alert(
          'Не удалось добавить товар, проверьте введенные данные или подключение к серверу'
        );
      }
    );
  }

  deleteProduct(product: Product) {
    this.removeProduct(product.id).subscribe(
      (res) => {
        if (this.user) {
          this.updateProducts(this.user.id);
        }
        alert(
          `Продукт ${product.product_name}, ${product.specification} успешно удален!`
        );
      },
      (error) => {
        alert(
          'Произошла ошибка! Невозможно выполнить действие, сервер не отвечает'
        );
      }
    );
  }

  removeProduct(id: number) {
    return this.http.delete(`http://localhost:8000/api/product/${id}/delete`);
  }

  addToShoppingCart(product: Product) {
    const purchaseHistory: any = {
      client: this.user.id,
      product: product.id,
      paid: false,
    };
    this.productService
      .addToShoppingCart(purchaseHistory)
      .subscribe((res: PurchaseHistory) => {
        console.log(res);
        alert('Товар ' + product.product_name + ' помещен в корзину!');
      });
  }
}
