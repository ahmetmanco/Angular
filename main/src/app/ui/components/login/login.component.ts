import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/common/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/common/auth.service';
import { tokenResponse } from 'src/app/Token/tokenResponse';
import { Token } from '@angular/compiler';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router, private userService : UserService,private snackBar: MatSnackBar, private authService  : AuthService) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }
  async login(uname:string, password:string) {
    await this.userService.login(uname,password, () => {
    this.authService.identityCheck(); // bu şart!
    } );
  }
  
  async submit() {
  if (this.form.invalid) return;

  const uname = this.form.value.uname!;
  const password = this.form.value.password!;

  try {
    const result = await this.userService.login(uname, password);
    this.router.navigate(['/']); // Başarılıysa anasayfaya yönlendir
  } catch (error) {
    console.error("Giriş başarısız", error);
    alert("Giriş başarısız. Lütfen kullanıcı adınızı ve şifrenizi kontrol edin.");
    this.router.navigate(['/login']); // Başarısızsa login sayfasına yönlendir
  }
}


}
