import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {
    paginate<T>(data: T[], page: number, pageSize: number): T[] {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    }

    getTotalPages(totalItems: number, pageSize: number): number {
        return Math.ceil(totalItems / pageSize);
    }

    getPageNumbers(totalPages: number): number[] {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
}
