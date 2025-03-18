import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [Error404PageComponent],
  imports: [
    CommonModule,
    MaterialModule, // Use MaterialModule here instead of importing individual Material Modules
    ReactiveFormsModule,
  ],
  exports: [Error404PageComponent]
})
export class SharedModule { }
