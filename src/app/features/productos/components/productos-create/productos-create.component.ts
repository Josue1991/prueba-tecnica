import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateProductoUseCase } from '../../../../core/application/use-cases/create-producto.use-case';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';

@Component({
  selector: 'app-productos-create',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './productos-create.component.html',
  styleUrl: './productos-create.component.scss'
})
export class ProductosCreateComponent {
  productoGuardado = output<void>();
  private readonly fb = inject(FormBuilder);
  private readonly createProductoUseCase = inject(CreateProductoUseCase);
  
  productoForm = this.fb.group({
    id: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]+$/)]],
    name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', Validators.required],
    date_release: ['', Validators.required],
    date_revision: ['', Validators.required]
  });

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

        this.createProductoUseCase.execute(producto).subscribe({
          next: () => {
            alert('Producto creado exitosamente');
            this.productoGuardado.emit();
            this.onReset();
          },
          error: (error) => {
            console.error('Error al crear producto:', error);
            alert(`Error al crear el producto: ${error.message}`);
          }
        });
      } catch (error: any) {
        alert(`Error de validación: ${error.message}`);
      }
    } else {
      this.productoForm.markAllAsTouched();
      alert('Por favor llene los campos requeridos');
    }
  }

  onReset(): void {
    this.productoForm.reset();
  }
}