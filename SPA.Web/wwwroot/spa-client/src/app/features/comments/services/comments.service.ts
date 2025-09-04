import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment, CreateComment, CommentReply, PagedResponse, CommentFilters } from '../../../shared/models/comment.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(private httpService: HttpService) {}

  getComments(filters: CommentFilters): Observable<PagedResponse<Comment>> {
    return this.httpService.get<PagedResponse<Comment>>('/comments', filters);
  }

  createComment(comment: CreateComment): Observable<Comment> {
    if (comment.files && comment.files.length > 0) {
      const formData = new FormData();
      formData.append('name', comment.name);
      formData.append('email', comment.email);
      formData.append('text', comment.text);
      formData.append('captcha', comment.captcha);
      formData.append('captchaSessionId', comment.captchaSessionId);

      if (comment.homePage) {
        formData.append('homePage', comment.homePage);
      }

      comment.files.forEach(file => {
        formData.append('files', file);
      });

      return this.httpService.postFormData<Comment>('/comments', formData);
    } else {
      return this.httpService.post<Comment>('/comments', comment);
    }
  }

  addReply(parentId: string, reply: CommentReply, files?: File[]): Observable<Comment> {
    const formData = new FormData();
    formData.append('text', reply.text);
    formData.append('name', reply.name);

    if (files) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }

    return this.httpService.postFormData<Comment>(`/comments/${parentId}/replies`, formData);
  }
}
