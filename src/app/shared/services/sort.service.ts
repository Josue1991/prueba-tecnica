import { Injectable } from '@angular/core';

export type SortDirection = 'asc' | 'desc';

@Injectable({
    providedIn: 'root'
})
export class SortService {
    sort<T>(
        data: T[],
        column: keyof T,
        direction: SortDirection
    ): T[] {
        if (!column) {
            return data;
        }

        return [...data].sort((a, b) => {
            const valueA = a[column];
            const valueB = b[column];

            if (valueA === null || valueA === undefined) return 1;
            if (valueB === null || valueB === undefined) return -1;

            let comparison = 0;
            if (valueA > valueB) {
                comparison = 1;
            } else if (valueA < valueB) {
                comparison = -1;
            }

            return direction === 'asc' ? comparison : -comparison;
        });
    }

    toggleDirection(currentDirection: SortDirection): SortDirection {
        return currentDirection === 'asc' ? 'desc' : 'asc';
    }
}
