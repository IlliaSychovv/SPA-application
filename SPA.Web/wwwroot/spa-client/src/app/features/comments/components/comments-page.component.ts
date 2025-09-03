import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentFormComponent } from './comment-form.component';
import { CommentListComponent } from './comment-list.component';
import { ReplyFormComponent } from './reply-form.component';
import { CommentsService } from '../services/comments.service';
import { Comment, CreateComment, CommentReply, CommentFilters } from '../../../shared/models/comment.model';

@Component({
  selector: 'app-comments-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentFormComponent, CommentListComponent, ReplyFormComponent],
  template: `
    <div class="comments-page">
      <div class="page-header">
        <h1>Comment system</h1>
        <p>Add and reply to comments</p>
      </div>

      <app-comment-form
        (commentSubmit)="onCommentSubmit($event)"
        (cancel)="onCommentCancel()">
      </app-comment-form>

      <div class="filters-section">
        <h3>Filters and sorting</h3>
        <div class="filters-form">
          <div class="filter-group">
            <label for="filterName">By name:</label>
            <input type="text"
                   id="filterName"
                   [(ngModel)]="filters.filterByName"
                   placeholder="Enter name"
                   class="form-control">
          </div>

          <div class="filter-group">
            <label for="filterDate">By date:</label>
            <input type="date"
                   id="filterDate"
                   [(ngModel)]="filters.filterByDate"
                   class="form-control">
          </div>

          <div class="filter-group">
            <label for="sortBy">Sorting:</label>
            <select id="sortBy" [(ngModel)]="filters.sortBy" class="form-control">
              <option value="Created">By date</option>
              <option value="Name">By name</option>
              <option value="Email">By email</option>
            </select>
          </div>

          <div class="filter-group">
            <label>
              <input type="checkbox"
                     [(ngModel)]="filters.isDescending">
              Descending
            </label>
          </div>

          <button type="button"
                  (click)="applyFilters()"
                  class="btn btn-primary">
            Apply filters
          </button>
        </div>
      </div>

      <app-comment-list
        [comments]="comments"
        (replyRequest)="onReplyRequest($event)">
      </app-comment-list>

      <div class="pagination" *ngIf="totalPages > 1">
        <button type="button"
                [disabled]="currentPage === 1"
                (click)="goToPage(currentPage - 1)"
                class="btn btn-secondary">
          ← Previous
        </button>

        <span class="page-info">
          Page {{ currentPage }} from {{ totalPages }}
        </span>

        <button type="button"
                [disabled]="currentPage === totalPages"
                (click)="goToPage(currentPage + 1)"
                class="btn btn-secondary">
          Next →
        </button>
      </div>

      <app-reply-form
        [isVisible]="showReplyForm"
        [parentCommentName]="selectedComment?.name || ''"
        (replySubmit)="onReplySubmit($event)"
        (cancel)="onReplyCancel()">
      </app-reply-form>
    </div>
  `,
  styles: [`
    .comments-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-header h1 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .page-header p {
      color: #6c757d;
      font-size: 1.1rem;
      margin: 0;
    }

    .filters-section {
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .filters-section h3 {
      margin-bottom: 1rem;
      color: #333;
    }

    .filters-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 500;
      color: #555;
    }

    .form-control {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
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

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin: 2rem 0;
      padding: 1rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .page-info {
      color: #6c757d;
      font-weight: 500;
      min-width: 120px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .comments-page {
        padding: 1rem;
      }

      .filters-form {
        grid-template-columns: 1fr;
      }

      .pagination {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class CommentsPageComponent implements OnInit {
  comments: Comment[] = [];
  currentPage: number = 1;
  pageSize: number = 25;
  totalPages: number = 1;
  totalCount: number = 0;

  showReplyForm: boolean = false;
  selectedComment: Comment | null = null;

  filters: CommentFilters = {
    pageNumber: 1,
    pageSize: 25,
    sortBy: 'Created',
    isDescending: true
  };

  constructor(private commentsService: CommentsService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.filters.pageNumber = this.currentPage;
    this.filters.pageSize = this.pageSize;

    this.commentsService.getComments(this.filters).subscribe({
      next: (response) => {
        this.comments = response.items;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
      }
    });
  }

  onCommentSubmit(comment: CreateComment): void {
    this.commentsService.createComment(comment).subscribe({
      next: (newComment) => {
        this.loadComments();
        const commentForm = document.querySelector('app-comment-form') as any;
        if (commentForm && commentForm.resetForm) {
          commentForm.resetForm();
        }
      },
      error: (error) => {
        console.error('Error creating comment:', error);
        alert('Error creating comment. Try again.');
      },
      complete: () => {
        const commentForm = document.querySelector('app-comment-form') as any;
        if (commentForm) {
          commentForm.isSubmitting = false;
        }
      }
    });
  }

  onCommentCancel(): void {}

  onReplyRequest(comment: Comment): void {
    this.selectedComment = comment;
    this.showReplyForm = true;

    setTimeout(() => {
      const replyForm = document.querySelector('app-reply-form');
      if (replyForm) {
        replyForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  onReplySubmit(data: {reply: CommentReply, files?: File[]}): void {
    if (this.selectedComment) {
      this.commentsService.addReply(this.selectedComment.id, data.reply, data.files).subscribe({
        next: (newReply) => {
          this.loadComments();
          this.showReplyForm = false;
          this.selectedComment = null;
        },
        error: (error) => {
          console.error('Error creating response:', error);
          alert('Error creating answer. Try again.');
        }
      });
    }
  }

  onReplyCancel(): void {
    this.showReplyForm = false;
    this.selectedComment = null;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadComments();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadComments();
    }
  }
}
