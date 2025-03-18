import { Component } from '@angular/core';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { Result } from 'src/app/shared/interfaces/peliculas';
import { Usuario } from '../../../shared/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-peliculas-list',
  templateUrl: './peliculas-list.component.html',
  styleUrls: ['./peliculas-list.component.css']
})
export class PeliculasListComponent {

  peliculas: Result[] = [];
  isLoading = true;  // Estado de carga
  paginaActual: number = 1;
  totalPages: number = 1;  // Total de páginas
  usuarios: Usuario | null = null; // Variable para almacenar al usuario

  constructor(
    private favoritoService: FavoritosService,
    private peliculasService: PeliculasService,
    private usuarioService: UsuarioService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
     // Llamamos a la función para obtener las películas populares
     this.peliculasService.buscarPeliculasPopulares();

     // Obtener los usuarios
     this.usuarioService.getAllUsuarios().subscribe(response => {
       console.log("Usuarios obtenidos:", response.data);
       this.usuarios = response.data[0]; // Asume que solo hay un usuario por defecto
     });

     // Subscribimos al observable para obtener las películas
     this.peliculasService.listadoPeliculas$.subscribe((data) => {
       this.peliculas = data;
       this.isLoading = false; // Cambia el estado cuando se obtienen las películas
     });
   }


  // Función para manejar la paginación
  cargarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.peliculasService.buscarPeliculasPopulares(pagina);
  }

  // Función para generar la URL de la imagen
  imageUrl(posterPath: string): string {
    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    return posterPath ? `${baseUrl}${posterPath}` : 'path-to-default-image.jpg'; // Imagen por defecto si no existe el póster
  }

  // Función para añadir una película a favoritos
  addToFavorites(pelicula: Result) {
    if (this.usuarios && this.usuarios.id_usuario !== undefined && this.usuarios.id_usuario !== null) {
      const id_usuario = this.usuarios.id_usuario;
      const id_pelicula = pelicula.id;
      // Enviar la solicitud POST con los datos correctos
      this.favoritoService.agregarFavorito(id_usuario, id_pelicula).subscribe(
        response => {
          console.log('Película agregada a favoritos:', response);
        },
        error => {
          console.error('Error al agregar película a favoritos:', error);
        }
      );
    } else {
      console.error('No se pudo obtener el usuario o el id_usuario es undefined');
    }
  }
}
