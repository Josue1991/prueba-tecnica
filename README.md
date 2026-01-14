# Prueba Técnica - Productos Financieros

[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-blue.svg)](ARCHITECTURE.md)
[![SOLID](https://img.shields.io/badge/Principles-SOLID-green.svg)](ARCHITECTURE.md)
[![Angular](https://img.shields.io/badge/Angular-19.2.8-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Aplicación Angular para gestión de productos financieros, completamente refactorizada siguiendo los principios de **Clean Architecture** (Arquitectura Limpia) y **SOLID**.

---

## 🏗️ Arquitectura

Este proyecto implementa **Clean Architecture** con las siguientes capas:

```
📦 src/app/
├── 🎯 core/                    # Núcleo de la aplicación
│   ├── domain/                 # Capa de Dominio
│   │   ├── entities/           # Entidades de negocio
│   │   └── repositories/       # Interfaces (contratos)
│   ├── application/            # Capa de Aplicación
│   │   └── use-cases/          # Casos de uso (lógica de negocio)
│   └── infrastructure/         # Capa de Infraestructura
│       └── repositories/       # Implementaciones concretas
│
├── 🔧 shared/                  # Servicios compartidos
│   └── services/               # Paginación, filtrado, ordenamiento
│
└── 🎨 features/                # Módulos de características
    └── productos/              # Módulo de productos
        └── components/         # Componentes de presentación
```

### ✅ Principios SOLID Implementados

| Principio | ✓ | Implementación |
|-----------|---|----------------|
| **S**ingle Responsibility | ✅ | Cada clase tiene una única responsabilidad |
| **O**pen/Closed | ✅ | Abierto a extensión, cerrado a modificación |
| **L**iskov Substitution | ✅ | Implementaciones intercambiables |
| **I**nterface Segregation | ✅ | Interfaces específicas y cohesivas |
| **D**ependency Inversion | ✅ | Dependencias invertidas mediante abstracciones |

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm 10+
- Angular CLI 19+

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

---

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| [**ARCHITECTURE.md**](ARCHITECTURE.md) | 📖 Documentación completa de la arquitectura |
| [**GETTING_STARTED.md**](GETTING_STARTED.md) | 🚀 Guía de inicio rápido |
| [**REFACTORING_SUMMARY.md**](REFACTORING_SUMMARY.md) | 📊 Resumen de la refactorización |
| [**EXTENSION_GUIDE.md**](EXTENSION_GUIDE.md) | 🔮 Guía para extender la aplicación |

---

## 🎯 Características Principales

### ✨ Casos de Uso Implementados

- ✅ **GetAllProductosUseCase**: Obtener todos los productos
- ✅ **GetProductoByIdUseCase**: Obtener un producto por ID
- ✅ **CreateProductoUseCase**: Crear nuevo producto
- ✅ **UpdateProductoUseCase**: Actualizar producto existente
- ✅ **DeleteProductoUseCase**: Eliminar producto

### 🛠️ Servicios Auxiliares

- ✅ **PaginationService**: Manejo de paginación
- ✅ **FilterService**: Filtrado de datos
- ✅ **SortService**: Ordenamiento de datos

---

## 🔄 Flujo de Datos

```
Usuario → Componente → Caso de Uso → IRepository → HttpRepository → API
```

**Inversión de Dependencias:**
- Los componentes dependen de casos de uso
- Los casos de uso dependen de interfaces (no implementaciones)
- Las implementaciones se inyectan mediante configuración

---

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Tests con cobertura
npm run test:coverage
```

### Ejemplo de Test

```typescript
describe('CreateProductoUseCase', () => {
  it('debe crear un producto', () => {
    const mockRepository = jasmine.createSpyObj('IProductoFinancieroRepository', ['create']);
    mockRepository.create.and.returnValue(of(undefined));
    
    const useCase = new CreateProductoUseCase(mockRepository);
    // ... aserciones
  });
});
```

---

## 📦 Build

```bash
# Build de producción
npm run build

# Build optimizado
ng build --configuration production
```

---

## 🎨 Estructura del Proyecto

### Detalles de Implementación

#### 🎯 Capa de Dominio
- **ProductoFinanciero**: Entidad con validaciones de negocio
- **IProductoFinancieroRepository**: Contrato para operaciones de datos

#### 🔧 Capa de Aplicación
- **5 Casos de Uso** independientes y testeables
- Cada uno con una responsabilidad única

#### 🏗️ Capa de Infraestructura
- **ProductoFinancieroHttpRepository**: Implementación con HttpClient
- Manejo centralizado de errores
- Mapeo automático de DTOs a entidades

#### 🎨 Capa de Presentación
- Componentes refactorizados
- Delegación de responsabilidades
- Uso de servicios especializados

---

## 💡 Beneficios de esta Arquitectura

| Beneficio | Descripción |
|-----------|-------------|
| 🧹 **Mantenibilidad** | Código limpio, organizado y fácil de modificar |
| 🧪 **Testabilidad** | Fácil crear mocks y tests unitarios |
| 📈 **Escalabilidad** | Agregar funcionalidades sin romper código existente |
| 🔄 **Flexibilidad** | Cambiar implementaciones sin afectar casos de uso |
| 📚 **Documentación** | Código autodocumentado y bien estructurado |

---

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm start                    # Servidor de desarrollo
npm run dev                  # Alias para start

# Build
npm run build               # Compilación de producción
ng build --watch            # Build con watch mode

# Testing
npm test                    # Tests unitarios
npm run test:coverage       # Tests con cobertura

# Linting
npm run lint                # Análisis de código
```

---

## 🎓 Ejemplos de Uso

### Crear un nuevo producto

```typescript
// En el componente
constructor(private createProductoUseCase: CreateProductoUseCase) {}

crearProducto(): void {
  const producto = new ProductoFinanciero(
    'PRD-001',
    'Tarjeta de Crédito Platino',
    'Tarjeta con beneficios premium',
    'logo.png',
    new Date('2024-01-01'),
    new Date('2025-01-01')
  );

  this.createProductoUseCase.execute(producto).subscribe({
    next: () => console.log('Producto creado'),
    error: (err) => console.error('Error:', err)
  });
}
```

### Obtener todos los productos

```typescript
constructor(private getAllProductosUseCase: GetAllProductosUseCase) {}

cargarProductos(): void {
  this.getAllProductosUseCase.execute().subscribe({
    next: (productos) => this.productos = productos,
    error: (err) => console.error('Error:', err)
  });
}
```

---

## 🔮 Extensibilidad

### Agregar nueva implementación de repositorio

```typescript
// 1. Crear nueva implementación
export class ProductoLocalStorageRepository implements IProductoFinancieroRepository {
  // Implementación con LocalStorage
}

// 2. Cambiar en app.config.ts
{
  provide: IProductoFinancieroRepository,
  useClass: ProductoLocalStorageRepository  // ← Sin cambiar casos de uso
}
```

Ver [EXTENSION_GUIDE.md](EXTENSION_GUIDE.md) para más ejemplos.

---

## 📊 Antes vs Después

### ❌ Antes (Sin Clean Architecture)
- Servicios monolíticos con múltiples responsabilidades
- Componentes con lógica de negocio
- Acoplamiento directo a HttpClient
- Difícil de testear y mantener

### ✅ Después (Con Clean Architecture)
- Separación clara de responsabilidades
- Casos de uso independientes y testeables
- Inversión de dependencias
- Fácil de extender y mantener

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

**Nota**: Por favor sigue los principios SOLID y Clean Architecture al contribuir.

---

## 📝 Licencia

Este proyecto es de código abierto.

---

## 📞 Contacto

Para preguntas o sugerencias sobre la arquitectura, consulta la documentación:
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura detallada
- [EXTENSION_GUIDE.md](EXTENSION_GUIDE.md) - Guía de extensión

---

## 🎉 ¡Gracias!

Este proyecto demuestra la implementación de:
- ✅ Clean Architecture
- ✅ Principios SOLID
- ✅ Best Practices de Angular
- ✅ Separation of Concerns
- ✅ Dependency Inversion

**¡Feliz codificación! 🚀**
