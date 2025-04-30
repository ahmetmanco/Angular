import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardHeader } from '@angular/material/card';
import { MatCard } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardHeader, MatCardHeader, MatCardTitle,MatCard, MatCardContent],
    standalone: true,
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {
  form = this.fb.group({
    name: [''],
    stock:[0],
    price: [0],
    createdDate: [null as Date | null],
    updateDate: [null as Date | null],
  });
  productid!: number;
constructor(private fb: FormBuilder, private https: HttpClientService, private router: Router, private route: ActivatedRoute) {}
ngOnInit(): void {
  this.productid = +this.route.snapshot.params['id'];
  this.https.get<Product>({ controller: 'Product' }, this.productid.toString()).subscribe((product) => {
    const patchedProduct = {
      ...product,
      createdDate: product.createdDate ? new Date(product.createdDate) : null,
      updateDate: product.updateDate ? new Date(product.updateDate) : null,
    };

    this.form.patchValue(patchedProduct);
    console.log('Ürün verisi:', patchedProduct);
    
  });
}
goBack() {
  this.router.navigate(['/dashboard/products']);
}
 submit() {
    
  if (this.form.invalid) return;

  const updateProduct: Product = {
    id: this.productid,
    name: this.form.value.name ?? '',
    stock: this.form.value.stock ?? 0,
    price: this.form.value.price ?? 0,
    createdDate: this.form.value.createdDate ?? null,
    updateDate: this.form.value.updateDate ? new Date(this.form.value.updateDate) : null,
  };
    this.https.put<Product>({ controller: 'Product' }, updateProduct).subscribe(() => {
      alert('Ürün eklendi');
      this.router.navigate(['/dashboard/products']); // liste sayfasına dön
    });
  }
}
