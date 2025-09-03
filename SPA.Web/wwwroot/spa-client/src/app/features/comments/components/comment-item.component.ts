import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment, FileInfo } from '../../../shared/models/comment.model';
import { LightboxComponent, LightboxImage } from '../../../shared/components/lightbox.component';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [CommonModule, LightboxComponent],
  template: `
    <div class="comment">
      <div class="comment-header">
        <div class="comment-author">
          <span class="author-name">{{ comment.name }}</span>
          <span class="comment-date">{{ comment.created | date:'dd.MM.yyyy HH:mm' }}</span>
        </div>
        <button class="reply-btn"
                (click)="onReplyClick()"
                type="button">
          Reply
        </button>
      </div>

      <div class="comment-content">
        <p [innerHTML]="getSafeHtml(comment.text)"></p>
      </div>

      <div class="comment-files" *ngIf="comment.files && comment.files.length > 0">
        <div class="files-header">
          <span class="files-count">{{ comment.files.length }} file(s)</span>
        </div>

        <div class="files-list">
          <div class="file-item" *ngFor="let file of comment.files; let i = index">
            <div class="file-icon">
              <span *ngIf="isImageFile(file.type)" class="image-icon">image</span>
              <span *ngIf="isTextFile(file.type)" class="text-icon">text</span>
              <span *ngIf="isGifFile(file.type)" class="gif-icon">gif</span>
            </div>
            <div class="file-info">
              <div class="file-name">{{ file.fileName }}</div>
              <div class="file-size">{{ file.sizeFormatted }}</div>
            </div>
            <div class="file-actions">
               <button *ngIf="isImageFile(file.type) || isGifFile(file.type)"
                      class="view-btn lightbox-btn"
                      (click)="openLightbox(i)"
                      type="button"
                      title="View">
                 View
              </button>
               <button *ngIf="isTextFile(file.type)"
                      class="view-btn"
                      (click)="viewTextFile(file)"
                      type="button"
                      title="View">
                 View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="comment-replies" *ngIf="comment.replies && comment.replies.length > 0">
        <div class="replies-header">
          <span class="replies-count">{{ comment.replies.length }} replies</span>
        </div>

        <div class="reply-item" *ngFor="let reply of comment.replies">
          <app-comment-item
            [comment]="reply"
            (replyRequest)="onReplyRequest($event)"
            class="nested-reply">
          </app-comment-item>
        </div>
      </div>

      <app-lightbox
        *ngIf="isLightboxVisible"
        [images]="getLightboxImages()"
        [startIndex]="currentLightboxIndex"
        (closeEvent)="closeLightbox()">
      </app-lightbox>
    </div>
  `,
  styles: [`
    .comment {
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .comment-author {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .author-name {
      font-weight: 600;
      color: #333;
      font-size: 1.1rem;
    }

    .comment-date {
      color: #6c757d;
      font-size: 0.875rem;
    }

    .reply-btn {
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .reply-btn:hover {
      background: #0056b3;
    }

    .comment-content {
      margin-bottom: 1rem;
    }

    .comment-content p {
      margin: 0;
      line-height: 1.6;
      color: #333;
    }

    .comment-files {
      margin: 1rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      border: 1px solid #e9ecef;
    }

    .files-header {
      margin-bottom: 0.75rem;
    }

    .files-count {
      color: #6c757d;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .files-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: white;
      border-radius: 4px;
      border: 1px solid #dee2e6;
    }

    .file-icon {
      font-size: 1.5rem;
    }

    .file-info {
      flex: 1;
    }

    .file-name {
      font-weight: 500;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .file-size {
      color: #6c757d;
      font-size: 0.875rem;
    }

    .file-actions {
      display: flex;
      gap: 0.5rem;
    }

    .view-btn {
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 1rem;
    }

    .view-btn:hover {
      background: #218838;
    }

    .lightbox-btn {
      background: #17a2b8;
    }

    .lightbox-btn:hover {
      background: #138496;
    }

    .comment-replies {
      margin-top: 1rem;
      padding-left: 2rem;
      border-left: 3px solid #e9ecef;
    }

    .replies-header {
      margin-bottom: 1rem;
    }

    .replies-count {
      color: #6c757d;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .reply-item {
      margin-bottom: 1rem;
    }

    .nested-reply {
      margin-left: 1rem;
      border-left: 2px solid #dee2e6;
      padding-left: 1rem;
    }

    .nested-reply .comment {
      margin-bottom: 0.5rem;
      padding: 1rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
    }

    .nested-reply .nested-reply {
      margin-left: 0.5rem;
      border-left: 1px solid #dee2e6;
      padding-left: 0.5rem;
    }

    @media (max-width: 768px) {
      .comment-replies {
        padding-left: 1rem;
      }

      .nested-reply {
        margin-left: 0.5rem;
        padding-left: 0.5rem;
      }
    }
  `]
})
export class CommentItemComponent {
  @Input() comment!: Comment;
  @Output() replyRequest = new EventEmitter<Comment>();

  currentLightboxIndex = 0;
  currentLightboxImages: LightboxImage[] = [];
  isLightboxVisible = false;

  onReplyClick(): void {
    this.replyRequest.emit(this.comment);
  }

  onReplyRequest(comment: Comment): void {
    this.replyRequest.emit(comment);
  }

  openLightbox(index: number): void {
    this.currentLightboxImages = this.comment.files
      .filter(file => this.isImageFile(file.type) || this.isGifFile(file.type))
      .map(file => ({
        src: this.getFileUrl(file.path),
        title: file.fileName,
        alt: file.fileName
      }));

    this.currentLightboxIndex = index;
    this.isLightboxVisible = true;
  }

  closeLightbox(): void {
    this.isLightboxVisible = false;
    this.currentLightboxImages = [];
    this.currentLightboxIndex = 0;
  }

  getLightboxImages(): LightboxImage[] {
    return this.currentLightboxImages;
  }

  isImageFile(type: string): boolean {
    return ['jpg', 'jpeg', 'png'].includes(type.toLowerCase());
  }

  isGifFile(type: string): boolean {
    return type.toLowerCase() === 'gif';
  }

  isTextFile(type: string): boolean {
    return type.toLowerCase() === 'txt';
  }

  getFileUrl(path: string): string {
    const apiBaseUrl = 'http://localhost:5160';

    if (path.startsWith('uploads/')) {
      return `${apiBaseUrl}/${path}`;
    }

    const fileName = path.split('/').pop() || path.split('\\').pop() || path;
    const extension = fileName.toLowerCase().split('.').pop();

    let finalUrl = '';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      finalUrl = `${apiBaseUrl}/uploads/images/${encodeURIComponent(fileName)}`;
    } else if (extension === 'txt') {
      finalUrl = `${apiBaseUrl}/uploads/texts/${encodeURIComponent(fileName)}`;
    } else {
      finalUrl = `${apiBaseUrl}/uploads/${encodeURIComponent(fileName)}`;
    }

    return finalUrl;
  }

  viewTextFile(file: FileInfo): void {
    const url = this.getFileUrl(file.path);
    window.open(url, '_blank');
  }

  getSafeHtml(html: string): string {
    return html;
  }
}
