import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateProductoUseCase } from '../../../../core/application/use-cases/create-producto.use-case';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';

/**
 * Componente de creación de productos
 * Refactorizado siguiendo Clean Architecture y SOLID
 * - Usa casos de uso en lugar de servicios directos (Dependency Inversion)
 */
@Component({
  selector: 'app-productos-create',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './productos-create.component.html',
  styleUrl: './productos-create.component.scss'
})
export class ProductosCreateComponent {
  @Output() productoGuardado = new EventEmitter<void>();
  
  productoForm: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly createProductoUseCase: CreateProductoUseCase
  ) {
    this.productoForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]+$/)]],
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });
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