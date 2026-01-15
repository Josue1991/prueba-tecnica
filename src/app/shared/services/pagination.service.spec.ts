import { TestBed } from '@angular/core/testing';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginationService]
    });
    service = TestBed.inject(PaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('paginate', () => {
    it('should return correct page of data', () => {
      // Arrange
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const page = 2;
      const pageSize = 3;

      // Act
      const result = service.paginate(data, page, pageSize);

      // Assert
      expect(result).toEqual([4, 5, 6]);
    });

    it('should return first page correctly', () => {
      // Arrange
      const data = ['a', 'b', 'c', 'd', 'e'];
      const page = 1;
      const pageSize = 2;

      // Act
      const result = service.paginate(data, page, pageSize);

      // Assert
      expect(result).toEqual(['a', 'b']);
    });

    it('should return empty array when page exceeds total pages', () => {
      // Arrange
      const data = [1, 2, 3];
      const page = 5;
      const pageSize = 2;

      // Act
      const result = service.paginate(data, page, pageSize);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle last page with fewer items', () => {
      // Arrange
      const data = [1, 2, 3, 4, 5, 6, 7];
      const page = 3;
      const pageSize = 3;

      // Act
      const result = service.paginate(data, page, pageSize);

      // Assert
      expect(result).toEqual([7]);
    });

    it('should handle empty data array', () => {
      // Arrange
      const data: number[] = [];
      const page = 1;
      const pageSize = 10;

      // Act
      const result = service.paginate(data, page, pageSize);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getTotalPages', () => {
    it('should calculate total pages correctly', () => {
      // Arrange & Act
      const result = service.getTotalPages(100, 10);

      // Assert
      expect(result).toBe(10);
    });

    it('should round up when items do not divide evenly', () => {
      // Arrange & Act
      const result = service.getTotalPages(25, 10);

      // Assert
      expect(result).toBe(3);
    });

    it('should return 0 for empty data', () => {
      // Arrange & Act
      const result = service.getTotalPages(0, 10);

      // Assert
      expect(result).toBe(0);
    });

    it('should return 1 when items less than page size', () => {
      // Arrange & Act
      const result = service.getTotalPages(5, 10);

      // Assert
      expect(result).toBe(1);
    });
  });

  describe('getPageNumbers', () => {
    it('should generate array of page numbers', () => {
      // Arrange & Act
      const result = service.getPageNumbers(5);

      // Assert
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return empty array for 0 pages', () => {
      // Arrange & Act
      const result = service.getPageNumbers(0);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return single element for 1 page', () => {
      // Arrange & Act
      const result = service.getPageNumbers(1);

      // Assert
      expect(result).toEqual([1]);
    });
  });
});
