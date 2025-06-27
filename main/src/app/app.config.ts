import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import {HttpClient,HttpClientModule,provideHttpClient,withInterceptorsFromDi,} from '@angular/common/http';
import { routes } from './app.routes';
import { provideRouter,withComponentInputBinding,withInMemoryScrolling,} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { JwtModule } from '@auth0/angular-jwt';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    { provide: 'baseUrl', useValue: 'https://localhost:7275/api', multi: true },
    {
      provide: "SocialAuthServiceConfig",
  useValue: {
    autoLogin: false,
     providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(
          "785983913023-c98fbq70qm7e9h2sa4ml82bhs00cl6c2.apps.googleusercontent.com",
          {
            oneTapEnabled: false, // One Tap özelliği kapatıldı
            // FedCM için gerekli olmayan parametreler kaldırıldı
            scopes: 'openid profile email' // İzinler
          }
        )
      }
    ],
    onError: err => console.error('Google auth error:', err) // Daha iyi hata loglama
  } as SocialAuthServiceConfig
    },
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule,
      HttpClientModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem("accessToken"),
          allowedDomains: ["localhost:7275"]
        }
      })
    ),
  ],
};