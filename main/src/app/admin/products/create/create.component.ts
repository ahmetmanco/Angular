import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardHeader,
    MatCardTitle,
    MatCard,
    MatCardContent,
    MatIconModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    stock: ['', [Validators.required, Validators.min(1)]],
    price: ['', [Validators.required, Validators.min(1)]],
  });

  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private https: HttpClientService,
    private router: Router
  ) {}

  goBack() {
    this.router.navigate(['/products']);
  }
imagePreview: string | ArrayBuffer | null = null;

onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!validTypes.includes(file.type)) {
      alert('Sadece JPG, JPEG veya PNG dosyaları yükleyebilirsiniz.');
      fileInput.value = '';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}


  submit() {
    if (this.form.invalid || !this.selectedFile) {
      this.form.markAllAsTouched();
      alert('Form geçersiz veya resim seçilmedi.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.form.value.name!);
    formData.append('stock', this.form.value.stock!.toString());
    formData.append('price', this.form.value.price!.toString());
    formData.append('Image', this.selectedFile);
  
    
    this.https.postFormData<Product>({ controller: 'Product' }, formData).subscribe(() => {
      alert('Ürün eklendi');
      this.router.navigate(['/products']);
    });
  }
}
