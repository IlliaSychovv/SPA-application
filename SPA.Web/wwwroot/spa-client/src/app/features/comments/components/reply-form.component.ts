import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentReply } from '../../../shared/models/comment.model';

@Component({
  selector: 'app-reply-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reply-form" *ngIf="isVisible">
      <div class="reply-header">
        <h4>Reply to comment "{{ parentCommentName }}"</h4>
        <button type="button"
                class="close-btn"
                (click)="onCancel()">
          ✕
        </button>
      </div>

      <form (ngSubmit)="onSubmit()" #replyForm="ngForm">
        <div class="form-group">
          <label for="replyName">Name *</label>
          <input type="text"
                 id="replyName"
                 name="replyName"
                 [(ngModel)]="reply.name"
                 required
                 class="form-control"
                 placeholder="Enter your name">
        </div>

        <div class="form-group">
          <label for="replyText">Reply *</label>
          <textarea id="replyText"
                    name="replyText"
                    [(ngModel)]="reply.text"
                    required
                    rows="3"
                    class="form-control"
                    placeholder="Enter your reply"></textarea>
        </div>

        <div class="form-group">
          <label for="replyFiles">Files (optional)</label>
          <input type="file"
                 id="replyFiles"
                 name="replyFiles"
                 (change)="onFileSelect($event)"
                 multiple
                 accept=".jpg,.jpeg,.png,.gif,.txt"
                 class="form-control">
          <small class="text-muted">
            Supported formats: JPG, PNG, GIF, TXT. Maximum size for TXT: 100KB
          </small>
        </div>

        <div class="form-actions">
          <button type="submit"
                  [disabled]="!replyForm.valid || isSubmitting"
                  class="btn btn-primary">
            {{ isSubmitting ? 'Sending...' : 'Send reply' }}
          </button>
          <button type="button"
                  (click)="onCancel()"
                  class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .reply-form {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1rem 0;
    }

    .reply-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #dee2e6;
    }

    .reply-header h4 {
      margin: 0;
      color: #333;
      font-size: 1.1rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #6c757d;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
    }

    .close-btn:hover {
      background: #e9ecef;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }

    input[type="file"].form-control {
      padding: 0.5rem;
    }

    .text-muted {
      color: #6c757d;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #545b62;
    }
  `]
})
export class ReplyFormComponent {
  @Input() isVisible: boolean = false;
  @Input() parentCommentName: string = '';
  @Output() replySubmit = new EventEmitter<{reply: CommentReply, files?: File[]}>();
  @Output() cancel = new EventEmitter<void>();

  reply: CommentReply = {
    text: '',
    name: ''
  };

  selectedFiles: File[] = [];
  isSubmitting: boolean = false;

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  onSubmit(): void {
    if (this.reply.name.trim() && this.reply.text.trim()) {
      this.isSubmitting = true;
      this.replySubmit.emit({
        reply: {...this.reply},
        files: this.selectedFiles.length > 0 ? [...this.selectedFiles] : undefined
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.reply = {
      text: '',
      name: ''
    };
    this.selectedFiles = [];
    this.isSubmitting = false;
  }
}
