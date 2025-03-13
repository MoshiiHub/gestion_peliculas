import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { PaginaPrincipalComponent } from './pages/pagina-principal/pagina-principal.component';
import { PeliculasModule } from '../peliculas/peliculas.module';



@NgModule({
  declarations: [Error404PageComponent, PaginaPrincipalComponent],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    PeliculasModule
  ],
  exports: [Error404PageComponent]
})
export class SharedModule { }
