import { Component, Input, OnInit } from '@angular/core';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { Result } from 'src/app/shared/interfaces/peliculas';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  listadoPeliculas = [];
  etiquetaBusqueda: string = ''; // Para el filtro de etiquetas

  constructor(private peliculasService: PeliculasService) {}

  imageUrl(path: string): string {
    return this.peliculasService.getImageUrl(path);
  }

  @Input() public pelicula!: Result;

  ngOnInit(): void {
    if (!this.pelicula) {
      throw new Error('Pelicula property is required');
    }
  }

}
