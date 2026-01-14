import { Injectable } from '@angular/core';

/**
 * Servicio de filtrado
 * Single Responsibility Principle: Solo se encarga de la lógica de filtrado
 */
@Injectable({
    providedIn: 'root'
})
export class FilterService {
    /**
     * Filtra un array de objetos por un término de búsqueda
     * Busca en las propiedades especificadas
     */
    filter<T>(
        data: T[],
        searchTerm: string,
        properties: (keyof T)[]
    ): T[] {
        if (!searchTerm || searchTerm.trim() === '') {
            return data;
        }

        const term = searchTerm.toLowerCase().trim();

        return data.filter(item =>
            properties.some(prop => {
                const value = item[prop];
                if (value === null || value === undefined) {
                    return false;
                }
                return String(value).toLowerCase().includes(term);
            })
        );
    }
}
