import { Component, computed, effect, inject, signal } from '@angular/core';
import { ProductoFinanciero } from '../../../../core/domain/entities/producto-financiero.entity';
import { ProductosCreateComponent } from '../productos-create/productos-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductosEditComponent } from '../productos-edit/productos-edit.component';
import { GetAllProductosUseCase } from '../../../../core/application/use-cases/get-all-productos.use-case';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { FilterService } from '../../../../shared/services/filter.service';
import { SortService, SortDirection } from '../../../../shared/services/sort.service';
import { ProductosDeleteComponent } from '../productos-delete/productos-delete.component';

@Component({
  selector: 'app-productos-list',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProductosCreateComponent,
    ProductosEditComponent,
    ProductosDeleteComponent],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.scss',
  standalone: true
})
export class ProductosListComponent {
  private readonly getAllProductosUseCase = inject(GetAllProductosUseCase);
  private readonly paginationService = inject(PaginationService);
  private readonly filterService = inject(FilterService);
  private readonly sortService = inject(SortService);

  productos = signal<ProductoFinanciero[]>([]);
  productosSel = signal<ProductoFinanciero | undefined>(undefined);
  action = signal<'crear' | 'editar' | 'eliminar'>('crear');
  
  pageSize = signal(5);
  currentPage = signal(1);
  pageSizes = [5, 10, 25, 50];
  showModal = signal(false);
  
  searchTerm = signal('');
  sortColumn = signal<keyof ProductoFinanciero | ''>('');
  sortDirection = signal<SortDirection>('asc');
  
  openedMenuId = signal<string | null>(null);

  filteredData = computed(() => {
    let data = this.productos();
    const term = this.searchTerm();
    if (term) {
      data = this.filterService.filter(data, term, ['name', 'description']);
    }
    const column = this.sortColumn();
    if (column) {
      data = this.sortService.sort(data, column, this.sortDirection());
    }
    return data;
  });

  paginatedData = computed(() => {
    return this.paginationService.paginate(
      this.filteredData(),
      this.currentPage(),
      this.pageSize()
    );
  });

  totalPages = computed(() => {
    return this.paginationService.getTotalPages(
      this.filteredData().length,
      this.pageSize()
    );
  });

  pages = computed(() => {
    return this.paginationService.getPageNumbers(this.totalPages());
  });

  constructor() {
    // Cargar datos al inicializar
    this.loadData();
  }

  loadData(): void {
    this.getAllProductosUseCase.execute().subscribe({
      next: (productos) => {
        this.productos.set(productos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar los productos');
      }
    });
  }

  onSearchChange(): void {
    this.currentPage.set(1);
  }

  onPageSizeChange(event: Event): void {
    this.pageSize.set(Number((event.target as HTMLSelectElement).value));
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  sortBy(column: keyof ProductoFinanciero): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortService.toggleDirection(this.sortDirection()));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  openModal() {
    this.showModal.set(true);
    this.action.set('crear');
  }

  closeModal() {
    this.showModal.set(false);
  }

  openEditModal(item: ProductoFinanciero) {
    this.showModal.set(true);
    this.action.set('editar');
    this.productosSel.set(item);
  }

  onEliminar(item: ProductoFinanciero): void {
    if (!item.id) {
      alert('Error: ID del producto no válido');
      return;
    }
    this.showModal.set(true);
    this.action.set('eliminar');
    this.productosSel.set(item);
  }

  toggleMenu(item: ProductoFinanciero) {
    this.openedMenuId.set(this.openedMenuId() === item.id ? null : (item.id ?? null));
  }

  closeMenu() {
    setTimeout(() => {
      this.openedMenuId.set(null);
    }, 200);
  }

  onProductoGuardado(): void {
    this.closeModal();
    this.loadData();
  }
  
  onProductoEliminado(): void {
    this.closeModal();
    this.loadData();
  }
}
