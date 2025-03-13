import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404-page',
  templateUrl: './error404-page.component.html',
  styleUrls: ['./error404-page.component.css']
})
export class Error404PageComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate([this.router.url]); // Te llevará de vuelta a la página anterior
  }
}
