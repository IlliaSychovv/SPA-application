import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>{{ title }}</h1>
      </header>
      
      <main class="app-main">
        <router-outlet />
      </main>
      
      <footer class="app-footer">
        <p>&copy; 2024 SPA Comments System</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .app-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 300;
    }
    
    .app-main {
      flex: 1;
      padding: 2rem;
      background: #f8f9fa;
    }
    
    .app-footer {
      background: #343a40;
      color: white;
      text-align: center;
      padding: 1rem;
      margin-top: auto;
    }
  `]
})
export class App {
  protected readonly title = 'SPA Comments System';
}
