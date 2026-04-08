import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private readonly API_URL = 'http://localhost:5000/api/products';

  products: Product[] = [];
  filteredProducts: Product[] = [];
  pagedProducts: Product[] = [];

  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  sortField: keyof Product = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  isLoading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    // TODO 1: Complete destroy$ to prevent memory leaks
  }

  // TODO 2: Implement loadProducts()
  // - Set isLoading = true before the request
  // - GET from this.API_URL typed as Product[]
  // - Use takeUntil(this.destroy$)
  // - On success: store in this.products, call applyFilters()
  // - On error: set errorMessage
  // - Always set isLoading = false when done
  loadProducts(): void {}

  // TODO 3: Implement applyFilters()
  // - Copy this.products into a local array
  // - Filter by searchTerm (case-insensitive match on name)
  // - Filter by selectedCategory (exact match)
  // - Filter by selectedStatus (exact match)
  // - Set this.filteredProducts, reset currentPage to 1
  // - Call sortProducts() then updatePagination()
  applyFilters(): void {}

  // TODO 4: Implement sortProducts()
  // - Sort this.filteredProducts by this.sortField
  // - Respect this.sortDirection ('asc' | 'desc')
  sortProducts(): void {}

  // TODO 5: Implement updatePagination()
  // - Calculate totalPages from filteredProducts.length / pageSize
  // - Ensure currentPage never exceeds totalPages
  // - Slice filteredProducts into this.pagedProducts
  updatePagination(): void {}

  // TODO 6: Implement setSort(field)
  // - Same field → toggle direction
  // - New field → set field, reset to 'asc'
  // - Re-sort and update pagination
  setSort(field: keyof Product): void {}

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  sortIcon(field: keyof Product): string {
    if (this.sortField !== field) return '';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  get categories(): string[] {
    return [...new Set(this.products.map(p => p.category))].sort();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
