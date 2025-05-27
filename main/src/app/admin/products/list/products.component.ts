import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { Product } from 'src/app/models/product.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  private httpClientService = inject(HttpClientService);
  private router = inject(Router);

  displayedColumns: string[] = ['image', 'name', 'stock', 'price', 'createdDate', 'updateDate', 'actions'];

  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    setTimeout(() => {
      this.getProduct(0, this.paginator?.pageSize || 5);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe(() => {
      this.getProduct(this.paginator.pageIndex, this.paginator.pageSize);
    });
  }

  getProduct(pageIndex: number = 0, pageSize: number = 5): void {
    this.httpClientService.get<{ products: Product[], totalCount: number }>(
      { controller: 'Product' },
      undefined,
      `page=${pageIndex}&size=${pageSize}`
    ).subscribe({
      next: (response) => {
        console.log("Sunucudan gelen veri:", response);

        if (!response || !Array.isArray(response.products)) {
          console.warn("Sunucudan beklenen veri gelmedi veya veri formatı hatalı:", response);
          this.dataSource.data = [];
          this.paginator.length = 0;
          return;
        }

        const transformed = this.transformProductData(response.products);
        this.dataSource.data = transformed;
        this.paginator.length = response.totalCount ?? transformed.length;
      },
      error: (err) => {
        console.error('Ürünler alınırken hata oluştu:', err);
      }
    });
  }

  private transformProductData(products: Product[]): Product[] {
  if (!Array.isArray(products)) {
    console.warn('transformProductData: ürün listesi geçersiz:', products);
    return [];
  }

  return products.map(item => ({
    ...item,
    // Artık image doğrudan tam URL olduğu için tekrar ekleme yapma!
    image: item.Image,
    createdDate: item.createdDate ? new Date(item.createdDate) : null,
    updateDate: item.updateDate ? new Date(item.updateDate) : null
  }));
}



  onAdd(): void {
    this.router.navigate(['/products/create']);
  }

  onEdit(product: Product): void {
    this.router.navigate([`/products/update/${product.id}`]);
  }

  onDelete(product: Product): void {
    if (confirm(`"${product.name}" ürünü silmek istediğinize emin misiniz?`)) {
      this.httpClientService.delete<Product>(
        { controller: 'Product' },
        product.id.toString()
      ).subscribe(() => {
        alert("Ürün Silindi.");
        this.getProduct();
      });
    }
  }
}
