import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PurchaseHistory } from '../interfaces/purchase-history';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  backendUrl: string = 'http://localhost:8000/api/';

  constructor(public http: HttpClient) {}

  getProductsFromShoppingCart(userId: number): Observable<PurchaseHistory[]> {
    return this.http.get<PurchaseHistory[]>(
      `http://localhost:8000/api/purchases/user/${userId}`
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(this.backendUrl + 'products/' + id);
  }

  buyProduct(purchaseHistory: PurchaseHistory):Observable<PurchaseHistory> {
    return this.http.post<PurchaseHistory>(this.backendUrl + 'products/buy', purchaseHistory);
  }

  addToShoppingCart(purchaseHistory: any): Observable<PurchaseHistory>{
    return this.http.post<PurchaseHistory>(this.backendUrl+"purchase_history/add", purchaseHistory)
  }
}
