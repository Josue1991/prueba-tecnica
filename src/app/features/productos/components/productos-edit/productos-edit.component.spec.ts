import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductosEditComponent } from './productos-edit.component';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../../../core/domain/injection-tokens';
import { IProductoFinancieroRepository } from '../../../../core/domain/repositories/producto-financiero.repository.interface';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';
import { UpdateProductoUseCase } from '../../../../core/application/use-cases/update-producto.use-case';

describe('ProductosEditComponent', () => {
  let component: ProductosEditComponent;
  let fixture: ComponentFixture<ProductosEditComponent>;
  let mockRepository: jasmine.SpyObj<IProductoFinancieroRepository>;
  let mockUpdateProductoUseCase: jasmine.SpyObj<UpdateProductoUseCase>;

  beforeEach(async () => {
    mockRepository = jasmine.createSpyObj('IProductoFinancieroRepository', [
      'getAll',
      'getById',
      'create',
      'update',
      'delete'
    ]);

    mockUpdateProductoUseCase = jasmine.createSpyObj('UpdateProductoUseCase', ['execute']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProductosEditComponent],
      providers: [
        { provide: PRODUCTO_FINANCIERO_REPOSITORY, useValue: mockRepository },
        { provide: UpdateProductoUseCase, useValue: mockUpdateProductoUseCase }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosEditComponent);
    component = fixture.componentInstance;
    
    // Configurar input signal
    const productoTest = new ProductoFinanciero(
      'test-id',
      'Test Product Name',
      'Test Description with enough length',
      'logo.png',
      new Date('2025-01-01'),
      new Date('2026-01-01')
    );
    fixture.componentRef.setInput('productoAEditar', productoTest);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with producto data via effect', () => {
    // El effect ya se ejecutó con detectChanges
    // Assert
    expect(component.productoForm.get('id')?.value).toBe('test-id');
    expect(component.productoForm.get('name')?.value).toBe('Test Product Name');
    expect(component.productoForm.get('description')?.value).toBe('Test Description with enough length');
    expect(component.productoForm.get('logo')?.value).toBe('logo.png');
  });

  describe('Form Validations', () => {
    it('should validate id pattern', () => {
      const idControl = component.productoForm.get('id');
      
      idControl?.setValue('invalid id');
      expect(idControl?.hasError('pattern')).toBeTrue();
      
      idControl?.setValue('valid-id-123');
      expect(idControl?.hasError('pattern')).toBeFalse();
    });

    it('should validate name minLength', () => {
      const nameControl = component.productoForm.get('name');
      
      nameControl?.setValue('Short');
      expect(nameControl?.hasError('minlength')).toBeTrue();
      
      nameControl?.setValue('Valid Product Name');
      expect(nameControl?.hasError('minlength')).toBeFalse();
    });

    it('should validate description minLength and maxLength', () => {
      const descControl = component.productoForm.get('description');
      
      descControl?.setValue('Short');
      expect(descControl?.hasError('minlength')).toBeTrue();
      
      descControl?.setValue('A'.repeat(201));
      expect(descControl?.hasError('maxlength')).toBeTrue();
      
      descControl?.setValue('Valid description with enough length');
      expect(descControl?.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.productoForm.patchValue({
        id: 'updated-id',
        name: 'Updated Product',
        description: 'Updated description with enough length',
        logo: 'updated-logo.png',
        date_release: '2025-02-01',
        date_revision: '2026-02-01'
      });
    });

    it('should call updateProductoUseCase when form is valid', () => {
      // Arrange
      mockUpdateProductoUseCase.execute.and.returnValue(of(undefined));
      spyOn(window, 'alert');
      spyOn(component.productoGuardado, 'emit');

      // Act
      component.onSubmit();

      // Assert
      expect(mockUpdateProductoUseCase.execute).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Producto actualizado exitosamente');
      expect(component.productoGuardado.emit).toHaveBeenCalled();
    });

    it('should emit productoGuardado event on successful update', () => {
      // Arrange
      mockUpdateProductoUseCase.execute.and.returnValue(of(undefined));
      spyOn(component.productoGuardado, 'emit');
      spyOn(window, 'alert');

      // Act
      component.onSubmit();

      // Assert
      expect(component.productoGuardado.emit).toHaveBeenCalled();
    });

    it('should show alert when form is invalid', () => {
      // Arrange
      component.productoForm.patchValue({ name: '' });
      spyOn(window, 'alert');

      // Act
      component.onSubmit();

      // Assert
      expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos');
      expect(mockUpdateProductoUseCase.execute).not.toHaveBeenCalled();
    });

    it('should handle update error', () => {
      // Arrange
      const error = new Error('Update failed');
      mockUpdateProductoUseCase.execute.and.returnValue(throwError(() => error));
      spyOn(window, 'alert');
      spyOn(console, 'error');

      // Act
      component.onSubmit();

      // Assert
      expect(console.error).toHaveBeenCalledWith('Error al actualizar producto:', error);
      expect(window.alert).toHaveBeenCalledWith('Error al actualizar el producto: Update failed');
    });

    it('should mark all fields as touched when form is invalid', () => {
      // Arrange
      component.productoForm.patchValue({ name: '' });
      spyOn(window, 'alert');

      // Act
      component.onSubmit();

      // Assert
      expect(component.productoForm.get('name')?.touched).toBeTrue();
    });
  });

  describe('onReset', () => {
    it('should reset form to original producto values', () => {
      // Arrange
      component.productoForm.patchValue({
        name: 'Changed Name',
        description: 'Changed Description'
      });

      // Act
      component.onReset();

      // Assert - El formulario debe volver a los valores originales
      expect(component.productoForm.get('name')?.value).toBe('Test Product Name');
      expect(component.productoForm.get('description')?.value).toBe('Test Description with enough length');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      // Arrange
      const testDate = new Date('2025-03-15');
      
      // Act
      const result = (component as any).formatDate(testDate);

      // Assert
      expect(result).toBe('2025-03-15');
    });

    it('should return empty string for null date', () => {
      // Act
      const result = (component as any).formatDate(null);

      // Assert
      expect(result).toBe('');
    });
  });
});
