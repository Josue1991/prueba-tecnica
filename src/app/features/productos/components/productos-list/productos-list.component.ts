import { Component } from '@angular/core';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';
import { ProductosCreateComponent } from '../productos-create/productos-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductosEditComponent } from '../productos-edit/productos-edit.component';
import { GetAllProductosUseCase } from '../../../../core/application/use-cases/get-all-productos.use-case';
import { DeleteProductoUseCase } from '../../../../core/application/use-cases/delete-producto.use-case';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { FilterService } from '../../../../shared/services/filter.service';
import { SortService, SortDirection } from '../../../../shared/services/sort.service';

/**
 * Componente de lista de productos
 * Refactorizado siguiendo Clean Architecture y SOLID
 * - Usa casos de uso en lugar de servicios directos (Dependency Inversion)
 * - Delega responsabilidades a servicios especializados (Single Responsibility)
 */
@Component({
  selector: 'app-productos-list',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProductosCreateComponent,
    ProductosEditComponent],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.scss',
  standalone: true
})
export class ProductosListComponent {
  productos: ProductoFinanciero[] = [];
  productosSel: ProductoFinanciero | undefined;

  pageSize = 5;
  currentPage = 1;
  pageSizes = [5, 10, 25, 50];
  showModal = false;

  searchTerm = '';
  sortColumn: keyof ProductoFinanciero | '' = '';
  sortDirection: SortDirection = 'asc';

  filteredData: ProductoFinanciero[] = [];
  paginatedData: ProductoFinanciero[] = [];
  openedMenuId: string | null = null;

  constructor(
    private readonly getAllProductosUseCase: GetAllProductosUseCase,
    private readonly deleteProductoUseCase: DeleteProductoUseCase,
    private readonly paginationService: PaginationService,
    private readonly filterService: FilterService,
    private readonly sortService: SortService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.getAllProductosUseCase.execute().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar los productos');
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  applyFilters(): void {
    // Aplicar filtrado usando el servicio especializado
    this.filteredData = this.filterService.filter(
      this.productos,
      this.searchTerm,
      ['name', 'description']
    );

    this.applySorting();
  }

  applySorting(): void {
    if (this.sortColumn) {
      // Aplicar ordenamiento usando el servicio especializado
      this.filteredData = this.sortService.sort(
        this.filteredData,
        this.sortColumn,
        this.sortDirection
      );
    }

    this.updatePaginatedData();
  }

  sortBy(column: keyof ProductoFinanciero): void {
    if (this.sortColumn === column) {
      // Alternar dirección usando el servicio
      this.sortDirection = this.sortService.toggleDirection(this.sortDirection);
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applySorting();
  }

  updatePaginatedData(): void {
    // Aplicar paginación usando el servicio especializado
    this.paginatedData = this.paginationService.paginate(
      this.filteredData,
      this.currentPage,
      this.pageSize
    );
  }

  get totalPages(): number {
    return this.paginationService.getTotalPages(this.filteredData.length, this.pageSize);
  }

  get pages(): number[] {
    return this.paginationService.getPageNumbers(this.totalPages);
  }
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  openEditModal(item: ProductoFinanciero) {
    this.showModal = true;
    this.productosSel = item;
  }

  onEliminar(item: ProductoFinanciero): void {
    if (!item.id) {
      alert('Error: ID del producto no válido');
      return;
    }

    if (!confirm(`¿Está seguro de eliminar el producto "${item.name}"?`)) {
      return;
    }

    this.deleteProductoUseCase.execute(item.id).subscribe({
      next: () => {
        alert('Producto eliminado exitosamente');
        this.loadData();
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    });
  }

  toggleMenu(item: ProductoFinanciero) {
    this.openedMenuId = this.openedMenuId === item.id ? null : (item.id ?? null);
  }

  closeMenu() {
    setTimeout(() => {
      this.openedMenuId = null;
    }, 200);
  }

  onProductoGuardado(): void {
    this.closeModal();
    this.loadData();
  }
}
