import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
	{
		path : ':id',
		component : UserComponent
	},
	{
		path : 'heroes',
		component : HeroesComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
