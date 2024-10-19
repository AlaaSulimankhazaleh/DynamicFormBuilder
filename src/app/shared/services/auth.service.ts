import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponseResult, RegisterRequestModel, RegisterResponseModel, ResultStatus, SignInRequestModel, SignInResponseModel } from '../model';
import { map, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient,public _messageService:MessageService,private _router:Router) {

  }
 signUp(request :RegisterRequestModel): Observable<IResponseResult<RegisterResponseModel>> {
    return this.http.post<IResponseResult<RegisterResponseModel>>(`${this.apiUrl}/Users/SignUp`,   request ,{ headers: this.headers }).pipe(map((response:IResponseResult<RegisterResponseModel>) => {
        if(response.status ==ResultStatus.Failed){
          this._messageService.add({ severity: 'error', summary: 'Error',  detail: response?.errors?.join(",")|| "Error " });
        }else{
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Signup successful!' });
          this._router.navigate(["/login"])
        }
        return response;
      })
    );
  }
  signIn(request :SignInRequestModel): Observable<IResponseResult<SignInResponseModel>> {
    return this.http.post<IResponseResult<SignInResponseModel>>(`${this.apiUrl}/Users/SignIn`,   request ,{ headers: this.headers }).pipe(
      map((response:IResponseResult<SignInResponseModel>) => {
        if(response.status ==ResultStatus.Failed){
          this._messageService.add({ severity: 'error', summary: 'Error',  detail: response?.errors?.join(",")|| "Error " });
        }else{
          localStorage.setItem("signInResponse", JSON.stringify(response.data));
          localStorage.setItem("token",response.data.token)
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Signup successful!' });
          this._router.navigate(["/FormBuilder"])
        }

        return response;
      })
    );
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('signInResponse');
    this._router.navigate(['/login']);
  }

  getUserInfo(): SignInResponseModel | null {
    const signInResponse = localStorage.getItem('signInResponse');
    return signInResponse ? JSON.parse(signInResponse) as SignInResponseModel : null;
  }
}
