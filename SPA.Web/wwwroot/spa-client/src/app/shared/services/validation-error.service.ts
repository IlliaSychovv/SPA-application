import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationErrorService {

  constructor() { }

  getFormErrors(form: AbstractControl): ValidationError[] {
    const errors: ValidationError[] = [];

    if (form.errors) {
      errors.push(...this.getControlErrors('form', form.errors));
    }

    if (form instanceof AbstractControl && form.invalid) {
      this.traverseForm(form, errors);
    }

    return errors;
  }

  getControlErrors(fieldName: string, errors: ValidationErrors): ValidationError[] {
    const validationErrors: ValidationError[] = [];

    for (const errorKey in errors) {
      if (errors.hasOwnProperty(errorKey)) {
        const error = errors[errorKey];

        if (typeof error === 'object' && error.message) {
          validationErrors.push({
            field: fieldName,
            message: error.message,
            value: error.value
          });
        } else {
          const message = this.getStandardErrorMessage(errorKey, error);
          validationErrors.push({
            field: fieldName,
            message: message,
            value: error
          });
        }
      }
    }

    return validationErrors;
  }

  private getStandardErrorMessage(errorKey: string, error: any): string {
    switch (errorKey) {
      case 'required':
        return 'This field is required';
      case 'minlength':
        return `Minimum length is ${error.requiredLength} characters`;
      case 'maxlength':
        return `Maximum length is ${error.requiredLength} characters`;
      case 'pattern':
        return 'Invalid format';
      case 'email':
        return 'Please enter a valid email address';
      case 'min':
        return `Minimum value is ${error.min}`;
      case 'max':
        return `Maximum value is ${error.max}`;
      default:
        return `Validation error: ${errorKey}`;
    }
  }

  private traverseForm(control: AbstractControl, errors: ValidationError[], parentField: string = ''): void {
    if (control.invalid && control.errors) {
      const fieldName = parentField || control.parent?.get('name')?.value || 'unknown';
      errors.push(...this.getControlErrors(fieldName, control.errors));
    }

    if (control.hasOwnProperty('controls')) {
      const formGroup = control as any;
      for (const key in formGroup.controls) {
        if (formGroup.controls.hasOwnProperty(key)) {
          const childControl = formGroup.controls[key];
          const childFieldName = parentField ? `${parentField}.${key}` : key;
          this.traverseForm(childControl, errors, childFieldName);
        }
      }
    }
  }

  getFirstError(control: AbstractControl): string | null {
    if (!control.errors) return null;

    const firstErrorKey = Object.keys(control.errors)[0];
    const error = control.errors[firstErrorKey];

    if (typeof error === 'object' && error.message) {
      return error.message;
    }

    return this.getStandardErrorMessage(firstErrorKey, error);
  }

  hasError(control: AbstractControl, errorType: string): boolean {
    return control.hasError(errorType);
  }

  getFieldCssClass(control: AbstractControl, isTouched: boolean = false): string {
    if (control.touched && control.invalid) {
      return 'is-invalid';
    }

    return '';
  }

  clearErrors(form: AbstractControl): void {
    if (form.errors) {
      form.setErrors(null);
    }

    if (form.hasOwnProperty('controls')) {
      const formGroup = form as any;
      for (const key in formGroup.controls) {
        if (formGroup.controls.hasOwnProperty(key)) {
          const childControl = formGroup.controls[key];
          if (childControl.errors) {
            childControl.setErrors(null);
          }
        }
      }
    }
  }
}
