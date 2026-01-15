import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterService]
    });
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('filter', () => {
    interface TestItem {
      name: string;
      description: string;
      value: number;
    }

    const testData: TestItem[] = [
      { name: 'Product A', description: 'Description A', value: 100 },
      { name: 'Product B', description: 'Description B', value: 200 },
      { name: 'Product C', description: 'Test Description', value: 300 },
      { name: 'Test Product', description: 'Another one', value: 400 }
    ];

    it('should filter by single property', () => {
      // Arrange & Act
      const result = service.filter(testData, 'Product A', ['name']);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Product A');
    });

    it('should filter by multiple properties', () => {
      // Arrange & Act
      const result = service.filter(testData, 'Test', ['name', 'description']);

      // Assert
      expect(result.length).toBe(2); // "Test Product" and "Test Description"
      expect(result.some(item => item.name === 'Test Product')).toBe(true);
      expect(result.some(item => item.description === 'Test Description')).toBe(true);
    });

    it('should be case insensitive', () => {
      // Arrange & Act
      const result = service.filter(testData, 'PRODUCT', ['name']);

      // Assert
      expect(result.length).toBe(4); // All items contain "Product"
    });

    it('should return all data when search term is empty', () => {
      // Arrange & Act
      const result = service.filter(testData, '', ['name']);

      // Assert
      expect(result).toEqual(testData);
    });

    it('should return all data when search term is only whitespace', () => {
      // Arrange & Act
      const result = service.filter(testData, '   ', ['name']);

      // Assert
      expect(result).toEqual(testData);
    });

    it('should return empty array when no matches found', () => {
      // Arrange & Act
      const result = service.filter(testData, 'NonExistent', ['name', 'description']);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle null and undefined values', () => {
      // Arrange
      const dataWithNulls: TestItem[] = [
        { name: 'Product', description: null as any, value: 100 },
        { name: null as any, description: 'Description', value: 200 }
      ];

      // Act
      const result = service.filter(dataWithNulls, 'Product', ['name', 'description']);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Product');
    });

    it('should trim search term before filtering', () => {
      // Arrange & Act
      const result = service.filter(testData, '  Product A  ', ['name']);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Product A');
    });

    it('should perform partial match', () => {
      // Arrange & Act
      const result = service.filter(testData, 'Prod', ['name']);

      // Assert
      expect(result.length).toBe(4); // All names start with "Product"
    });
  });
});
