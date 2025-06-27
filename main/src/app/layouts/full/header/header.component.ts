import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AuthService } from 'src/app/services/common/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
    constructor(public authService: AuthService, private router: Router ) { }

  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

 ngOnInit() {
    this.authService.identityCheck();
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
    });
  }
logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}
toggleSidenav() {
  this.toggleMobileNav.emit();
}
}