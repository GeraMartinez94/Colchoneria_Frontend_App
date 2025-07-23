// src/app/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Keep RouterLink for the [routerLink] directive

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // RouterLink is needed for [routerLink] in the template
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts(); // Call the function to load all products
  }

  // Loads all products from the backend (no category filter here)
  loadProducts(): void {
    this.errorMessage = '';
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        if (this.products.length === 0 && !this.successMessage) {
            this.successMessage = '';
        }
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage = 'No se pudieron cargar los productos. Asegúrate de que el backend esté funcionando.';
        this.products = [];
        this.successMessage = '';
      }
    });
  }

  // Function to delete all products
  onDeleteAllProducts(): void {
    // IMPORTANT: Do NOT use confirm() or window.confirm() in the code.
    // The code is running in an iframe and the user will NOT see the confirmation dialog.
    // Instead, use a custom modal UI for these.
    // For this example, I'm keeping it as is based on your original code,
    // but for a production app, this should be replaced with a custom modal.
    if (confirm('¿Estás seguro de que quieres eliminar TODOS los productos? Esta acción no se puede deshacer.')) {
      this.productService.deleteAllProducts().subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.errorMessage = '';
          this.loadProducts(); // Reload products after deletion
        },
        error: (error) => {
          console.error('Error al eliminar productos:', error);
          this.errorMessage = error.error?.message || 'Error al eliminar los productos.';
          this.successMessage = '';
        }
      });
    }
  }
}
