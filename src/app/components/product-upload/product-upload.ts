// src/app/components/product-upload/product-upload.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { FormsModule } from '@angular/forms'; // Necesario para formularios
import { AuthService } from '../../services/auth'; // Asegúrate de la ruta correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-upload',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa CommonModule y FormsModule
  templateUrl: './product-upload.html',
  styleUrls: ['./product-upload.css']
})
export class ProductUploadComponent {
  // Archivo Excel seleccionado por el usuario
  selectedExcelFile: File | null = null;
  // Archivos de imagen seleccionados por el usuario (puede ser más de uno)
  selectedImageFiles: File[] = [];
  // Mensaje de éxito para mostrar al usuario
  uploadMessage: string | null = null;
  // Mensaje de error para mostrar al usuario
  errorMessage: string | null = null;
  // Indicador de carga para la UI
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Maneja el evento cuando se selecciona un archivo Excel.
   * @param event El evento de cambio del input de tipo 'file'.
   */
  onExcelFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedExcelFile = input.files[0];
      this.uploadMessage = null; // Limpiar mensajes anteriores
      this.errorMessage = null;
      console.log('Archivo Excel seleccionado:', this.selectedExcelFile.name);
    } else {
      this.selectedExcelFile = null;
    }
  }

  /**
   * Maneja el evento cuando se seleccionan archivos de imagen.
   * @param event El evento de cambio del input de tipo 'file'.
   */
  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImageFiles = Array.from(input.files); // Convierte FileList a Array
      this.uploadMessage = null; // Limpiar mensajes anteriores
      this.errorMessage = null;
      console.log('Archivos de imagen seleccionados:', this.selectedImageFiles.map(f => f.name));
    } else {
      this.selectedImageFiles = [];
    }
  }

  /**
   * Envía el archivo Excel y las imágenes al backend.
   */
  onUpload(): void {
    // Resetear mensajes antes de un nuevo intento de subida
    this.uploadMessage = null;
    this.errorMessage = null;

    // Validar que se haya seleccionado un archivo Excel
    if (!this.selectedExcelFile) {
      this.errorMessage = 'Por favor, selecciona un archivo Excel para subir.';
      return;
    }

    this.isLoading = true; // Activar el indicador de carga

    // Crear un objeto FormData para enviar los archivos
    const formData = new FormData();
    formData.append('excel_file', this.selectedExcelFile, this.selectedExcelFile.name);

    // Añadir cada archivo de imagen al FormData
    this.selectedImageFiles.forEach(file => {
      formData.append('images', file, file.name);
    });

    // Llamar al servicio de autenticación para subir los archivos
    this.authService.uploadExcelAndImages(formData).subscribe({
      next: (response) => {
        this.uploadMessage = response.message || 'Archivos subidos con éxito.';
        console.log('Subida exitosa:', response);
        this.isLoading = false; // Desactivar el indicador de carga
        // Opcional: Limpiar los archivos seleccionados después de una subida exitosa
        this.selectedExcelFile = null;
        this.selectedImageFiles = [];
        // Resetear los inputs de archivo para permitir nuevas selecciones
        const excelInput = document.getElementById('excelFile') as HTMLInputElement;
        if (excelInput) excelInput.value = '';
        const imageInput = document.getElementById('imageFiles') as HTMLInputElement;
        if (imageInput) imageInput.value = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al subir los archivos. Inténtalo de nuevo.';
        console.error('Error durante la subida:', err);
        this.isLoading = false; // Desactivar el indicador de carga
      }
    });
  }
}
