import { Routes } from '@angular/router';
import { CommentsPageComponent } from './features/comments/components/comments-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/comments', pathMatch: 'full' },
  { path: 'comments', component: CommentsPageComponent },
  { path: '**', redirectTo: '/comments' }
];
