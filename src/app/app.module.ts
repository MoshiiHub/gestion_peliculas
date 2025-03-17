import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthInterceptor } from './shared/interceptor.service';
import { MatCardModule } from '@angular/material/card';
import { PeliculasModule } from './peliculas/peliculas.module';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from './shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { CookieService } from 'ngx-cookie-service';
import {AuthGuardPublic} from './guards/auth.guard';
import { AuthService } from './services/auth.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    SharedModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    PeliculasModule

  ],
  providers: [
    CookieService,AuthGuardPublic, AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
