import { Component, Input } from '@angular/core';
import { ProductoFinanciero } from '../../models/producto-financiero';
import { ProductosCreateComponent } from '../productos-create/productos-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto-service.service';
import { ProductosEditComponent } from '../productos-edit/productos-edit.component';

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
  sortDirection: 'asc' | 'desc' = 'asc';

  filteredData: ProductoFinanciero[] = [];
  paginatedData: ProductoFinanciero[] = [];
  openedMenuId: string | null = null;

  constructor(private readonly productoService: ProductoService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.productoService.getProductos().subscribe(resultado => {
      this.paginatedData = resultado;
      console.log(this.paginatedData);
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
    const term = this.searchTerm.toLowerCase();
    if (term != "") {
      this.filteredData = this.paginatedData.filter(p =>
        (p.name ?? '').toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term)
      );
    }
    else {
      this.loadData();
    }

    this.applySorting();
  }

  applySorting(): void {
    if (this.sortColumn) {
      this.filteredData.sort((a, b) => {
        const valueA = a[this.sortColumn as keyof ProductoFinanciero] ?? '';
        const valueB = b[this.sortColumn as keyof ProductoFinanciero] ?? '';

        return this.sortDirection === 'asc'
          ? valueA > valueB ? 1 : -1
          : valueA < valueB ? 1 : -1;
      });
    }

    this.updatePaginatedData();
  }

  sortBy(column: keyof ProductoFinanciero): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applySorting();
  }

  updatePaginatedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  onEliminar(item: ProductoFinanciero) {
    this.productoService.eliminarProducto(item).subscribe(resultado => {
      alert(resultado.message);
      this.applyFilters(); // Para que se apliquen búsquedas, paginación, etc.
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
    this.productoService.getProductos().subscribe(resultado => {
      this.productos = resultado;
      this.applyFilters(); // Para que se apliquen búsquedas, paginación, etc.
    });
  }
}
