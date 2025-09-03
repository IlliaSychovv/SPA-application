import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentItemComponent } from './comment-item.component';
import { Comment } from '../../../shared/models/comment.model';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, CommentItemComponent],
  template: `
    <div class="comments-container">
      <div class="comments-header">
        <h3>Comments ({{ comments.length }})</h3>
      </div>

      <div class="comments-list" *ngIf="comments.length > 0; else noComments">
        <div class="comment-item" *ngFor="let comment of comments">
          <app-comment-item
            [comment]="comment"
            (replyRequest)="onReplyRequest($event)">
          </app-comment-item>
        </div>
      </div>

      <ng-template #noComments>
        <div class="no-comments">
          <p>No comments yet. Be the first!</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .comments-container {
      margin-top: 2rem;
    }

    .comments-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e9ecef;
    }

    .comments-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .comment-item {
      border-left: 3px solid #007bff;
      padding-left: 1rem;
    }

    .no-comments {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .no-comments p {
      margin: 0;
      font-size: 1.1rem;
    }
  `]
})
export class CommentListComponent {
  @Input() comments: Comment[] = [];
  @Output() replyRequest = new EventEmitter<Comment>();

  onReplyRequest(comment: Comment): void {
    this.replyRequest.emit(comment);
  }
}
