import { Component, inject } from '@angular/core';
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
  loginForm!: FormGroup;
  authService = inject(AuthService);

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService
        .login(
          this.loginForm.get('username')?.value,
          this.loginForm.get('password')?.value
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/home']);
          },
          error: (error: any) => {
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
