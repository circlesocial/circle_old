import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadChildren: './login/login.module#LoginPageModule',
  },
  {
    path: 'tabs', 
    loadChildren: './tabs/tabs.module#TabsPageModule'
  },
  { path: 'chat-box', loadChildren: './chat-box/chat-box.module#ChatBoxPageModule' },
  {
    path: 'tab3', 
    loadChildren: './tab3/tab3.module#Tab3PageModule'
  },  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'filter', loadChildren: './filter/filter.module#FilterPageModule' },
  { path: 'event-detail', loadChildren: './event-detail/event-detail.module#EventDetailPageModule' },
  { path: 'sign-up', loadChildren: './sign-up/sign-up.module#SignUpPageModule' },
  { path: 'verification', loadChildren: './verification/verification.module#VerificationPageModule' },
  { path: 'friends', loadChildren: './friends/friends.module#FriendsPageModule' },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
