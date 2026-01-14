import { Observable } from 'rxjs';
import { ProductoFinanciero } from '../entities/producto-financiero.entity';

/**
 * Interface del repositorio de productos financieros
 * Define el contrato para las operaciones de datos (Dependency Inversion Principle)
 */
export abstract class IProductoFinancieroRepository {
    abstract getAll(): Observable<ProductoFinanciero[]>;
    abstract getById(id: string): Observable<ProductoFinanciero>;
    abstract create(producto: ProductoFinanciero): Observable<void>;
    abstract update(producto: ProductoFinanciero): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
