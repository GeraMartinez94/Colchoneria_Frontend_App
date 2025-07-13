// src/app/models/product.model.ts (or wherever you define your Product interface)
export interface Product {
  id: number;
  sku: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen_url?: string; // <-- Ensure this exists and is optional
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}