import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { PersonalAccountComponent } from './components/personal-account/personal-account.component';

export const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", component: MainComponent},
  {path: "shopping_cart", component: ShoppingCartComponent},
  {path: "account", component: PersonalAccountComponent},
];
