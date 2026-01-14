import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoFinanciero } from '../../domain/entities/producto-financiero.entity';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../domain/injection-tokens';

/**
 * Caso de uso: Crear un nuevo producto financiero
 * Single Responsibility Principle: Una sola razón de cambio
 */
@Injectable({
    providedIn: 'root'
})
export class CreateProductoUseCase {
    private readonly repository = inject(PRODUCTO_FINANCIERO_REPOSITORY);

    execute(producto: ProductoFinanciero): Observable<void> {
        // Validación en la capa de aplicación
        if (!producto) {
            throw new Error('El producto es obligatorio');
        }
        
        return this.repository.create(producto);
    }
}
