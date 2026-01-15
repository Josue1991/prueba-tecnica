
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoFinancieroHttpRepository } from './producto-financiero-http.repository';
import { ProductoFinanciero } from '../../domain/entities/producto-financiero.entity';

describe('ProductoFinancieroHttpRepository', () => {
  let repository: ProductoFinancieroHttpRepository;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3002/bp/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoFinancieroHttpRepository]
    });

    repository = TestBed.inject(ProductoFinancieroHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes HTTP pendientes
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an array of ProductoFinanciero', (done) => {
      // Arrange
      const mockResponse = {
        data: [
          {
            id: '1',
            name: 'Producto 1',
            description: 'Descripción 1',
            logo: 'logo1.png',
            date_release: '2025-01-01',
            date_revision: '2026-01-01'
          },
          {
            id: '2',
            name: 'Producto 2',
            description: 'Descripción 2',
            logo: 'logo2.png',
            date_release: '2025-02-01',
            date_revision: '2026-02-01'
          }
        ]
      };

      // Act
      repository.getAll().subscribe({
        next: (productos) => {
          // Assert
          expect(productos.length).toBe(2);
          expect(productos[0]).toBeInstanceOf(ProductoFinanciero);
          expect(productos[0].id).toBe('1');
          expect(productos[0].name).toBe('Producto 1');
          expect(productos[1].id).toBe('2');
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return empty array when no productos exist', (done) => {
      // Arrange
      const mockResponse = { data: [] };

      // Act
      repository.getAll().subscribe({
        next: (productos) => {
          // Assert
          expect(productos.length).toBe(0);
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockResponse);
    });

    it('should handle HTTP error', (done) => {
      // Act
      repository.getAll().subscribe({
        error: (error) => {
          // Assert
          expect(error).toBeTruthy();
          expect(error.message).toContain('Código del error: 500');
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getById', () => {
    it('should return a single ProductoFinanciero', (done) => {
      // Arrange
      const mockProducto = {
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'logo.png',
        date_release: '2025-01-01',
        date_revision: '2026-01-01'
      };

      // Act
      repository.getById('123').subscribe({
        next: (producto) => {
          // Assert
          expect(producto).toBeInstanceOf(ProductoFinanciero);
          expect(producto.id).toBe('123');
          expect(producto.name).toBe('Test Product');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducto);
    });

    it('should handle 404 error for non-existent product', (done) => {
      // Act
      repository.getById('non-existent').subscribe({
        error: (error) => {
          // Assert
          expect(error).toBeTruthy();
          expect(error.message).toContain('404');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/non-existent`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create', () => {
    it('should create a new producto', (done) => {
      // Arrange
      const newProducto = new ProductoFinanciero(
        '123',
        'New Product',
        'New Description',
        'logo.png',
        new Date('2025-01-01'),
        new Date('2026-01-01')
      );

      // Act
      repository.create(newProducto).subscribe({
        next: () => {
          // Assert
          expect().nothing(); // Successful creation returns void
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProducto.toPlainObject());
      req.flush({});
    });

    it('should handle validation error on create', (done) => {
      // Arrange
      const invalidProducto = new ProductoFinanciero(
        'invalid',
        'Invalid',
        'Invalid',
        'logo.png',
        new Date(),
        new Date()
      );

      // Act
      repository.create(invalidProducto).subscribe({
        error: (error) => {
          // Assert
          expect(error).toBeTruthy();
          expect(error.message).toContain('400');
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update', () => {
    it('should update an existing producto', (done) => {
      // Arrange
      const updatedProducto = new ProductoFinanciero(
        '123',
        'Updated Product',
        'Updated Description',
        'updated-logo.png',
        new Date('2025-01-01'),
        new Date('2026-01-01')
      );

      // Act
      repository.update(updatedProducto).subscribe({
        next: () => {
          // Assert
          expect().nothing(); // Successful update returns void
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/123`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProducto.toPlainObject());
      req.flush({});
    });

    it('should handle 404 error when updating non-existent product', (done) => {
      // Arrange
      const producto = new ProductoFinanciero(
        'non-existent',
        'Product',
        'Description',
        'logo.png',
        new Date(),
        new Date()
      );

      // Act
      repository.update(producto).subscribe({
        error: (error) => {
          // Assert
          expect(error).toBeTruthy();
          expect(error.message).toContain('404');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/non-existent`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('delete', () => {
    it('should delete a producto by id', (done) => {
      // Act
      repository.delete('123').subscribe({
        next: () => {
          // Assert
          expect().nothing(); // Successful deletion returns void
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/123`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle error when deleting non-existent product', (done) => {
      // Act
      repository.delete('non-existent').subscribe({
        error: (error) => {
          // Assert
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/non-existent`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
