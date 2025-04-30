import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { MatCardHeader } from '@angular/material/card';
import { MatCard } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardHeader, MatCardHeader, MatCardTitle,MatCard, MatCardContent],
  standalone: true,
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  
})
export class CreateComponent {
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    stock: [0, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(1)]],
  });

  constructor(private fb: FormBuilder, private https: HttpClientService, private router: Router) {}
  goBack() {
    this.router.navigate(['/dashboard/products']);
  }
  
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // tüm alanları tetikler
      return;
    }
  
    const newProduct: Product = {
      name: this.form.value.name ?? '',
      stock: this.form.value.stock ?? 0,
      price: this.form.value.price ?? 0,
      id: 0,
    };
  
    this.https.post<Product>({ controller: 'Product' }, newProduct).subscribe(() => {
      alert('Ürün eklendi');
      this.router.navigate(['/dashboard/products']);
    });
  }
}
