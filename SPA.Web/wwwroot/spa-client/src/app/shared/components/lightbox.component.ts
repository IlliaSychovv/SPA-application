import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LightboxImage {
  src: string;
  title: string;
  alt?: string;
}

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lightbox-overlay" 
         [class.visible]="isVisible"
         (click)="close()">
      
      <!-- Спиннер загрузки -->
      <div class="loading-spinner" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
      
      <!-- Контент -->
      <div class="lightbox-content" 
           *ngIf="!isLoading && currentImage"
           (click)="$event.stopPropagation()">
        
        <!-- Изображение -->
        <img *ngIf="isImageFile(currentImage.src)"
             [src]="currentImage.src" 
             [alt]="currentImage.alt || currentImage.title"
             (load)="onImageLoad()"
             (error)="onImageError()"
             class="lightbox-image"
             style="max-width: 100%; max-height: 80vh; object-fit: contain;">
        
        <!-- Текстовый файл -->
        <div *ngIf="isTextFile(currentImage.src)" class="text-content">
          <h3>{{ currentImage.title }}</h3>
          <div class="text-content-body">
            <p>Текстовый файл загружается...</p>
          </div>
        </div>
        
        <!-- Навигация -->
        <div class="lightbox-nav" *ngIf="images.length > 1">
          <button class="nav-btn prev-btn" 
                  (click)="previous()" 
                  [disabled]="currentIndex === 0">
            ‹
          </button>
          
          <span class="counter">
            {{ currentIndex + 1 }} / {{ images.length }}
          </span>
          
          <button class="nav-btn next-btn" 
                  (click)="next()" 
                  [disabled]="currentIndex === images.length - 1">
            ›
          </button>
        </div>
        
        <!-- Кнопка закрытия -->
        <button class="close-btn" (click)="close()">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .lightbox-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .lightbox-overlay.visible {
      opacity: 1;
      visibility: visible;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .lightbox-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideIn {
      from { 
        opacity: 0; 
        transform: scale(0.8) translateY(20px); 
      }
      to { 
        opacity: 1; 
        transform: scale(1) translateY(0); 
      }
    }

    .lightbox-image {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      transition: transform 0.3s ease;
    }

    .lightbox-image:hover {
      transform: scale(1.02);
    }

    .lightbox-nav {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      pointer-events: none;
    }

    .nav-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 2rem;
      padding: 1rem;
      border-radius: 50%;
      cursor: pointer;
      pointer-events: auto;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
    }

    .nav-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .nav-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .counter {
      color: white;
      font-size: 1.1rem;
      font-weight: 500;
      background: rgba(0, 0, 0, 0.5);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      pointer-events: auto;
      backdrop-filter: blur(10px);
    }

    .close-btn {
      position: absolute;
      top: -50px;
      right: 0;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 1.5rem;
      padding: 0.5rem;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .text-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .text-content h3 {
      margin-top: 0;
      color: #333;
    }

    .text-content-body p {
      font-size: 1.2rem;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .lightbox-nav {
        padding: 0 1rem;
      }
      
      .nav-btn {
        font-size: 1.5rem;
        padding: 0.75rem;
      }
    }
  `]
})
export class LightboxComponent implements OnInit {
  @Input() images: LightboxImage[] = [];
  @Input() startIndex: number = 0;
  @Output() closeEvent = new EventEmitter<void>();

  isVisible = false;
  isLoading = true;
  currentIndex = 0;
  currentImage: LightboxImage | null = null;
  private loadTimeout: any;

  ngOnInit(): void {
    if (this.images.length > 0) {
      this.currentIndex = this.startIndex;
      this.currentImage = this.images[this.currentIndex];
      this.open();
    }
  }

  open(): void {
    this.isVisible = true;
    this.isLoading = true;
    
    // Автоматически скрываем спиннер через 5 секунд
    this.loadTimeout = setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }

  close(): void {
    this.isVisible = false;
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }
    this.closeEvent.emit();
  }

  next(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.currentImage = this.images[this.currentIndex];
      this.isLoading = true;
      
      // Сбрасываем таймаут для нового изображения
      if (this.loadTimeout) {
        clearTimeout(this.loadTimeout);
      }
      this.loadTimeout = setTimeout(() => {
        this.isLoading = false;
      }, 5000);
    }
  }

  previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentImage = this.images[this.currentIndex];
      this.isLoading = true;
      
      // Сбрасываем таймаут для предыдущего изображения
      if (this.loadTimeout) {
        clearTimeout(this.loadTimeout);
      }
      this.loadTimeout = setTimeout(() => {
        this.isLoading = false;
      }, 5000);
    }
  }

  onImageLoad(): void {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }
    this.isLoading = false;
  }

  onImageError(): void {
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }
    this.isLoading = false;
  }

  isImageFile(src: string): boolean {
    const extension = src.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension || '');
  }

  isTextFile(src: string): boolean {
    const extension = src.toLowerCase().split('.').pop();
    return extension === 'txt';
  }
} 