import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from './services/login.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [LoginService],
})
export class AppComponent {
  title = 'Front';
}
