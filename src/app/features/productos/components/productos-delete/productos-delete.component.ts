import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';
import { DeleteProductoUseCase } from '../../../../core/application/use-cases/delete-producto.use-case';

/**
 * Componente de eliminación de productos
 * Refactorizado siguiendo Clean Architecture y SOLID
 * - Usa casos de uso en lugar de servicios directos (Dependency Inversion)
 */
@Component({
  selector: 'app-productos-delete',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './productos-delete.component.html',
  styleUrl: './productos-delete.component.scss'
})
export class ProductosDeleteComponent {
  @Input() productoAEliminar!: ProductoFinanciero;
  @Output() productoEliminado = new EventEmitter<void>();

  constructor(
    private readonly deleteProductoUseCase: DeleteProductoUseCase
  ) { }

  onDelete(item: ProductoFinanciero): void {
    if (!item || !item.id) {
      alert('Error: Producto no válido');
      return;
    }

    this.deleteProductoUseCase.execute(item.id).subscribe({
      next: () => {
        alert('Producto eliminado exitosamente');
        this.productoEliminado.emit();
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    });
  }

  onCancel(): void {
    this.productoEliminado.emit();
  }
}
