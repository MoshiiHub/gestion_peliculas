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

  constructor(
    private favoritosService: FavoritosService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  obtenerUsuario(): void {
    this.usuarioService.getAllUsuarios().subscribe(response => {
      this.idUsuario = response.data[0].id;
    })
  }

  obtenerFavoritos(): void {
    this.favoritosService.obtenerFavoritos(this.idUsuario).subscribe(response => {
      this.favoritos = response.data;
    });
  }

  agregarFavorito(idPelicula: number): void {
    this.favoritosService.agregarFavorito(this.idUsuario, idPelicula).subscribe(response => {
      if (response.status) {
        this.obtenerFavoritos();
      }
      alert(response.message);
    });
  }

  eliminarFavorito(idPelicula: number): void {
    this.favoritosService.eliminarFavorito(this.idUsuario, idPelicula).subscribe(response => {
      if (response.status) {
        this.obtenerFavoritos();
      }
      alert(response.message);
    });
  }
}
