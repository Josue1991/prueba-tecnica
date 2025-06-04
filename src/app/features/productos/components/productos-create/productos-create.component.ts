import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto-service.service';

@Component({
  selector: 'app-productos-create',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './productos-create.component.html',
  styleUrl: './productos-create.component.scss'
})
export class ProductosCreateComponent {
  @Output() productoGuardado = new EventEmitter<void>();
  
  productoForm: ReturnType<FormBuilder['group']>;

  constructor(private readonly fb: FormBuilder, private readonly productService: ProductoService) {
    this.productoForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]+$/)]],
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.productoForm.valid) {
      const formValue = this.productoForm.getRawValue();
      const dateRelease = formValue.date_release ? new Date(formValue.date_release) : null;
      const dateRevision = formValue.date_revision ? new Date(formValue.date_revision) : null;
      const formateado = {
        ...formValue,
        date_release: (dateRelease && !isNaN(dateRelease.getTime())) ? dateRelease.toISOString() : null,
        date_revision: (dateRevision && !isNaN(dateRevision.getTime())) ? dateRevision.toISOString() : null
      };
      this.productService.crearProducto(formateado).subscribe(res => {
        console.log("Resp:", res);
        if (res.message == "Product added successfully"){
          this.productoGuardado.emit();
        }
        alert(res.message);
      });
    } else {
      this.productoForm.markAllAsTouched();
      alert("Por favor llene los campos requeridos!");
    }
  }


  onReset() {
    this.productoForm.reset();
  }
}
