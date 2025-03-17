import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Result } from 'src/app/shared/interfaces/peliculas';

@Component({
  selector: 'app-favorito-pelicula',
  templateUrl: './favorito-pelicula.component.html',
  styleUrls: ['./favorito-pelicula.component.css']
})
export class FavoritoPeliculaComponent {
  favoritos: Result[] = [];
  idUsuario!: number;

  constructor(private favoritosService: FavoritosService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {

  }
}
