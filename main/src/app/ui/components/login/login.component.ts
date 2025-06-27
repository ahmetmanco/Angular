import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/common/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/common/auth.service';
import { tokenResponse } from 'src/app/Token/tokenResponse';
import { SocialAuthService, SocialUser, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    GoogleSigninButtonModule // SADECE bu modülü import edin
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required]),
  });

  private authSubscription!: Subscription;
  isLoading = false;
  googleLoading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) {
    socialAuthService.authState.subscribe((user: SocialUser)=> { console.log(user)})
  }

  ngOnInit() {
    this.setupGoogleAuth();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  get f() {
    return this.form.controls;
  }

  private setupGoogleAuth() {
    this.authSubscription = this.socialAuthService.authState.subscribe({
      next: (user: SocialUser) => {
        if (user) {
          this.handleGoogleLogin(user);
        }
      },
      error: (error) => {
        console.error('Google auth error:', error);
        this.snackBar.open('Google girişinde hata oluştu', 'Kapat', { duration: 3000 });
        this.googleLoading = false;
      }
    });
  }

 private handleGoogleLogin(user: SocialUser) {
  this.googleLoading = true;
  
  this.userService.googleLogin(user.idToken).subscribe({
    next: (response) => {
      this.authService.setToken(response.token.accessToken);
      this.authService.identityCheck();
      this.navigateAfterLogin();
    },
    error: (error) => {
      console.error('Google login error:', error);
      this.snackBar.open('Google ile giriş başarısız', 'Kapat', {duration: 3000});
      this.googleLoading = false;
    },
    complete: () => {
      this.googleLoading = false;
    }
  });
}
  async submit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    try {
      await this.userService.login(
        this.form.value.uname!, 
        this.form.value.password!,
        () => {
          this.authService.identityCheck();
          this.navigateAfterLogin();
        }
      );
    } catch (error) {
      console.error('Login error:', error);
      this.snackBar.open('Giriş başarısız! Kullanıcı adı veya şifre hatalı.', 'Kapat', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  signInWithGoogle(): void {
    this.googleLoading = true;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, {
      prompt: 'select_account',
      ux_mode: 'popup'
    }).catch(error => {
      console.error('Google sign in error:', error);
      this.snackBar.open('Google ile giriş başlatılamadı', 'Kapat', { duration: 3000 });
      this.googleLoading = false;
    });
  }

  private navigateAfterLogin() {
    this.activatedRoute.queryParams.subscribe(params => {
      const returnUrl = params['returnUrl'] || '/dashboard';
      this.router.navigate([returnUrl]);
    });
  }
}