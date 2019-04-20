// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base/base.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
// Auth
import { AuthGuard } from '../../../core/auth';
import { UsersComponent } from '../../pages/users/users.component';
import { RolesComponent } from '../../pages/roles/roles.component';
import { TestCaseComponent } from '../../pages/test-case/test-case.component';

const routes: Routes = [
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: 'app/views/pages/dashboard/dashboard.module#DashboardModule'
			},
			{
				path: 'builder',
				loadChildren: 'app/views/themes/default/content/builder/builder.module#BuilderModule'
			},
			{ path: 'users', component: UsersComponent },
			{ path: 'roles', component: RolesComponent },
			{ path: 'test-cases', component: TestCaseComponent },
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule {
}
