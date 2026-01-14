import { Injectable } from '@angular/core';

/**
 * Servicio de paginación
 * Single Responsibility Principle: Solo se encarga de la lógica de paginación
 */
@Injectable({
    providedIn: 'root'
})
export class PaginationService {
    /**
     * Pagina un array de datos
     */
    paginate<T>(data: T[], page: number, pageSize: number): T[] {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    }

    /**
     * Calcula el número total de páginas
     */
    getTotalPages(totalItems: number, pageSize: number): number {
        return Math.ceil(totalItems / pageSize);
    }

    /**
     * Genera un array con los números de página
     */
    getPageNumbers(totalPages: number): number[] {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
}
