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
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardHeader, MatCardHeader, MatCardTitle,MatCard, MatCardContent, MatIconModule],
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
    image: [null],
    imageUrl: ['']
  });
  selectedFile: File | null = null;
  productid!: number;
constructor(private fb: FormBuilder, private https: HttpClientService, private router: Router, private route: ActivatedRoute) {}

ngOnInit(): void {
  this.productid = +this.route.snapshot.params['id'];

  this.https.get<Product>({ controller: 'Product' }, this.productid.toString()).subscribe((product) => {
    const patchedProduct = {
      name: product.name,
      stock: product.stock,
      price: product.price,
      createdDate: product.createdDate ? new Date(product.createdDate) : null,
      updateDate: product.updateDate ? new Date(product.updateDate) : null,
      imageUrl: product.image // image URL backend'den geliyorsa burası
    };

    this.form.patchValue(patchedProduct);
    console.log('Ürün verisi:', patchedProduct);
  });
}
goBack() {
  this.router.navigate(['/products']);
}

onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    this.selectedFile = fileInput.files[0];
    console.log('Seçilen dosya:', this.selectedFile);
  }
}

submit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    alert('Form geçersiz.');
    return;
  }

  const formData = new FormData();
  formData.append('id', this.productid.toString());
  formData.append('name', this.form.value.name!);
  formData.append('stock', this.form.value.stock!.toString());
  formData.append('price', this.form.value.price!.toString());
  formData.append('createdDate', this.form.value.createdDate?.toISOString() ?? '');
  formData.append('updateDate', new Date().toISOString());

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  } else if (this.form.value.imageUrl) {
    // Yeni resim yok, eski URL'yi gönder
    formData.append('imageUrl', this.form.value.imageUrl);
  }

  this.https.putFormData<Product>({ controller: 'Product' }, formData).subscribe(() => {
    alert('Ürün güncellendi');
    this.router.navigate(['/products']);
  });
}
}
