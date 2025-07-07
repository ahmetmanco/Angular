import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/common/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, firstValueFrom, Observable, Subscription, take } from 'rxjs';
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
    GoogleSigninButtonModule,
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
    this.checkExistingSession();
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
  get f() {
    return this.form.controls;
  }

  private checkExistingSession() {
    if (this.authService.isAuthenticated()) {
      this.navigateAfterLogin();
    }
  }

  private setupGoogleAuth() {
    this.authSubscription = this.socialAuthService.authState
      .pipe(filter(user => !!user))
      .subscribe({
        next: (user: SocialUser) => this.handleGoogleLogin(user),
        error: (error) => this.handleGoogleError(error)
      });
  }

  private async handleGoogleLogin(user: SocialUser) {
    this.googleLoading = true;
    
    try {
      const response = await this.userService.googleLogin(user.idToken).toPromise();
      
      if (response?.token?.accessToken) {
        this.authService.setToken(response.token.accessToken);
        this.navigateAfterLogin();
      } else {
        throw new Error('Geçersiz token yanıtı');
      }
    } catch (error) {
      this.handleGoogleError(error);
    } finally {
      this.googleLoading = false;
    }
  }

  private handleGoogleError(error: any) {
    console.error('Google auth error:', error);
    this.snackBar.open('Google ile giriş başarısız oldu', 'Kapat', { 
      duration: 5000,
      panelClass: 'error-snackbar'
    });
    this.googleLoading = false;
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    try {
      const response = await this.userService.login(
        this.form.value.uname!, 
        this.form.value.password!
      );
      
      this.authService.setToken(response.token.accessToken);
      this.navigateAfterLogin();
    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private handleLoginError(error: any) {
    console.error('Login error:', error);
    this.snackBar.open('Giriş başarısız! Kullanıcı adı veya şifre hatalı.', 'Kapat', { 
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }

  signInWithGoogle(): void {
    this.googleLoading = true;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, {
      prompt: 'select_account',
      ux_mode: 'popup'
    }).catch(error => {
      this.handleGoogleError(error);
    });
  }

  private navigateAfterLogin() {
    this.activatedRoute.queryParams
      .pipe(take(1))
      .subscribe(params => {
        const returnUrl = params['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl, { replaceUrl: true });
      });
  }
}