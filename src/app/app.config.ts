import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { PRODUCTO_FINANCIERO_REPOSITORY } from './core/domain/injection-tokens';
import { ProductoFinancieroHttpRepository } from './core/infrastructure/repositories/producto-financiero-http.repository';

/**
 * Configuración de la aplicación
 * Dependency Inversion Principle: Registro de implementaciones concretas para interfaces
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // Inversión de dependencias: El token se resuelve con la implementación concreta
    {
      provide: PRODUCTO_FINANCIERO_REPOSITORY,
      useClass: ProductoFinancieroHttpRepository
    }
  ]
};
