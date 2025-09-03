import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Captcha } from '../../../shared/models/comment.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  constructor(private httpService: HttpService) {}

  generateCaptcha(): Observable<Captcha> {
    return this.httpService.get<Captcha>('/captcha');
  }
} 