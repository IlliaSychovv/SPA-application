import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CaptchaComponent } from '../../captcha/components/captcha.component';
import { CreateComment } from '../../../shared/models/comment.model';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { ValidationErrorComponent } from '../../../shared/components/validation-error.component';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CaptchaComponent, ValidationErrorComponent],
  template: `
    <div class="comment-form">
      <h3>Add a comment</h3>



      <form [formGroup]="commentForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name *</label>
          <input type="text"
                 id="name"
                 formControlName="name"
                 class="form-control"
                 [class]="getFieldCssClass(commentForm.get('name')!)"
                 placeholder="Enter your name (Latin letters, numbers and spaces)">

          <app-validation-error [control]="commentForm.get('name')"></app-validation-error>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input type="email"
                 id="email"
                 formControlName="email"
                 class="form-control"
                 [class]="getFieldCssClass(commentForm.get('email')!)"
                 placeholder="Enter your email">

          <app-validation-error [control]="commentForm.get('email')"></app-validation-error>
        </div>

        <div class="form-group">
          <label for="homePage">Home page</label>
          <input type="url"
                 id="homePage"
                 formControlName="homePage"
                 class="form-control"
                 [class]="getFieldCssClass(commentForm.get('homePage')!)"
                 placeholder="https://example.com">

          <app-validation-error [control]="commentForm.get('homePage')"></app-validation-error>
        </div>

        <div class="form-group">
          <label for="text">Comment *</label>

          <div class="html-toolbar">
            <button type="button"
                    class="tag-btn"
                    (click)="insertTag('i', 'italics')"
                    title="Italics">
              [i]
            </button>
            <button type="button"
                    class="tag-btn"
                    (click)="insertTag('strong', 'bold')"
                    title="Bold">
              [strong]
            </button>
            <button type="button"
                    class="tag-btn"
                    (click)="insertTag('code', 'code')"
                    title="Code">
              [code]
            </button>
            <button type="button"
                    class="tag-btn"
                    (click)="insertLink()"
                    title="Link">
              [a]
            </button>
            <button type="button"
                    class="tag-btn preview-btn"
                    (click)="togglePreview()"
                    [class.active]="showPreview"
                    title="Preview">
              Preview
            </button>
          </div>

          <textarea id="text"
                    formControlName="text"
                    rows="4"
                    class="form-control"
                    [class]="getFieldCssClass(commentForm.get('text')!)"
                    placeholder="Enter your comment"
                    [hidden]="showPreview"></textarea>

          <app-validation-error [control]="commentForm.get('text')"></app-validation-error>

          <div class="preview-content"
               [hidden]="!showPreview"
               [innerHTML]="getPreviewHtml()">
          </div>
        </div>

        <div class="form-group">
          <label for="files">Attach files (optional)</label>
          <div class="file-upload-info">
            <small class="text-muted">
              Supported formats: JPG, PNG, GIF, TXT. Maximum size for TXT: 100KB
            </small>
          </div>
          <input type="file"
                 id="files"
                 formControlName="files"
                 multiple
                 accept=".jpg,.jpeg,.png,.gif,.txt"
                 (change)="onFileSelect($event)"
                 class="form-control file-input">

          <app-validation-error [control]="commentForm.get('files')"></app-validation-error>

          <div class="selected-files" *ngIf="selectedFiles.length > 0">
            <div class="file-item" *ngFor="let file of selectedFiles; let i = index">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ (file.size / 1024).toFixed(1) }} KB</span>
              <button type="button"
                      class="remove-file-btn"
                      (click)="removeFile(i)"
                      title="Remove file">
                Delete
              </button>
            </div>
          </div>
        </div>

        <app-captcha (captchaChange)="onCaptchaChange($event)"></app-captcha>

        <app-validation-error [control]="commentForm.get('captcha')"></app-validation-error>

        <div class="form-actions">
          <button type="submit"
                  [disabled]="commentForm.invalid || isSubmitting"
                  class="btn btn-primary">
            {{ isSubmitting ? 'Sending...' : 'Send' }}
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
    .comment-form {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .comment-form h3 {
      margin-bottom: 1.5rem;
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

    .html-toolbar {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      flex-wrap: wrap;
    }

    .tag-btn {
      background: #fff;
      border: 1px solid #ced4da;
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: monospace;
    }

    .tag-btn:hover {
      background: #e9ecef;
      border-color: #adb5bd;
    }

    .tag-btn.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .preview-btn {
      margin-left: auto;
      background: #28a745;
      color: white;
      border-color: #28a745;
    }

    .preview-btn:hover {
      background: #218838;
      border-color: #1e7e34;
    }

    .preview-content {
      min-height: 100px;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      background: #f8f9fa;
      line-height: 1.6;
    }

    .preview-content i {
      font-style: italic;
    }

    .preview-content strong {
      font-weight: bold;
    }

    .preview-content code {
      background: #e9ecef;
      padding: 0.125rem 0.25rem;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.875em;
    }

    .preview-content a {
      color: #007bff;
      text-decoration: underline;
    }

    .preview-content a:hover {
      color: #0056b3;
    }

    .file-upload-info {
      margin-bottom: 0.5rem;
    }

    .file-input {
      padding: 0.5rem;
      border: 2px dashed #ced4da;
      background: #f8f9fa;
      cursor: pointer;
    }

    .file-input:hover {
      border-color: #adb5bd;
      background: #e9ecef;
    }

    .selected-files {
      margin-top: 0.5rem;
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      margin-bottom: 0.25rem;
    }

    .file-name {
      flex: 1;
      font-size: 0.875rem;
      color: #495057;
    }

    .file-size {
      font-size: 0.75rem;
      color: #6c757d;
      min-width: 60px;
      text-align: right;
    }

    .remove-file-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      font-size: 0.875rem;
      color: #dc3545;
      border-radius: 3px;
      transition: background-color 0.2s;
    }

    .remove-file-btn:hover {
      background-color: #f8d7da;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
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



    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      padding: 0.25rem 0;
    }

    .error-message div {
      margin-bottom: 0.125rem;
    }

    @media (max-width: 768px) {
      .html-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .preview-btn {
        margin-left: 0;
        margin-top: 0.5rem;
      }
    }
  `]
})
export class CommentFormComponent implements OnInit {
  @Output() commentSubmit = new EventEmitter<CreateComment>();
  @Output() cancel = new EventEmitter<void>();

  commentForm: FormGroup;

  isSubmitting = false;
  showPreview = false;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(30),
        CustomValidators.userNameFormat()
      ]],
      email: ['', [
        Validators.required,
        CustomValidators.emailFormat()
      ]],
      homePage: ['', [
        CustomValidators.urlFormat()
      ]],
      text: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2000),
        CustomValidators.htmlContent()
      ]],
      files: [[]],
      captcha: ['', [
        CustomValidators.captchaRequired()
      ]]
    });

    this.commentForm.valueChanges.subscribe(() => {
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.markAllFieldsAsTouched();

    if (this.commentForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const formValue = this.commentForm.value;
    const commentWithFiles: CreateComment = {
      name: formValue.name,
      email: formValue.email,
      homePage: formValue.homePage,
      text: formValue.text,
      captcha: formValue.captcha.input,
      captchaSessionId: formValue.captcha.sessionId,
      files: this.selectedFiles
    };

    this.commentSubmit.emit(commentWithFiles);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onCaptchaChange(captchaData: {input: string, sessionId: string}): void {
    this.commentForm.patchValue({
      captcha: captchaData
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);

      const validFiles = files.filter(file => {
        const extension = file.name.toLowerCase().split('.').pop();
        const isValidType = ['jpg', 'jpeg', 'png', 'gif', 'txt'].includes(extension || '');

        if (extension === 'txt' && file.size > 102400) { // 100KB
          alert(`File ${file.name} is too big. Max size for TXT: 100KB`);
          return false;
        }

        if (!isValidType) {
          alert(`Unsupported file type: ${file.name}`);
          return false;
        }

        return true;
      });

      this.selectedFiles = [...this.selectedFiles, ...validFiles];

      this.commentForm.patchValue({
        files: this.selectedFiles
      });
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);

    this.commentForm.patchValue({
      files: this.selectedFiles
    });
  }

  insertTag(tag: string, placeholder: string): void {
    const textarea = document.getElementById('text') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = this.commentForm.get('text')?.value || '';
    const selectedText = currentText.substring(start, end);

    let insertText: string;
    if (selectedText) {
      insertText = `<${tag}>${selectedText}</${tag}>`;
    } else {
      insertText = `<${tag}>${placeholder}</${tag}>`;
    }

    const newText = currentText.substring(0, start) +
                   insertText +
                   currentText.substring(end);

    this.commentForm.patchValue({
      text: newText
    });

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + insertText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  insertLink(): void {
    const url = prompt('Enter link URL:');
    if (!url) return;

    const text = prompt('Enter link text:', url);
    if (!text) return;

    const textarea = document.getElementById('text') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = this.commentForm.get('text')?.value || '';
    const selectedText = currentText.substring(start, end);

    let insertText: string;
    if (selectedText) {
      insertText = `<a href="${url}" title="${url}">${selectedText}</a>`;
    } else {
      insertText = `<a href="${url}" title="${url}">${text}</a>`;
    }

    const newText = currentText.substring(0, start) +
                   insertText +
                   currentText.substring(end);

    this.commentForm.patchValue({
      text: newText
    });

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + insertText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  getPreviewHtml(): string {
    const text = this.commentForm.get('text')?.value || '';
    if (!text) return '';

    let html = text;

    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html
      .replace(/&lt;(\/?)(i|strong|code)&gt;/g, '<$1$2>')
      .replace(/&lt;a\s+href="([^"]*)"\s+title="([^"]*)"&gt;/g, '<a href="$1" title="$2">')
      .replace(/&lt;(\/?)a&gt;/g, '<$1a>');

    return html;
  }

  resetForm(): void {
    this.commentForm.reset();
    this.selectedFiles = [];
    this.showPreview = false;
    this.isSubmitting = false;
  }



  getFieldCssClass(control: AbstractControl): string {
    if (control.touched && control.invalid) {
      return 'is-invalid';
    }
    return '';
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.commentForm.controls).forEach(key => {
      const control = this.commentForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }


}
