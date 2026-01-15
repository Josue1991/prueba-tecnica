import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductosDeleteComponent } from './productos-delete.component';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../../../core/domain/injection-tokens';
import { IProductoFinancieroRepository } from '../../../../core/domain/repositories/producto-financiero.repository.interface';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';
import { DeleteProductoUseCase } from '../../../../core/application/use-cases/delete-producto.use-case';

describe('ProductosDeleteComponent', () => {
  let component: ProductosDeleteComponent;
  let fixture: ComponentFixture<ProductosDeleteComponent>;
  let mockRepository: jasmine.SpyObj<IProductoFinancieroRepository>;
  let mockDeleteProductoUseCase: jasmine.SpyObj<DeleteProductoUseCase>;

  beforeEach(async () => {
    mockRepository = jasmine.createSpyObj('IProductoFinancieroRepository', [
      'getAll',
      'getById',
      'create',
      'update',
      'delete'
    ]);

    mockDeleteProductoUseCase = jasmine.createSpyObj('DeleteProductoUseCase', ['execute']);

    await TestBed.configureTestingModule({
      imports: [ProductosDeleteComponent],
      providers: [
        { provide: PRODUCTO_FINANCIERO_REPOSITORY, useValue: mockRepository },
        { provide: DeleteProductoUseCase, useValue: mockDeleteProductoUseCase }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosDeleteComponent);
    component = fixture.componentInstance;
    
    // Provide input
    component.productoAEliminar = new ProductoFinanciero(
      'test-id',
      'Test Product',
      'Test Description',
      'logo.png',
      new Date(),
      new Date()
    );
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDelete', () => {
    it('should call deleteProductoUseCase with correct id', () => {
      // Arrange
      mockDeleteProductoUseCase.execute.and.returnValue(of(undefined));
      spyOn(window, 'alert');
      spyOn(component.productoEliminado, 'emit');

      // Act
      component.onDelete(component.productoAEliminar);

      // Assert
      expect(mockDeleteProductoUseCase.execute).toHaveBeenCalledWith('test-id');
      expect(window.alert).toHaveBeenCalledWith('Producto eliminado exitosamente');
      expect(component.productoEliminado.emit).toHaveBeenCalled();
    });

    it('should emit productoEliminado event on successful deletion', () => {
      // Arrange
      mockDeleteProductoUseCase.execute.and.returnValue(of(undefined));
      spyOn(component.productoEliminado, 'emit');
      spyOn(window, 'alert');

      // Act
      component.onDelete(component.productoAEliminar);

      // Assert
      expect(component.productoEliminado.emit).toHaveBeenCalled();
    });

    it('should show alert for invalid producto', () => {
      // Arrange
      const invalidProducto = {} as ProductoFinanciero;
      spyOn(window, 'alert');

      // Act
      component.onDelete(invalidProducto);

      // Assert
      expect(window.alert).toHaveBeenCalledWith('Error: Producto no válido');
      expect(mockDeleteProductoUseCase.execute).not.toHaveBeenCalled();
    });

    it('should show alert for null producto', () => {
      // Arrange
      spyOn(window, 'alert');

      // Act
      component.onDelete(null as any);

      // Assert
      expect(window.alert).toHaveBeenCalledWith('Error: Producto no válido');
      expect(mockDeleteProductoUseCase.execute).not.toHaveBeenCalled();
    });

    it('should handle deletion error', () => {
      // Arrange
      const error = new Error('Deletion failed');
      mockDeleteProductoUseCase.execute.and.returnValue(throwError(() => error));
      spyOn(window, 'alert');
      spyOn(console, 'error');

      // Act
      component.onDelete(component.productoAEliminar);

      // Assert
      expect(console.error).toHaveBeenCalledWith('Error al eliminar producto:', error);
      expect(window.alert).toHaveBeenCalledWith('Error al eliminar el producto');
    });
  });

  describe('onCancel', () => {
    it('should emit productoEliminado event', () => {
      // Arrange
      spyOn(component.productoEliminado, 'emit');

      // Act
      component.onCancel();

      // Assert
      expect(component.productoEliminado.emit).toHaveBeenCalled();
    });
  });
});
