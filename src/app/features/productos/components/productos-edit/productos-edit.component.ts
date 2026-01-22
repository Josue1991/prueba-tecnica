import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';
import { UpdateProductoUseCase } from '../../../../core/application/use-cases/update-producto.use-case';

@Component({
  selector: 'app-productos-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productos-edit.component.html',
  styleUrl: './productos-edit.component.scss'
})
export class ProductosEditComponent {
  productoAEditar = input.required<ProductoFinanciero>();
  productoGuardado = output<void>();
  private readonly fb = inject(FormBuilder);
  private readonly updateProductoUseCase = inject(UpdateProductoUseCase);
  
  productoForm = this.fb.group({
    id: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]+$/)]],
    name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', Validators.required],
    date_release: ['', Validators.required],
    date_revision: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const producto = this.productoAEditar();
      if (producto) {
        const formattedProducto = {
          id: producto.id,
          name: producto.name,
          description: producto.description,
          logo: producto.logo,
          date_release: this.formatDate(producto.dateRelease),
          date_revision: this.formatDate(producto.dateRevision)
        };

        this.productoForm.patchValue(formattedProducto);
      }
    });
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
        const producto = new ProductoFinanciero(
          formValue.id!,
          formValue.name!,
          formValue.description!,
          formValue.logo!,
          new Date(formValue.date_release!),
          new Date(formValue.date_revision!)
        );

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
    const producto = this.productoAEditar();
    if (producto) {
      const formattedProducto = {
        id: producto.id,
        name: producto.name,
        description: producto.description,
        logo: producto.logo,
        date_release: this.formatDate(producto.dateRelease),
        date_revision: this.formatDate(producto.dateRevision)
      };

      this.productoForm.patchValue(formattedProducto);
    }
  }
}
