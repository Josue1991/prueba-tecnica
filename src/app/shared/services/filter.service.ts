import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
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
