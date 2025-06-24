import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  protected loginForm!: FormGroup;
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected isSubmitting = signal(false);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting.set(true);

      this.authService
        .login(
          this.loginForm.get('username')?.value,
          this.loginForm.get('password')?.value
        )
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.router.navigate(['/home']);
          },
          error: (error: any) => {
            this.isSubmitting.set(false);
            const messages = error.error.detail ?? error.error.error;
            let messagesString = '';
            if (Array.isArray(messages)) {
              messagesString = messages.join('\n');
            } else {
              messagesString = messages;
            }
            alert(messagesString);
          },
        });
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
