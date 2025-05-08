import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { Product } from 'src/app/models/product.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatButtonModule,MatIconModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  private httpClientService = inject(HttpClientService);
  private router = inject(Router); 
  displayedColumns: string[] = ['image','name', 'stock','price', 'createdDate','updateDate','actions'];

  dataSource: Product[] = []; 

  ngOnInit() {
    this.getProduct();
    this.httpClientService.get<Product[]>({
      controller: 'Product'
    }).subscribe({
      next: (data) => {
        console.log('Gelen Ürünler:', data); 
        this.dataSource = data;
      },
      error: (err) => {
        console.error('Hata oluştu:', err); 
      }
    });
  }
  onAdd() {
    console.log('Ekle butonuna tıklandı');
    this.router.navigate(['/products/create']);
  }
  
  onEdit(product: Product) {
    console.log('Güncelle:', product);
    this.router.navigate([`/products/update/${product.id}`]);
  }
  
  onDelete(product: Product) {
    console.log('Sil:', product);
    if(confirm(`"${product.name}" ürünü silmek istediğinize emin misiniz ?`))
    {
      this.httpClientService.delete<Product>({
        controller: 'Product',

      },product.id.toString()).subscribe(()=> {
        alert("Ürün Silindi.");
        this.getProduct();
      });
    }
  }
  getProduct() {
    this.httpClientService.get<Product[]>({
      controller: 'Product'
    }).subscribe({
      next: (data) => {
        this.dataSource = data.map(item => ({
          ...item,
          image: item.image 
         ? `https://ticaret.blob.core.windows.net/files/${item.image}`
         : '',
          createdDate: item.createdDate ? new Date(item.createdDate) : null,
          updateDate: item.updateDate ? new Date(item.updateDate) : null
        }));
        console.log('Dönüştürülmüş veriler:', this.dataSource);
      },
      error: (err) => {
        console.error('Hata:', err);
      }
    });
  }
  
}
