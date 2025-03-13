import { Component, ElementRef, ViewChild } from '@angular/core';
import { PeliculasService } from 'src/app/services/peliculas.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent {

  @ViewChild('txtInputEtiqueta')
  public inputEtiqueta!: ElementRef<HTMLInputElement>;
 //Indicamos que siempre habra un valor con ! para evitar que marque error


 etiquetas: string[] = [];

 constructor(private peliculasService: PeliculasService) { }

   buscarEtiqueta() {
     const nuevaEtiqueta=this.inputEtiqueta.nativeElement.value.trim();
     if (!nuevaEtiqueta) return;
     this.peliculasService.buscarEtiqueta(nuevaEtiqueta);
     //limpiamos el input
     this.inputEtiqueta.nativeElement.value='';
     console.log(nuevaEtiqueta);
   }

}
