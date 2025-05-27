import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';
@Component({
    selector: 'app-topstrip',
    standalone: true,
    imports: [TablerIconsModule, MatButtonModule, RouterModule, MatMenuModule],
    templateUrl: './topstrip.component.html',
})
export class AppTopstripComponent {
    constructor() { }

}
