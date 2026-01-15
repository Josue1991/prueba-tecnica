import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GetAllProductosUseCase } from './get-all-productos.use-case';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../domain/injection-tokens';
import { IProductoFinancieroRepository } from '../../domain/repositories/producto-financiero.repository.interface';
import { ProductoFinanciero } from '../../domain/entities/producto-financiero.entity';

describe('GetAllProductosUseCase', () => {
  let useCase: GetAllProductosUseCase;
  let mockRepository: jasmine.SpyObj<IProductoFinancieroRepository>;

  beforeEach(() => {
    // Crear mock del repositorio
    mockRepository = jasmine.createSpyObj('IProductoFinancieroRepository', ['getAll']);

    TestBed.configureTestingModule({
      providers: [
        GetAllProductosUseCase,
        { provide: PRODUCTO_FINANCIERO_REPOSITORY, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(GetAllProductosUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository.getAll() and return productos', (done) => {
    // Arrange
    const mockProductos: ProductoFinanciero[] = [
      new ProductoFinanciero('1', 'Producto 1', 'Desc 1', 'logo1.png', new Date(), new Date()),
      new ProductoFinanciero('2', 'Producto 2', 'Desc 2', 'logo2.png', new Date(), new Date())
    ];
    mockRepository.getAll.and.returnValue(of(mockProductos));

    // Act
    useCase.execute().subscribe({
      next: (result) => {
        // Assert
        expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockProductos);
        expect(result.length).toBe(2);
        done();
      }
    });
  });

  it('should return empty array when no productos exist', (done) => {
    // Arrange
    mockRepository.getAll.and.returnValue(of([]));

    // Act
    useCase.execute().subscribe({
      next: (result) => {
        // Assert
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      }
    });
  });
});
