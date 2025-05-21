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
    this.getProduct();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
     this.paginator.page.subscribe(() => {
    this.getProduct(this.paginator.pageIndex, this.paginator.pageSize);
     });
  }

getProduct(pageIndex: number = 0, pageSize: number = 5): void {
  this.httpClientService.get<{ data: Product[], totalCount: number }>(
    { controller: 'Product' },
    undefined,
    `page=${pageIndex + 1}&size=${pageSize}`
  ).subscribe({
    next: (response) => {
      const transformedData = this.transformProductData(response.data);
      this.dataSource.data = transformedData;
      this.paginator.length = response.totalCount ?? transformedData.length;
    },
    error: (err) => {
      console.error('Ürünler alınırken hata oluştu:', err);
    }
  });
}
pageChanged() {
 this.getProduct();
}

private transformProductData(products: Product[]): Product[] {
  return products.map(item => ({
    ...item,
    image: item.image
      ? `https://ticaret.blob.core.windows.net/files/${item.image}`
      : '',
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
      this.httpClientService.delete<Product>({
        controller: 'Product'
      }, product.id.toString()).subscribe(() => {
        alert("Ürün Silindi.");
        this.getProduct();
      });
    }
  }
}
