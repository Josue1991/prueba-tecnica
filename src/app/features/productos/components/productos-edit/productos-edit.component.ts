import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';
import { UpdateProductoUseCase } from '../../../../core/application/use-cases/update-producto.use-case';

/**
 * Componente de edición de productos
 * Refactorizado siguiendo Clean Architecture y SOLID
 * - Usa casos de uso en lugar de servicios directos (Dependency Inversion)
 */
@Component({
  selector: 'app-productos-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productos-edit.component.html',
  styleUrl: './productos-edit.component.scss'
})
export class ProductosEditComponent implements OnInit {
  @Input() productoAEditar!: ProductoFinanciero;
  @Output() productoGuardado = new EventEmitter<void>();

  productoForm: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly updateProductoUseCase: UpdateProductoUseCase
  ) {
    this.productoForm = this.fb.group({
      id: [{ value: '', disabled: true }, [Validators.required]],
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.productoAEditar) {
      const formattedProducto = {
        id: this.productoAEditar.id,
        name: this.productoAEditar.name,
        description: this.productoAEditar.description,
        logo: this.productoAEditar.logo,
        date_release: this.formatDate(this.productoAEditar.dateRelease),
        date_revision: this.formatDate(this.productoAEditar.dateRevision)
      };

      this.productoForm.patchValue(formattedProducto);
    }
  }

  private formatDate(dateValue: Date): string {
    if (!dateValue) {
      return '';
    }
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toISOString().substring(0, 10); // 'YYYY-MM-DD'
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      try {
        const formValue = this.productoForm.getRawValue();
        
        // Crear la entidad del dominio
        const producto = new ProductoFinanciero(
          formValue.id,
          formValue.name,
          formValue.description,
          formValue.logo,
          new Date(formValue.date_release),
          new Date(formValue.date_revision)
        );

        // Ejecutar el caso de uso
        this.updateProductoUseCase.execute(producto).subscribe({
          next: () => {
            alert('Producto actualizado exitosamente');
            this.productoGuardado.emit();
          },
          error: (error) => {
            console.error('Error al actualizar producto:', error);
            alert(`Error al actualizar el producto: ${error.message}`);
          }
        });
      } catch (error: any) {
        alert(`Error de validación: ${error.message}`);
      }
    } else {
      this.productoForm.markAllAsTouched();
      alert('Por favor complete todos los campos');
    }
  }

  onReset(): void {
    if (this.productoAEditar) {
      this.ngOnInit();
    }
  }
}
