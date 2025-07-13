// src/app/components/product-upload/product-upload.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf, *ngFor
import { AuthService } from '../../services/auth'; // Ensure correct path to AuthService

@Component({
  selector: 'app-product-upload',
  standalone: true, // If it's a standalone component
  imports: [CommonModule],
  templateUrl: './product-upload.html',
  styleUrls: ['./product-upload.css']
})
export class ProductUploadComponent {
  selectedExcelFile: File | null = null;
  selectedImageFiles: File[] = []; // Array to store multiple image files
  uploadMessage: string | null = null;
  isSuccess: boolean = false;
  isLoading: boolean = false;
  uploadErrors: string[] = []; // To display specific backend errors

  constructor(private authService: AuthService) {}

  onExcelFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedExcelFile = input.files[0];
      this.uploadMessage = null; // Clear previous message
      this.uploadErrors = []; // Clear errors
    } else {
      this.selectedExcelFile = null;
    }
  }

  onImageFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedImageFiles = Array.from(input.files); // Convert FileList to Array
      this.uploadMessage = null; // Clear previous message
      this.uploadErrors = []; // Clear errors
    } else {
      this.selectedImageFiles = [];
    }
  }

  onUpload(): void {
    if (!this.selectedExcelFile) {
      this.uploadMessage = 'Por favor, selecciona un archivo Excel para subir.';
      this.isSuccess = false;
      this.uploadErrors = [];
      return;
    }

    this.isLoading = true; // Show loading indicator
    this.uploadMessage = null; // Clear previous message
    this.uploadErrors = []; // Clear errors

    const formData = new FormData();
    formData.append('excel_file', this.selectedExcelFile, this.selectedExcelFile.name); // Add Excel file

    // Add each selected image file
    this.selectedImageFiles.forEach((file) => {
      formData.append('images', file, file.name); // 'images' is the key expected by Flask
    });

    this.authService.uploadExcelAndImages(formData).subscribe({
      next: (response) => {
        this.uploadMessage = response.message || 'Datos y imágenes subidos con éxito.';
        this.isSuccess = true;
        this.isLoading = false;
        this.selectedExcelFile = null;
        this.selectedImageFiles = []; // Clear selected images
        this.uploadErrors = response.errors || []; // Display backend errors if any

        // Clear file inputs
        const excelFileInput = document.getElementById('excelFile') as HTMLInputElement;
        if (excelFileInput) excelFileInput.value = '';
        const imageFilesInput = document.getElementById('imageFiles') as HTMLInputElement;
        if (imageFilesInput) imageFilesInput.value = '';
      },
      error: (error) => {
        console.error('Error al subir el archivo y las imágenes:', error);
        this.uploadMessage = error.error?.message || 'Error al subir los datos y las imágenes. Inténtalo de nuevo.';
        this.isSuccess = false;
        this.isLoading = false;
        this.uploadErrors = error.error?.errors || []; // Capture detailed backend errors
      }
    });
  }
}
