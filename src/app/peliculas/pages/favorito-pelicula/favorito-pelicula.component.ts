import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { CommonService } from 'src/app/shared/common.service';
import { Favoritos} from 'src/app/shared/interfaces/peliculas';


@Component({
  selector: 'app-favorito-pelicula',
  templateUrl: './favorito-pelicula.component.html',
  styleUrls: ['./favorito-pelicula.component.css']
})
export class FavoritoPeliculaComponent {
  favoritos: Favoritos[] = [];
  userToken: string | null = localStorage.getItem('authToken');
  favoritosId: number[] = [];
  constructor(
    private favoritosService: FavoritosService,
    private peliculasService: PeliculasService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    if (!this.userToken) {
        console.error('Error: No hay token de usuario');
        return;
    }
    this.obtenerFavoritos();
}

  // Verifica el token y obtiene los favoritos si es válido
  private checkTokenAndLoadFavorites(): void {
    if (!this.userToken) {
      console.error('Error: No hay token de usuario');

      return;
    }

    this.obtenerFavoritos();
  }

  obtenerIdsPeliculasFavoritas(): Promise<number[]> {
    const userToken = localStorage.getItem('authToken');

    if (!userToken) {
      console.error('No se encontró el token de autorización');
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
      'Accept': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.favoritosService.obtenerFavoritos().subscribe({
        next: (response) => {
          const favoritos: Favoritos[] = response.data; // Tipar response.data
          const favoritosId = favoritos.map((favorito: Favoritos) => favorito.id_pelicula); // Tipar favorito
          resolve(favoritosId);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  async obtenerDetallesPeliculasFavoritas(idsPeliculas: number[]): Promise<any[]> {
    const peliculasFavoritas = await Promise.all(idsPeliculas.map(async (id) => {
      const pelicula = await this.peliculasService.getMovieById(id).toPromise();
      return pelicula;
    }));

    return peliculasFavoritas;
  }


  public getPosterUrl(posterPath: string | null): string {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'assets/no-image.png';
  }

  // Agregar una película a favoritos funciona bien
  agregarFavorito(idPelicula: number): void {
    if (!this.userToken) {
      console.error('Error: No hay token de usuario');
      return;
    }

    this.favoritosService.agregarFavorito(idPelicula).subscribe({
      next: (response) => {
        if (response.status) {
          this.obtenerFavoritos();  // Recargar los favoritos después de agregar uno nuevo
          this.commonService.showSuccess(response.message); // Mostrar mensaje de éxito
        } else {
          this.commonService.showError(response.message); // Mostrar mensaje de error si no se pudo agregar
        }
      },
      error: (error) => {
        console.error('Error al agregar la película a favoritos:', error);

      },
    });
  }
  async obtenerFavoritos(): Promise<void> {
    try {
      const idsPeliculas = await this.obtenerIdsPeliculasFavoritas();
      this.favoritosId = idsPeliculas;
      console.log('Favoritos ID:', this.favoritosId);

      const peliculasFavoritas = await this.obtenerDetallesPeliculasFavoritas(idsPeliculas);
      this.favoritos = peliculasFavoritas;
      console.log('Peliculas favoritas:', this.favoritos);
    } catch (error) {
      console.error('Error al obtener películas favoritas:', error);
    }
  }

  // Eliminar una película de favoritos funciona bien
  eliminarFavorito(idPelicula: number): void {
    if (!this.userToken) {
      console.error('Error: No hay token de usuario');
      return;
    }
    if (confirm('¿Estás seguro de que deseas eliminar esta película de tus favoritos?')) {
      this.favoritosService.eliminarFavorito(idPelicula).subscribe({
        next: (response) => {
          if (response.status) {
            this.obtenerFavoritos();  // Recargar los favoritos después de eliminar uno
            this.commonService.showSuccess(response.message); // Mostrar mensaje de éxito
          } else {
            this.commonService.showError(response.message); // Mostrar mensaje de error
          }
        },
        error: (error) => {
          console.error('Error al eliminar la película de favoritos:', error);
        },
      });
    }
  }
}
