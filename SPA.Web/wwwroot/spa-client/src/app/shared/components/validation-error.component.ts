import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-message" *ngIf="control?.invalid && control?.touched">
      <div *ngIf="control?.errors?.['required']">This field is required</div>
      <div *ngIf="control?.errors?.['minlength']">Minimum length is {{ control?.errors?.['minlength']?.requiredLength }} characters</div>
      <div *ngIf="control?.errors?.['maxlength']">Maximum length is {{ control?.errors?.['maxlength']?.requiredLength }} characters</div>
      <div *ngIf="control?.errors?.['email']">Please enter a valid email address</div>
      <div *ngIf="control?.errors?.['pattern']">Invalid format</div>
      <div *ngIf="control?.errors?.['userNameFormat']">{{ control?.errors?.['userNameFormat']?.message }}</div>
      <div *ngIf="control?.errors?.['emailFormat']">{{ control?.errors?.['emailFormat']?.message }}</div>
      <div *ngIf="control?.errors?.['urlFormat']">{{ control?.errors?.['urlFormat']?.message }}</div>
      <div *ngIf="control?.errors?.['htmlContent']">{{ control?.errors?.['htmlContent']?.message }}</div>
      <div *ngIf="control?.errors?.['fileType']">{{ control?.errors?.['fileType']?.message }}</div>
      <div *ngIf="control?.errors?.['fileSize']">{{ control?.errors?.['fileSize']?.message }}</div>
      <div *ngIf="control?.errors?.['captchaRequired']">{{ control?.errors?.['captchaRequired']?.message }}</div>
    </div>
  `,
  styles: [`
    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      padding: 0.25rem 0;
    }

    .error-message div {
      margin-bottom: 0.125rem;
    }

    .error-message div:last-child {
      margin-bottom: 0;
    }
  `]
})
export class ValidationErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() showErrors: boolean = false;
} 