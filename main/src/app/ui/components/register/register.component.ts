import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router) {}

  form = new FormGroup(
    {
      uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator() } 
  );

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

    console.log(this.form.value);
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
