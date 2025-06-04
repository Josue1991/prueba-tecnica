import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto-service.service';
import { ProductoFinanciero } from '../../models/producto-financiero';

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

  constructor(private readonly fb: FormBuilder, private readonly productoService: ProductoService) {
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
        ...this.productoAEditar,
        date_release: this.productoAEditar.date_release ? this.formatDate(this.productoAEditar.date_release) : "",
        date_revision: this.productoAEditar.date_revision ? this.formatDate(this.productoAEditar.date_revision) :""
      };

      this.productoForm.patchValue(formattedProducto);
    }
  }

  private formatDate(dateValue: string | Date | undefined): string {
    if (!dateValue) {
      return '';
    }
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toISOString().substring(0, 10); // 'YYYY-MM-DD'
  }

  onSubmit() {
    if (this.productoForm.valid) {
      const formValue = this.productoForm.getRawValue();
      const dateRelease = new Date(formValue.date_release);
      const dateRevision = new Date(formValue.date_revision);

      const actualizado = {
        ...formValue,
        date_release: dateRelease.toISOString(),
        date_revision: dateRevision.toISOString()
      };

      this.productoService.actualizarProducto(actualizado).subscribe(res => {
        alert(res.message);
        this.productoGuardado.emit();
      });
    } else {
      this.productoForm.markAllAsTouched();
      alert('Por favor complete todos los campos.');
    }
  }

  onReset() {
    this.productoForm.reset(this.productoAEditar);
  }
}
