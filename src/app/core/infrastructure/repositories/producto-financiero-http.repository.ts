import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IProductoFinancieroRepository } from '../../domain/repositories/producto-financiero.repository.interface';
import { ProductoFinanciero } from '../../domain/entities/producto-financiero.entity';

/**
 * Implementación concreta del repositorio usando HttpClient
 * Capa de infraestructura - Detalles de implementación
 * Dependency Inversion Principle: Implementa la interfaz del dominio
 */
@Injectable({
    providedIn: 'root'
})
export class ProductoFinancieroHttpRepository implements IProductoFinancieroRepository {
    private readonly apiUrl = 'http://localhost:3002/bp/products';

    constructor(private readonly http: HttpClient) { }

    getAll(): Observable<ProductoFinanciero[]> {
        return this.http.get<{ data: any[] }>(this.apiUrl).pipe(
            map((response) => response.data.map((item: any) => this.mapToDomain(item))),
            catchError(this.handleError)
        );
    }

    getById(id: string): Observable<ProductoFinanciero> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(item => this.mapToDomain(item)),
            catchError(this.handleError)
        );
    }

    create(producto: ProductoFinanciero): Observable<void> {
        const dto = producto.toPlainObject();
        return this.http.post<any>(this.apiUrl, dto).pipe(
            map(() => undefined),
            catchError(this.handleError)
        );
    }

    update(producto: ProductoFinanciero): Observable<void> {
        const dto = producto.toPlainObject();
        return this.http.put<any>(`${this.apiUrl}/${producto.id}`, dto).pipe(
            map(() => undefined),
            catchError(this.handleError)
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
            map(() => undefined),
            catchError(this.handleError)
        );
    }

    /**
     * Mapea los datos de la API al modelo de dominio
     */
    private mapToDomain(data: any): ProductoFinanciero {
        return ProductoFinanciero.fromPlainObject(data);
    }

    /**
     * Manejo centralizado de errores HTTP
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Ocurrió un error desconocido';
        
        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Error del lado del servidor
            errorMessage = `Código del error: ${error.status}\nMensaje: ${error.message}`;
        }
        
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
