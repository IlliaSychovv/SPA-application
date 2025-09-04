import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static userNameFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const userNamePattern = /^[a-zA-Z0-9\s]+$/;
      const isValid = userNamePattern.test(control.value);

      return isValid ? null : {
        userNameFormat: {
          value: control.value,
          message: 'Name must contain only Latin letters, numbers and spaces'
        }
      };
    };
  }

  static emailFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValid = emailPattern.test(control.value);

      return isValid ? null : {
        emailFormat: {
          value: control.value,
          message: 'Please enter a valid email address'
        }
      };
    };
  }

  static urlFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      try {
        const url = new URL(control.value);
        const isValid = url.protocol === 'http:' || url.protocol === 'https:';

        return isValid ? null : {
          urlFormat: {
            value: control.value,
            message: 'Please enter a valid URL starting with http:// or https://'
          }
        };
      } catch {
        return {
          urlFormat: {
            value: control.value,
            message: 'Please enter a valid URL'
          }
        };
      }
    };
  }

  static htmlContent(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const html = control.value as string;

      const dangerousPatterns = [
        /<script[^>]*>/gi,
        /<iframe[^>]*>/gi,
        /<object[^>]*>/gi,
        /<embed[^>]*>/gi,
        /<form[^>]*>/gi,
        /<input[^>]*>/gi,
        /<button[^>]*>/gi,
        /<select[^>]*>/gi,
        /<textarea[^>]*>/gi,
        /on\w+\s*=/gi,
        /javascript:/gi,
        /data:/gi
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(html)) {
          return {
            htmlContent: {
              value: control.value,
              message: 'HTML contains forbidden tags or attributes'
            }
          };
        }
      }

      const allowedTags = ['a', 'code', 'i', 'strong'];
      const tagPattern = /<(\/?)([a-zA-Z]+)([^>]*)>/g;
      const tags: Array<{tag: string, isClosing: boolean, attributes: string}> = [];

      let match;
      while ((match = tagPattern.exec(html)) !== null) {
        const isClosing = match[1] === '/';
        const tagName = match[2].toLowerCase();
        const attributes = match[3];

        if (!allowedTags.includes(tagName)) {
          return {
            htmlContent: {
              value: control.value,
              message: `Tag <${tagName}> is not allowed. Only <a>, <code>, <i>, <strong> are permitted.`
            }
          };
        }

        if (tagName === 'a' && !isClosing) {
          const hrefMatch = attributes.match(/href\s*=\s*["']([^"']*)["']/i);
          if (hrefMatch) {
            const href = hrefMatch[1];
            if (href.startsWith('javascript:') || href.startsWith('data:')) {
              return {
                htmlContent: {
                  value: control.value,
                  message: 'JavaScript and data URLs are not allowed in href attributes'
                }
              };
            }
          }
        }

        tags.push({ tag: tagName, isClosing, attributes });
      }

      const openTags: string[] = [];
      for (const tag of tags) {
        if (tag.isClosing) {
          if (openTags.length === 0 || openTags.pop() !== tag.tag) {
            return {
              htmlContent: {
                value: control.value,
                message: `Unmatched closing tag </${tag.tag}>`
              }
            };
          }
        } else {
          if (tag.attributes.trim().endsWith('/')) {
            continue;
          }
          openTags.push(tag.tag);
        }
      }

      if (openTags.length > 0) {
        return {
          htmlContent: {
            value: control.value,
            message: `Unclosed tags: ${openTags.join(', ')}`
          }
        };
      }

      return null;
    };
  }

  static fileSize(maxSizeBytes: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !control.value.length) return null;

      const files = Array.from(control.value) as File[];
      for (const file of files) {
        if (file.size > maxSizeBytes) {
          const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(2);
          return {
            fileSize: {
              value: file.name,
              message: `File ${file.name} is too large. Maximum size is ${maxSizeMB} MB`
            }
          };
        }
      }

      return null;
    };
  }

  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !control.value.length) return null;

      const files = Array.from(control.value) as File[];
      for (const file of files) {
        const extension = file.name.toLowerCase().split('.').pop();
        if (!extension || !allowedTypes.includes(extension)) {
          return {
            fileType: {
              value: file.name,
              message: `File type .${extension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
            }
          };
        }
      }

      return null;
    };
  }

  static captchaRequired(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const captcha = control.value as { input: string; sessionId: string };

      if (!captcha.input || !captcha.input.trim()) {
        return {
          captchaRequired: {
            message: 'Please enter the CAPTCHA code'
          }
        };
      }

      if (!captcha.sessionId) {
        return {
          captchaRequired: {
            message: 'CAPTCHA session expired. Please refresh and try again'
          }
        };
      }

      if (captcha.input.length !== 6) {
        return {
          captchaRequired: {
            message: 'CAPTCHA code must be 6 characters long'
          }
        };
      }

      return null;
    };
  }
}
