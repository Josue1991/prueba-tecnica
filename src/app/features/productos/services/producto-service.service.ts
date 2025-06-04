import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductoFinanciero } from '../models/producto-financiero';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    private apiUrl = 'http://localhost:3002';

    constructor(private http: HttpClient) { }

    getProductos(): Observable<ProductoFinanciero[]> {
        return this.http.get<{ data: any[] }>(`${this.apiUrl}/bp/products`)
            .pipe(
                map(response => response.data.map(item => this.mapToProductoFinanciero(item))),
                catchError(this.handleError)
            );
    }

    crearProducto(producto: ProductoFinanciero): Observable<any> {
        let url = this.apiUrl + '/bp/products';
        return this.http.post<any>(url, producto)
            .pipe(
                catchError(this.handleError)
            );
    }

    actualizarProducto(producto: ProductoFinanciero): Observable<any> {
        let url = this.apiUrl + '/bp/products/' + producto.id;
        return this.http.put<any>(url, producto)
            .pipe(
                catchError(this.handleError)
            );
    }

    eliminarProducto(producto: ProductoFinanciero): Observable<any> {
        let url = this.apiUrl + '/bp/products/' + producto.id;
        return this.http.delete<any>(url)
            .pipe(
                catchError(this.handleError)
            );
    }

    getProducto(id: number): Observable<ProductoFinanciero> {
        return this.http.get<ProductoFinanciero>(`${this.apiUrl}/bp/products/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
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

    mapToProductoFinanciero(data: any): ProductoFinanciero {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            logo: data.logo,
            date_release: new Date(data.date_release),
            date_revision: new Date(data.date_revision)
        };
    }

}
