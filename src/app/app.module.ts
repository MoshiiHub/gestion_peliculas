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
import { CookieService, CookieOptionsProvider, COOKIE_WRITER } from 'ngx-cookie';  // Asegúrate de importar correctamente
import { AuthInterceptor } from './shared/interceptor.service';
import { SharedModule } from './shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CardListComponent } from './peliculas/components/card-list/card-list.component';
import { SearchBoxComponent } from './peliculas/components/search-box/search-box.component';




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
    SharedModule
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: CookieOptionsProvider,
      useValue: {
        path: '/',
        expires: 7,
      }
    },
    {
      provide: COOKIE_WRITER,
      useValue: {} // Puedes definir una implementación personalizada si es necesario
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
