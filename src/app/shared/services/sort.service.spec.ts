import { TestBed } from '@angular/core/testing';
import { SortService, SortDirection } from './sort.service';

describe('SortService', () => {
  let service: SortService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SortService]
    });
    service = TestBed.inject(SortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sort', () => {
    interface TestItem {
      name: string;
      value: number;
      date: Date;
    }

    it('should sort strings in ascending order', () => {
      // Arrange
      const data: TestItem[] = [
        { name: 'Charlie', value: 3, date: new Date() },
        { name: 'Alice', value: 1, date: new Date() },
        { name: 'Bob', value: 2, date: new Date() }
      ];

      // Act
      const result = service.sort(data, 'name', 'asc');

      // Assert
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Charlie');
    });

    it('should sort strings in descending order', () => {
      // Arrange
      const data: TestItem[] = [
        { name: 'Alice', value: 1, date: new Date() },
        { name: 'Charlie', value: 3, date: new Date() },
        { name: 'Bob', value: 2, date: new Date() }
      ];

      // Act
      const result = service.sort(data, 'name', 'desc');

      // Assert
      expect(result[0].name).toBe('Charlie');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Alice');
    });

    it('should sort numbers in ascending order', () => {
      // Arrange
      const data: TestItem[] = [
        { name: 'C', value: 30, date: new Date() },
        { name: 'A', value: 10, date: new Date() },
        { name: 'B', value: 20, date: new Date() }
      ];

      // Act
      const result = service.sort(data, 'value', 'asc');

      // Assert
      expect(result[0].value).toBe(10);
      expect(result[1].value).toBe(20);
      expect(result[2].value).toBe(30);
    });

    it('should sort numbers in descending order', () => {
      // Arrange
      const data: TestItem[] = [
        { name: 'A', value: 10, date: new Date() },
        { name: 'C', value: 30, date: new Date() },
        { name: 'B', value: 20, date: new Date() }
      ];

      // Act
      const result = service.sort(data, 'value', 'desc');

      // Assert
      expect(result[0].value).toBe(30);
      expect(result[1].value).toBe(20);
      expect(result[2].value).toBe(10);
    });

    it('should sort dates in ascending order', () => {
      // Arrange
      const data: TestItem[] = [
        { name: 'C', value: 3, date: new Date('2025-03-01') },
        { name: 'A', value: 1, date: new Date('2025-01-01') },
        { name: 'B', value: 2, date: new Date('2025-02-01') }
      ];

      // Act
      const result = service.sort(data, 'date', 'asc');

      // Assert
      expect(result[0].date.getTime()).toBe(new Date('2025-01-01').getTime());
      expect(result[1].date.getTime()).toBe(new Date('2025-02-01').getTime());
      expect(result[2].date.getTime()).toBe(new Date('2025-03-01').getTime());
    });

    it('should handle null and undefined values', () => {
      // Arrange
      const data: TestItem[] = [
        { name: 'A', value: 10, date: new Date() },
        { name: null as any, value: 20, date: new Date() },
        { name: 'B', value: 30, date: new Date() }
      ];

      // Act
      const result = service.sort(data, 'name', 'asc');

      // Assert
      expect(result[result.length - 1].name).toBeNull(); // null values at the end
    });

    it('should not modify original array', () => {
      // Arrange
      const data: TestItem[] = [
        { name: 'C', value: 3, date: new Date() },
        { name: 'A', value: 1, date: new Date() },
        { name: 'B', value: 2, date: new Date() }
      ];
      const originalOrder = [...data];

      // Act
      service.sort(data, 'name', 'asc');

      // Assert
      expect(data).toEqual(originalOrder); // Original array unchanged
    });

    it('should return original data when column is not provided', () => {
      // Arrange
      const data: TestItem[] = [
        { name: 'C', value: 3, date: new Date() },
        { name: 'A', value: 1, date: new Date() }
      ];

      // Act
      const result = service.sort(data, null as any, 'asc');

      // Assert
      expect(result).toEqual(data);
    });

    it('should handle empty array', () => {
      // Arrange
      const data: TestItem[] = [];

      // Act
      const result = service.sort(data, 'name', 'asc');

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle array with single element', () => {
      // Arrange
      const data: TestItem[] = [
        { name: 'Only One', value: 1, date: new Date() }
      ];

      // Act
      const result = service.sort(data, 'name', 'asc');

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Only One');
    });

    it('should sort strings case-sensitively', () => {
      // Arrange
      const data: TestItem[] = [
        { name: 'banana', value: 2, date: new Date() },
        { name: 'Apple', value: 1, date: new Date() },
        { name: 'Cherry', value: 3, date: new Date() }
      ];

      // Act
      const result = service.sort(data, 'name', 'asc');

      // Assert
      // Capital letters come before lowercase in ASCII
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('Apple');
    });
  });

  describe('toggleDirection', () => {
    it('should toggle from asc to desc', () => {
      const result = service.toggleDirection('asc');
      expect(result).toBe('desc');
    });

    it('should toggle from desc to asc', () => {
      const result = service.toggleDirection('desc');
      expect(result).toBe('asc');
    });
  });
});
