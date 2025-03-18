import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './shared/interceptor.service';
import { AuthGuardPublic } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { MaterialModule } from './material/material.module'; // Import MaterialModule here

import { PeliculasModule } from './peliculas/peliculas.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule, // Use the MaterialModule here
    SharedModule,
    PeliculasModule, // Import PeliculasModule
  ],
  providers: [
    CookieService, AuthGuardPublic, AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
