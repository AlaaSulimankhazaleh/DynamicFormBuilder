import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../layout/service/app.layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { RegisterRequestModel } from '../../shared/model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
        transform:scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
    }
`]
})
export class SignUpComponent implements OnInit{
  signUpForm!: FormGroup;
  constructor(public layoutService: LayoutService,private fb: FormBuilder,private auth:AuthService) { }


ngOnInit(): void {
  this.signUpForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, { validator: this.passwordMatchValidator });
}

passwordMatchValidator(form: FormGroup) {
  return form.get('password')?.value === form.get('confirmPassword')?.value
    ? null : { mismatch: true };
}

onSubmit() {
  if (this.signUpForm.valid) {
    const registerRequest: RegisterRequestModel = {
      email: this.signUpForm.get('email')?.value,
      password: this.signUpForm.get('password')?.value,
      confirmPassword: this.signUpForm.get('confirmPassword')?.value,
      createdBy: this.signUpForm.get('username')?.value // Assuming this field represents the creator
    };

    this.auth.signUp(registerRequest).subscribe(
      response => {
        console.log('Sign up successful:', response);
        // Handle successful sign-up (e.g., redirect or show a success message)
      },
      error => {
        console.error('Sign up failed:', error);
        // Handle error (e.g., show an error message)
      }
    );
  }
}
}

