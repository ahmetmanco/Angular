import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CoreService } from 'src/app/services/core.service';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/Entities/user';
import { UserService } from 'src/app/services/common/user.service';
import { Create_User } from 'src/app/contract/create_user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, MaterialModule ,FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router,private userService : UserService) {}

  form = new FormGroup(
    {
      uname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator() } 
  );

  get f() {
    return this.form.controls;
  }
  
  submitted: boolean = false;

async submit() {
  this.submitted = true;

  if (this.form.invalid) return;

  const user = this.form.value as User;
  console.log(user);

  const result : Create_User = await this.userService.create(user);
  if(result.Succeeded) 
    alert("kullanıcı kaydı başarılı");
  
  this.router.navigate(['/']);
}

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }
}
