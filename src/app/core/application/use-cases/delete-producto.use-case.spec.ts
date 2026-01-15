import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DeleteProductoUseCase } from './delete-producto.use-case';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../domain/injection-tokens';
import { IProductoFinancieroRepository } from '../../domain/repositories/producto-financiero.repository.interface';

describe('DeleteProductoUseCase', () => {
  let useCase: DeleteProductoUseCase;
  let mockRepository: jasmine.SpyObj<IProductoFinancieroRepository>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('IProductoFinancieroRepository', ['delete']);

    TestBed.configureTestingModule({
      providers: [
        DeleteProductoUseCase,
        { provide: PRODUCTO_FINANCIERO_REPOSITORY, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(DeleteProductoUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository.delete() with correct id', (done) => {
    // Arrange
    const productId = '123';
    mockRepository.delete.and.returnValue(of(undefined));

    // Act
    useCase.execute(productId).subscribe({
      next: () => {
        // Assert
        expect(mockRepository.delete).toHaveBeenCalledWith(productId);
        expect(mockRepository.delete).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  it('should successfully delete producto', (done) => {
    // Arrange
    mockRepository.delete.and.returnValue(of(undefined));

    // Act
    useCase.execute('456').subscribe({
      next: () => {
        // Assert
        expect(mockRepository.delete).toHaveBeenCalledWith('456');
        done();
      }
    });
  });

  it('should throw error for empty id', () => {
    // Arrange & Act & Assert
    expect(() => useCase.execute('')).toThrow(new Error('El ID del producto es obligatorio'));
  });
});
