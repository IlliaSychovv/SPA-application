import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaptchaService } from '../services/captcha.service';
import { Captcha } from '../../../shared/models/comment.model';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="captcha-container">
      <div class="captcha-image">
        <div *ngIf="!captcha?.imageBase64" class="loading">
          Loading captcha...
        </div>
        <img *ngIf="captcha?.imageBase64"
             [src]="'data:image/png;base64,' + captcha?.imageBase64"
             alt="Captcha"
             class="captcha-img">
        <button type="button"
                class="refresh-btn"
                (click)="refreshCaptcha()"
                [disabled]="isLoading">
          🔄
        </button>
      </div>

      <div class="captcha-input">
        <input type="text"
               [(ngModel)]="captchaInput"
               placeholder="Enter the code from the picture"
               maxlength="6"
               class="form-control"
               (input)="onInputChange()">
        <small class="text-muted">Enter 6 characters from the image</small>
      </div>

      <div class="debug-info" *ngIf="captcha">
        <small>Session ID: {{ captcha.sessionId }}</small>
        <small>Image loaded: {{ captcha.imageBase64 ? 'Yes' : 'No' }}</small>
        <small>Image length: {{ captcha.imageBase64.length || 0 }}</small>
      </div>
    </div>
  `,
  styles: [`
    .captcha-container {
      margin: 1rem 0;
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 4px;
      background: #f8f9fa;
    }

    .captcha-image {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .loading {
      color: #6c757d;
      font-style: italic;
      min-height: 50px;
      display: flex;
      align-items: center;
    }

    .captcha-img {
      border: 1px solid #ddd;
      border-radius: 4px;
      max-width: 150px;
      height: auto;
      background: white;
    }

    .refresh-btn {
      background: none;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.5rem;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .refresh-btn:hover:not(:disabled) {
      background-color: #f8f9fa;
    }

    .refresh-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .captcha-input input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      text-transform: uppercase;
    }

    .text-muted {
      color: #6c757d;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }

    .debug-info {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #dee2e6;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .debug-info small {
      color: #6c757d;
      font-family: monospace;
    }
  `]
})
export class CaptchaComponent implements OnInit {
  @Output() captchaChange = new EventEmitter<{input: string, sessionId: string}>();

  captcha: Captcha | null = null;
  captchaInput: string = '';
  isLoading: boolean = false;

  constructor(private captchaService: CaptchaService) {}

  ngOnInit(): void {
    console.log('CaptchaComponent initialized');
    this.loadCaptcha();
  }

  loadCaptcha(): void {
    console.log('Loading captcha...');
    this.isLoading = true;

    this.captchaService.generateCaptcha().subscribe({
      next: (captcha) => {
        console.log('Captcha received:', captcha);
        this.captcha = captcha;
        this.captchaInput = '';
        this.isLoading = false;
        this.emitCaptchaChange();
      },
      error: (error) => {
        console.error('Error loading captcha:', error);
        this.isLoading = false;
      },
      complete: () => {
        console.log('Captcha loading completed');
        this.isLoading = false;
      }
    });
  }

  refreshCaptcha(): void {
    console.log('Refreshing captcha...');
    this.loadCaptcha();
  }

  onInputChange(): void {
    this.emitCaptchaChange();
  }

  private emitCaptchaChange(): void {
    if (this.captcha) {
      const data = {
        input: this.captchaInput,
        sessionId: this.captcha.sessionId
      };
      console.log('Emitting captcha change:', data);
      this.captchaChange.emit(data);
    }
  }

  getCaptchaData(): {input: string, sessionId: string} | null {
    if (this.captcha && this.captchaInput.trim()) {
      return {
        input: this.captchaInput.trim(),
        sessionId: this.captcha.sessionId
      };
    }
    return null;
  }
}
