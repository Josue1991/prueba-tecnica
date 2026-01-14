/**
 * DIAGRAMA DE ARQUITECTURA LIMPIA
 * ================================
 * 
 * Este proyecto sigue Clean Architecture con las siguientes capas:
 * 
 * 
 *     ┌────────────────────────────────────────────────────────────┐
 *     │                    CAPA DE PRESENTACIÓN                     │
 *     │                     (Presentation Layer)                    │
 *     │                                                             │
 *     │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
 *     │  │  Productos   │  │  Productos   │  │  Productos   │    │
 *     │  │     List     │  │    Create    │  │     Edit     │    │
 *     │  │  Component   │  │  Component   │  │  Component   │    │
 *     │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
 *     └─────────┼──────────────────┼──────────────────┼───────────┘
 *               │                  │                  │
 *               │ usa casos de uso │                  │
 *               ↓                  ↓                  ↓
 *     ┌────────────────────────────────────────────────────────────┐
 *     │                   CAPA DE APLICACIÓN                        │
 *     │                   (Application Layer)                       │
 *     │                      [Casos de Uso]                         │
 *     │                                                             │
 *     │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌─────┐ │
 *     │  │GetAll  │  │GetById │  │ Create │  │ Update │  │Delete│ │
 *     │  │UseCase │  │UseCase │  │UseCase │  │UseCase │  │UseCase│ │
 *     │  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └──┬──┘ │
 *     └──────┼───────────┼───────────┼───────────┼──────────┼─────┘
 *            │           │           │           │          │
 *            │           │           │           │          │
 *            └───────────┴───────────┴───────────┴──────────┘
 *                              │
 *                              │ depende de
 *                              ↓
 *     ┌────────────────────────────────────────────────────────────┐
 *     │                     CAPA DE DOMINIO                         │
 *     │                      (Domain Layer)                         │
 *     │            [Entidades e Interfaces]                         │
 *     │                                                             │
 *     │  ┌──────────────────────────────────────────────────┐     │
 *     │  │     IProductoFinancieroRepository (Interface)     │     │
 *     │  │                                                   │     │
 *     │  │  + getAll(): Observable<ProductoFinanciero[]>    │     │
 *     │  │  + getById(id): Observable<ProductoFinanciero>   │     │
 *     │  │  + create(producto): Observable<void>            │     │
 *     │  │  + update(producto): Observable<void>            │     │
 *     │  │  + delete(id): Observable<void>                  │     │
 *     │  └────────────────────┬─────────────────────────────┘     │
 *     │                       │                                    │
 *     │  ┌───────────────────────────────────────────────┐        │
 *     │  │  ProductoFinanciero (Entity)                  │        │
 *     │  │                                               │        │
 *     │  │  - id: string                                 │        │
 *     │  │  - name: string                               │        │
 *     │  │  - description: string                        │        │
 *     │  │  - logo: string                               │        │
 *     │  │  - dateRelease: Date                          │        │
 *     │  │  - dateRevision: Date                         │        │
 *     │  │                                               │        │
 *     │  │  + validate(): void                           │        │
 *     │  │  + toPlainObject(): any                       │        │
 *     │  └───────────────────────────────────────────────┘        │
 *     └────────────────────────────────────────────────────────────┘
 *                              ↑
 *                              │ implementa
 *                              │
 *     ┌────────────────────────────────────────────────────────────┐
 *     │                 CAPA DE INFRAESTRUCTURA                     │
 *     │                  (Infrastructure Layer)                     │
 *     │               [Implementaciones Concretas]                  │
 *     │                                                             │
 *     │  ┌──────────────────────────────────────────────────────┐ │
 *     │  │  ProductoFinancieroHttpRepository                    │ │
 *     │  │  implements IProductoFinancieroRepository            │ │
 *     │  │                                                      │ │
 *     │  │  - apiUrl: string                                    │ │
 *     │  │  - http: HttpClient                                  │ │
 *     │  │                                                      │ │
 *     │  │  + getAll(): Observable<ProductoFinanciero[]>       │ │
 *     │  │  + getById(id): Observable<ProductoFinanciero>      │ │
 *     │  │  + create(producto): Observable<void>               │ │
 *     │  │  + update(producto): Observable<void>               │ │
 *     │  │  + delete(id): Observable<void>                     │ │
 *     │  │  - mapToDomain(data): ProductoFinanciero            │ │
 *     │  │  - handleError(error): Observable<never>            │ │
 *     │  └──────────────────────────────────────────────────────┘ │
 *     └────────────────────────────────────────────────────────────┘
 *                              │
 *                              │ usa
 *                              ↓
 *                    [API Externa / Backend]
 * 
 * 
 * SERVICIOS AUXILIARES (Shared Services)
 * ======================================
 * 
 *     ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
 *     │   Pagination    │  │     Filter      │  │      Sort       │
 *     │     Service     │  │     Service     │  │     Service     │
 *     ├─────────────────┤  ├─────────────────┤  ├─────────────────┤
 *     │ + paginate()    │  │ + filter()      │  │ + sort()        │
 *     │ + getTotalPages│  │                 │  │ + toggleDir()   │
 *     │ + getPageNums() │  │                 │  │                 │
 *     └─────────────────┘  └─────────────────┘  └─────────────────┘
 * 
 * 
 * INVERSIÓN DE DEPENDENCIAS (Dependency Injection)
 * =================================================
 * 
 *     app.config.ts
 *     ┌─────────────────────────────────────────────────────────┐
 *     │  providers: [                                           │
 *     │    {                                                    │
 *     │      provide: IProductoFinancieroRepository,            │
 *     │      useClass: ProductoFinancieroHttpRepository         │
 *     │    }                                                    │
 *     │  ]                                                      │
 *     └─────────────────────────────────────────────────────────┘
 * 
 *     Esto permite:
 *     - Cambiar la implementación sin modificar los casos de uso
 *     - Testear fácilmente con mocks
 *     - Agregar nuevas implementaciones (LocalStorage, IndexedDB, etc.)
 * 
 * 
 * FLUJO DE DATOS
 * ==============
 * 
 *  Usuario interactúa con UI
 *           ↓
 *  Componente (Presentación)
 *           ↓
 *  Caso de Uso (Aplicación)
 *           ↓
 *  IRepository (Dominio - Interfaz)
 *           ↓
 *  HttpRepository (Infraestructura - Implementación)
 *           ↓
 *  API Externa (Backend)
 *           ↓
 *  Respuesta mapeada a Entidad de Dominio
 *           ↓
 *  Caso de Uso retorna al Componente
 *           ↓
 *  Componente muestra en UI
 * 
 */

export const ARCHITECTURE_DIAGRAM = 'Clean Architecture Diagram';
