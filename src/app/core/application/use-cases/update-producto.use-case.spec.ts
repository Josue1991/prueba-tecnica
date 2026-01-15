import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UpdateProductoUseCase } from './update-producto.use-case';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../domain/injection-tokens';
import { IProductoFinancieroRepository } from '../../domain/repositories/producto-financiero.repository.interface';
import { ProductoFinanciero } from '../../domain/entities/producto-financiero.entity';

describe('UpdateProductoUseCase', () => {
  let useCase: UpdateProductoUseCase;
  let mockRepository: jasmine.SpyObj<IProductoFinancieroRepository>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('IProductoFinancieroRepository', ['update']);

    TestBed.configureTestingModule({
      providers: [
        UpdateProductoUseCase,
        { provide: PRODUCTO_FINANCIERO_REPOSITORY, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(UpdateProductoUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository.update() successfully', (done) => {
    // Arrange
    const updatedProducto = new ProductoFinanciero(
      '123',
      'Updated Product',
      'Updated Description',
      'updated-logo.png',
      new Date('2025-01-01'),
      new Date('2026-01-01')
    );
    mockRepository.update.and.returnValue(of(undefined));

    // Act
    useCase.execute(updatedProducto).subscribe({
      next: () => {
        // Assert
        expect(mockRepository.update).toHaveBeenCalledWith(updatedProducto);
        expect(mockRepository.update).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  it('should accept producto for update', (done) => {
    // Arrange
    const producto = new ProductoFinanciero(
      '456',
      'Original Name',
      'Original Description',
      'logo.png',
      new Date('2025-01-01'),
      new Date('2026-01-01')
    );
    mockRepository.update.and.returnValue(of(undefined));

    // Act
    useCase.execute(producto).subscribe({
      next: () => {
        // Assert
        expect(mockRepository.update).toHaveBeenCalledWith(producto);
        done();
      }
    });
  });
});
