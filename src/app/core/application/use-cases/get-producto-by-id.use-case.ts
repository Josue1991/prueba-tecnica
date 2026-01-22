import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoFinanciero } from '../../domain/entities/producto-financiero.entity';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../domain/injection-tokens';

@Injectable({
    providedIn: 'root'
})
export class GetProductoByIdUseCase {
    private readonly repository = inject(PRODUCTO_FINANCIERO_REPOSITORY);

    execute(id: string): Observable<ProductoFinanciero> {
        if (!id || id.trim() === '') {
            throw new Error('El ID del producto es obligatorio');
        }
        return this.repository.getById(id);
    }
}
