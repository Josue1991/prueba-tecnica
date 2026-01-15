import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GetProductoByIdUseCase } from './get-producto-by-id.use-case';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../domain/injection-tokens';
import { IProductoFinancieroRepository } from '../../domain/repositories/producto-financiero.repository.interface';
import { ProductoFinanciero } from '../../domain/entities/producto-financiero.entity';

describe('GetProductoByIdUseCase', () => {
  let useCase: GetProductoByIdUseCase;
  let mockRepository: jasmine.SpyObj<IProductoFinancieroRepository>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('IProductoFinancieroRepository', ['getById']);

    TestBed.configureTestingModule({
      providers: [
        GetProductoByIdUseCase,
        { provide: PRODUCTO_FINANCIERO_REPOSITORY, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(GetProductoByIdUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository.getById() and return producto', (done) => {
    // Arrange
    const mockProducto = new ProductoFinanciero(
      '123',
      'Test Product',
      'Test Description',
      'logo.png',
      new Date('2025-01-01'),
      new Date('2026-01-01')
    );
    mockRepository.getById.and.returnValue(of(mockProducto));

    // Act
    useCase.execute('123').subscribe({
      next: (result) => {
        // Assert
        expect(mockRepository.getById).toHaveBeenCalledWith('123');
        expect(mockRepository.getById).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockProducto);
        expect(result.id).toBe('123');
        done();
      }
    });
  });

  it('should return correct producto for valid id', (done) => {
    // Arrange
    const producto = new ProductoFinanciero(
      'valid-id',
      'Valid Product',
      'Description',
      'logo.png',
      new Date(),
      new Date()
    );
    mockRepository.getById.and.returnValue(of(producto));

    // Act
    useCase.execute('valid-id').subscribe({
      next: (result) => {
        // Assert
        expect(result.id).toBe('valid-id');
        expect(result.name).toBe('Valid Product');
        done();
      }
    });
  });
});
