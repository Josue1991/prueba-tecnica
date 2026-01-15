import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductosCreateComponent } from './productos-create.component';
import { CreateProductoUseCase } from '../../../../core/application/use-cases/create-producto.use-case';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';

describe('ProductosCreateComponent', () => {
  let component: ProductosCreateComponent;
  let fixture: ComponentFixture<ProductosCreateComponent>;
  let mockCreateProductoUseCase: jasmine.SpyObj<CreateProductoUseCase>;

  beforeEach(async () => {
    // Create mock use case
    mockCreateProductoUseCase = jasmine.createSpyObj('CreateProductoUseCase', ['execute']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProductosCreateComponent],
      providers: [
        { provide: CreateProductoUseCase, useValue: mockCreateProductoUseCase }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.productoForm).toBeDefined();
    expect(component.productoForm.get('id')?.value).toBe('');
    expect(component.productoForm.get('name')?.value).toBe('');
    expect(component.productoForm.get('description')?.value).toBe('');
  });

  describe('Form Validations', () => {
    it('should mark form as invalid when fields are empty', () => {
      expect(component.productoForm.valid).toBeFalse();
    });

    it('should validate id pattern', () => {
      const idControl = component.productoForm.get('id');
      
      // Invalid patterns
      idControl?.setValue('invalid id with spaces');
      expect(idControl?.hasError('pattern')).toBeTrue();
      
      // Valid pattern
      idControl?.setValue('valid-id-123');
      expect(idControl?.hasError('pattern')).toBeFalse();
    });

    it('should validate name minLength', () => {
      const nameControl = component.productoForm.get('name');
      
      nameControl?.setValue('Short');
      expect(nameControl?.hasError('minlength')).toBeTrue();
      
      nameControl?.setValue('Valid Name');
      expect(nameControl?.hasError('minlength')).toBeFalse();
    });

    it('should validate description minLength', () => {
      const descControl = component.productoForm.get('description');
      
      descControl?.setValue('Short');
      expect(descControl?.hasError('minlength')).toBeTrue();
      
      descControl?.setValue('Valid description with more than 10 chars');
      expect(descControl?.hasError('minlength')).toBeFalse();
    });

    it('should validate all required fields', () => {
      expect(component.productoForm.get('id')?.hasError('required')).toBeTrue();
      expect(component.productoForm.get('name')?.hasError('required')).toBeTrue();
      expect(component.productoForm.get('description')?.hasError('required')).toBeTrue();
      expect(component.productoForm.get('logo')?.hasError('required')).toBeTrue();
      expect(component.productoForm.get('date_release')?.hasError('required')).toBeTrue();
      expect(component.productoForm.get('date_revision')?.hasError('required')).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Fill form with valid data
      component.productoForm.patchValue({
        id: 'test-123',
        name: 'Test Product',
        description: 'Test description with enough length',
        logo: 'logo.png',
        date_release: '2025-01-01',
        date_revision: '2026-01-01'
      });
    });

    it('should call createProductoUseCase when form is valid', () => {
      // Arrange
      mockCreateProductoUseCase.execute.and.returnValue(of(undefined as any));
      spyOn(window, 'alert');
      spyOn(component.productoGuardado, 'emit');

      // Act
      component.onSubmit();

      // Assert
      expect(mockCreateProductoUseCase.execute).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Producto creado exitosamente');
      expect(component.productoGuardado.emit).toHaveBeenCalled();
    });

    it('should emit productoGuardado event on successful creation', () => {
      // Arrange
      mockCreateProductoUseCase.execute.and.returnValue(of(undefined as any));
      spyOn(component.productoGuardado, 'emit');
      spyOn(window, 'alert');

      // Act
      component.onSubmit();

      // Assert
      expect(component.productoGuardado.emit).toHaveBeenCalled();
    });

    it('should reset form after successful creation', () => {
      // Arrange
      mockCreateProductoUseCase.execute.and.returnValue(of(undefined as any));
      spyOn(window, 'alert');
      spyOn(component, 'onReset');

      // Act
      component.onSubmit();

      // Assert
      expect(component.onReset).toHaveBeenCalled();
    });

    it('should show alert when form is invalid', () => {
      // Arrange
      component.productoForm.reset();
      spyOn(window, 'alert');

      // Act
      component.onSubmit();

      // Assert
      expect(window.alert).toHaveBeenCalledWith('Por favor llene los campos requeridos');
      expect(mockCreateProductoUseCase.execute).not.toHaveBeenCalled();
    });

    it('should handle creation error', () => {
      // Arrange
      const error = new Error('Creation failed');
      mockCreateProductoUseCase.execute.and.returnValue(throwError(() => error));
      spyOn(window, 'alert');
      spyOn(console, 'error');

      // Act
      component.onSubmit();

      // Assert
      expect(console.error).toHaveBeenCalledWith('Error al crear producto:', error);
      expect(window.alert).toHaveBeenCalledWith('Error al crear el producto: Creation failed');
    });

    it('should mark all fields as touched when form is invalid', () => {
      // Arrange
      component.productoForm.reset();
      spyOn(window, 'alert');

      // Act
      component.onSubmit();

      // Assert
      expect(component.productoForm.get('id')?.touched).toBeTrue();
      expect(component.productoForm.get('name')?.touched).toBeTrue();
    });
  });

  describe('onReset', () => {
    it('should reset form to initial state', () => {
      // Arrange
      component.productoForm.patchValue({
        id: 'test-123',
        name: 'Test Product',
        description: 'Test description'
      });

      // Act
      component.onReset();

      // Assert
      expect(component.productoForm.get('id')?.value).toBeNull();
      expect(component.productoForm.get('name')?.value).toBeNull();
      expect(component.productoForm.get('description')?.value).toBeNull();
    });
  });
});
