import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductosListComponent } from './productos-list.component';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../../../core/domain/injection-tokens';
import { IProductoFinancieroRepository } from '../../../../core/domain/repositories/producto-financiero.repository.interface';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';
import { GetAllProductosUseCase } from '../../../../core/application/use-cases/get-all-productos.use-case';
import { DeleteProductoUseCase } from '../../../../core/application/use-cases/delete-producto.use-case';

describe('ProductosListComponent', () => {
  let component: ProductosListComponent;
  let fixture: ComponentFixture<ProductosListComponent>;
  let mockRepository: jasmine.SpyObj<IProductoFinancieroRepository>;
  let mockGetAllProductosUseCase: jasmine.SpyObj<GetAllProductosUseCase>;

  const mockProductos: ProductoFinanciero[] = [
    new ProductoFinanciero('1', 'Product 1', 'Description 1', 'logo1.png', new Date('2025-01-01'), new Date('2026-01-01')),
    new ProductoFinanciero('2', 'Product 2', 'Description 2', 'logo2.png', new Date('2025-02-01'), new Date('2026-02-01')),
    new ProductoFinanciero('3', 'Product 3', 'Description 3', 'logo3.png', new Date('2025-03-01'), new Date('2026-03-01'))
  ];

  beforeEach(async () => {
    mockRepository = jasmine.createSpyObj('IProductoFinancieroRepository', [
      'getAll',
      'getById',
      'create',
      'update',
      'delete'
    ]);

    mockGetAllProductosUseCase = jasmine.createSpyObj('GetAllProductosUseCase', ['execute']);
    mockGetAllProductosUseCase.execute.and.returnValue(of(mockProductos));

    await TestBed.configureTestingModule({
      imports: [ProductosListComponent, FormsModule],
      providers: [
        { provide: PRODUCTO_FINANCIERO_REPOSITORY, useValue: mockRepository },
        { provide: GetAllProductosUseCase, useValue: mockGetAllProductosUseCase }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadData', () => {
    it('should load productos on init', () => {
      // Assert
      expect(mockGetAllProductosUseCase.execute).toHaveBeenCalled();
      expect(component.productos.length).toBe(3);
    });

    it('should handle load error', () => {
      // Arrange
      const error = new Error('Load failed');
      mockGetAllProductosUseCase.execute.and.returnValue(throwError(() => error));
      spyOn(window, 'alert');
      spyOn(console, 'error');

      // Act
      component.loadData();

      // Assert
      expect(console.error).toHaveBeenCalledWith('Error al cargar productos:', error);
      expect(window.alert).toHaveBeenCalledWith('Error al cargar los productos');
    });
  });

  describe('Pagination', () => {
    it('should paginate data correctly', () => {
      // Arrange
      component.pageSize = 2;
      component.currentPage = 1;

      // Act
      component.applyFilters();

      // Assert
      expect(component.paginatedData.length).toBeLessThanOrEqual(2);
    });

    it('should change page size', () => {
      // Arrange
      const event = { target: { value: '10' } } as any;

      // Act
      component.onPageSizeChange(event);

      // Assert
      expect(component.pageSize).toBe(10);
      expect(component.currentPage).toBe(1);
    });
  });

  describe('Search', () => {
    it('should filter productos by search term', () => {
      // Arrange
      component.searchTerm = 'Product 1';

      // Act
      component.onSearchChange();

      // Assert
      expect(component.filteredData.length).toBe(1);
      expect(component.filteredData[0].name).toBe('Product 1');
    });

    it('should reset to page 1 on search', () => {
      // Arrange
      component.currentPage = 3;
      component.searchTerm = 'test';

      // Act
      component.onSearchChange();

      // Assert
      expect(component.currentPage).toBe(1);
    });
  });

  describe('Modal operations', () => {
    it('should open modal for creating producto', () => {
      // Act
      component.openModal();

      // Assert
      expect(component.showModal).toBeTrue();
      expect(component.action).toBe('crear');
      expect(component.productosSel).toBeUndefined();
    });

    it('should open modal for editing producto', () => {
      // Arrange
      const producto = mockProductos[0];

      // Act
      component.openEditModal(producto);

      // Assert
      expect(component.showModal).toBeTrue();
      expect(component.action).toBe('editar');
      expect(component.productosSel).toBe(producto);
    });

    it('should open modal for deleting producto', () => {
      // Arrange
      const producto = mockProductos[0];

      // Act
      component.onEliminar(producto);

      // Assert
      expect(component.showModal).toBeTrue();
      expect(component.action).toBe('eliminar');
      expect(component.productosSel).toBe(producto);
    });

    it('should close modal', () => {
      // Arrange
      component.showModal = true;

      // Act
      component.closeModal();

      // Assert
      expect(component.showModal).toBeFalse();
    });
  });

  describe('Menu operations', () => {
    it('should toggle menu for producto', () => {
      // Arrange
      const producto = mockProductos[0];

      // Act
      component.toggleMenu(producto);

      // Assert
      expect(component.openedMenuId).toBe(producto.id);
    });

    it('should close menu when toggling same producto', () => {
      // Arrange
      const producto = mockProductos[0];
      component.openedMenuId = producto.id;

      // Act
      component.toggleMenu(producto);

      // Assert
      expect(component.openedMenuId).toBeNull();
    });

    it('should close menu after delay', (done) => {
      // Arrange
      component.openedMenuId = 'some-id';

      // Act
      component.closeMenu();

      // Assert
      setTimeout(() => {
        expect(component.openedMenuId).toBeNull();
        done();
      }, 250);
    });
  });

  describe('Event handlers', () => {
    it('should reload data on producto guardado', () => {
      // Arrange
      spyOn(component, 'loadData');
      spyOn(component, 'closeModal');

      // Act
      component.onProductoGuardado();

      // Assert
      expect(component.closeModal).toHaveBeenCalled();
      expect(component.loadData).toHaveBeenCalled();
    });

    it('should reload data on producto eliminado', () => {
      // Arrange
      spyOn(component, 'loadData');
      spyOn(component, 'closeModal');

      // Act
      component.onProductoEliminado();

      // Assert
      expect(component.closeModal).toHaveBeenCalled();
      expect(component.loadData).toHaveBeenCalled();
    });
  });
});
