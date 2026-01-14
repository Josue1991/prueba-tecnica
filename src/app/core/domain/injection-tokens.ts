import { InjectionToken } from '@angular/core';
import { IProductoFinancieroRepository } from './repositories/producto-financiero.repository.interface';

/**
 * Injection Token para IProductoFinancieroRepository
 * Permite inyectar la interfaz en Angular (Dependency Inversion Principle)
 */
export const PRODUCTO_FINANCIERO_REPOSITORY = new InjectionToken<IProductoFinancieroRepository>(
    'IProductoFinancieroRepository'
);
