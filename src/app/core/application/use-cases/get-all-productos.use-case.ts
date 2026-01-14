import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoFinanciero } from '../../domain/entities/producto-financiero.entity';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../domain/injection-tokens';

/**
 * Caso de uso: Obtener todos los productos financieros
 * Single Responsibility Principle: Una sola razón de cambio
 */
@Injectable({
    providedIn: 'root'
})
export class GetAllProductosUseCase {
    private readonly repository = inject(PRODUCTO_FINANCIERO_REPOSITORY);

    execute(): Observable<ProductoFinanciero[]> {
        return this.repository.getAll();
    }
}
