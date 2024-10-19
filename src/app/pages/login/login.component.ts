import { Component } from '@angular/core';
import { LayoutService } from '../../layout/service/app.layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignInRequestModel } from '../../shared/model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'dynamic-login',
  templateUrl: './login.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
        transform:scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
    }
`]
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(public layoutService: LayoutService,private fb: FormBuilder,private auth:AuthService) {
    this.createForm();
   }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.loginForm.valid) {
      const signInRequest: SignInRequestModel = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.auth.signIn(signInRequest).subscribe(response => {
      });
    }
  }
}
