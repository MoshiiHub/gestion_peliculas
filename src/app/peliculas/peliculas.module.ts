import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { PeliculasListComponent } from './pages/peliculas-list/peliculas-list.component';
import { PeliculasRoutingModule } from './peliculas-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { SearchPeliculasComponent } from './pages/search-peliculas/search-peliculas.component';




@NgModule({
  declarations: [CardComponent, PeliculasListComponent,LayoutPageComponent, SearchPeliculasComponent],
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
        MatDividerModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        PeliculasRoutingModule,



  ],
  exports: [CardComponent, PeliculasListComponent,LayoutPageComponent, SearchPeliculasComponent],
})
export class PeliculasModule { }
