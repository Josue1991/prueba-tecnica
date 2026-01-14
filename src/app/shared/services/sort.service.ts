import { Injectable } from '@angular/core';

export type SortDirection = 'asc' | 'desc';

/**
 * Servicio de ordenamiento
 * Single Responsibility Principle: Solo se encarga de la lógica de ordenamiento
 */
@Injectable({
    providedIn: 'root'
})
export class SortService {
    /**
     * Ordena un array de objetos por una propiedad específica
     */
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

            // Manejo de valores nulos/undefined
            if (valueA === null || valueA === undefined) return 1;
            if (valueB === null || valueB === undefined) return -1;

            // Comparación
            let comparison = 0;
            if (valueA > valueB) {
                comparison = 1;
            } else if (valueA < valueB) {
                comparison = -1;
            }

            return direction === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Alterna la dirección del ordenamiento
     */
    toggleDirection(currentDirection: SortDirection): SortDirection {
        return currentDirection === 'asc' ? 'desc' : 'asc';
    }
}
