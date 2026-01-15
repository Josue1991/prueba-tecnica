import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CreateProductoUseCase } from './create-producto.use-case';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../domain/injection-tokens';
import { IProductoFinancieroRepository } from '../../domain/repositories/producto-financiero.repository.interface';
import { ProductoFinanciero } from '../../domain/entities/producto-financiero.entity';

describe('CreateProductoUseCase', () => {
  let useCase: CreateProductoUseCase;
  let mockRepository: jasmine.SpyObj<IProductoFinancieroRepository>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('IProductoFinancieroRepository', ['create']);

    TestBed.configureTestingModule({
      providers: [
        CreateProductoUseCase,
        { provide: PRODUCTO_FINANCIERO_REPOSITORY, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(CreateProductoUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository.create() successfully', (done) => {
    // Arrange
    const newProducto = new ProductoFinanciero(
      '123',
      'Test Product',
      'Test Description',
      'logo.png',
      new Date('2025-01-01'),
      new Date('2026-01-01')
    );
    mockRepository.create.and.returnValue(of(undefined));

    // Act
    useCase.execute(newProducto).subscribe({
      next: () => {
        // Assert
        expect(mockRepository.create).toHaveBeenCalledWith(newProducto);
        expect(mockRepository.create).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  it('should validate producto before creation', (done) => {
    // Arrange
    const validProducto = new ProductoFinanciero(
      'valid-id',
      'Valid Name',
      'Valid Description',
      'logo.png',
      new Date('2025-01-01'),
      new Date('2026-01-01')
    );
    mockRepository.create.and.returnValue(of(undefined));

    // Act
    useCase.execute(validProducto).subscribe({
      next: () => {
        // Assert
        expect(mockRepository.create).toHaveBeenCalled();
        done();
      }
    });
  });
});
