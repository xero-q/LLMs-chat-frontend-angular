import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm!: FormGroup;
  authService = inject(AuthService);

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      },
      { validators: this.passwordMismatchValidator }
    );
  }

  passwordMismatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('passwordConfirmation');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      alert('Submit');
      this.authService
        .signup(
          this.signupForm.get('username')?.value,
          this.signupForm.get('email')?.value,
          this.signupForm.get('password')?.value
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (error: any) => {
            const errorObj = error.error;
            let messages = [];

            for (const key in errorObj) {
              messages.push(`${key}: ${errorObj[key]}`);
            }

            alert(messages.join('\n'));
          },
        });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
