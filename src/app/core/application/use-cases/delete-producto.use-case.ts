import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUCTO_FINANCIERO_REPOSITORY } from '../../domain/injection-tokens';

@Injectable({
    providedIn: 'root'
})
export class DeleteProductoUseCase {
    private readonly repository = inject(PRODUCTO_FINANCIERO_REPOSITORY);

    execute(id: string): Observable<void> {
        if (!id || id.trim() === '') {
            throw new Error('El ID del producto es obligatorio');
        }
        return this.repository.delete(id);
    }
}
