import { Component } from '@angular/core';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { Result } from 'src/app/shared/interfaces/peliculas';
import { Usuario } from '../../../shared/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-peliculas-list',
  templateUrl: './peliculas-list.component.html',
  styleUrls: ['./peliculas-list.component.css']
})
export class PeliculasListComponent {
//Para guardar la lista de peliculas
  peliculas: Result[] = [];
  isLoading = true;
  paginaActual: number = 1;
  totalPages: number = 1;  // Total de páginas
  usuarios: Usuario | null = null;
  userToken: string | null = localStorage.getItem('authToken');

  constructor(
    private favoritoService: FavoritosService,
    private peliculasService: PeliculasService,
    private usuarioService: UsuarioService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.obtenerPeliculas();
    this.obtenerUsuarios();
  }

  // Función para obtener las películas
  private obtenerPeliculas(): void {
    this.peliculasService.buscarPeliculasPopulares(this.paginaActual);
    this.peliculasService.listadoPeliculas$.subscribe({
      next: (data) => {
        this.peliculas = data;
        this.isLoading = false; // Cambia el estado cuando se obtienen las películas
      },
      error: (error) => {
        console.error('Error al obtener las películas:', error);

      },
    });
  }

  // Función para obtener los usuarios (si es necesario en el caso de la lista de usuarios)
  private obtenerUsuarios(): void {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
        console.log("Usuarios obtenidos:", response.data);
        this.usuarios = response.data[0]; // Asume que solo hay un usuario por defecto
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);

      },
    });
  }

  // Función para manejar la paginación
  cargarPagina(pagina: number): void {
    this.paginaActual = pagina;
    this.obtenerPeliculas(); // Recarga las películas con la nueva página
  }

  // Función para generar la URL de la imagen
  public getPosterUrl(posterPath: string | null): string {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'assets/no-image.png';
  }

  // Función para añadir una película a favoritos
  addToFavorites(pelicula: Result): void {
    if (this.checkToken()) {
      const id_pelicula = pelicula.id;
      this.favoritoService.agregarFavorito(id_pelicula).subscribe({
        next: (response) => {
          this.commonService.showSuccess(response.message || 'Película agregada a favoritos');
        },
        error: (error) => {
          console.error('Error al agregar película a favoritos:', error);

        },
      });
    }
  }

  // Función para eliminar una película de favoritos
  removeFromFavorites(pelicula: Result): void {
    if (this.checkToken()) {
      const id_pelicula = pelicula.id;
      this.favoritoService.eliminarFavorito( id_pelicula).subscribe({
        next: (response) => {
          this.commonService.showSuccess(response.message || 'Película eliminada de favoritos');
        },
        error: (error) => {
          console.error('Error al eliminar película de favoritos:', error);
        },
      });
    }
  }

  // Verifica si el token está disponible y muestra un error si no lo está
  private checkToken(): boolean {
    if (!this.userToken) {
      this.commonService.showError('❌ Usuario no autenticado.');
      return false;
    }
    return true;
  }
}
