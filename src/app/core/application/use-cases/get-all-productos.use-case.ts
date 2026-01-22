import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoFinanciero } from '../../domain/entities/producto-financiero.entity';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../domain/injection-tokens';

@Injectable({
    providedIn: 'root'
})
export class GetAllProductosUseCase {
    private readonly repository = inject(PRODUCTO_FINANCIERO_REPOSITORY);

    execute(): Observable<ProductoFinanciero[]> {
        return this.repository.getAll();
    }
}
