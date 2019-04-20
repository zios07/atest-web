// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Partials
import { PartialsModule } from '../partials/partials.module';
import { CoreModule } from '../../core/core.module';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { TestCaseComponent } from './test-case/test-case.component';

@NgModule({
	declarations: [UsersComponent, RolesComponent, TestCaseComponent],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		NgbModule,
		CoreModule,
		PartialsModule,
	],
	providers: []
})
export class PagesModule {
}
