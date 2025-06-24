import { Component, inject, signal } from '@angular/core';
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
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { last } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm!: FormGroup;
  authService = inject(AuthService);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
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
      this.authService
        .signup(
          this.signupForm.get('username')?.value,
          this.signupForm.get('firstName')?.value,
          this.signupForm.get('lastName')?.value,
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
