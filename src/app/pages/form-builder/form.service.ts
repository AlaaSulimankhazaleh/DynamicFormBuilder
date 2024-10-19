import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FormModel } from './model';
import { IResponseResult, ResultStatus } from '../../shared/model';
import { catchError, finalize, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  loading = signal<boolean>(false);

  constructor(private http: HttpClient, public _messageService: MessageService) { }

  Add(request: FormModel): Observable<IResponseResult<FormModel>> {
    this.loading.set(true); // Set loading to true when API call starts

    return this.http.post<IResponseResult<FormModel>>(`${this.apiUrl}/Form/Add`, request, { headers: this.headers }).pipe(
      map((response: IResponseResult<FormModel>) => {
        if (response.status == ResultStatus.Failed) {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: response?.errors?.join(",") || "Error " });
        }
        return response;
      }),
      catchError((error) => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'API call failed' });
        throw error; // Rethrow the error
      }),
      finalize(() => {
        this.loading.set(false); // Set loading to false when API call completes
      })
    );
  }

  Update(request: FormModel): Observable<IResponseResult<FormModel>> {
    this.loading.set(true); // Set loading to true when API call starts

    return this.http.post<IResponseResult<FormModel>>(`${this.apiUrl}/Form/Update`, request, { headers: this.headers }).pipe(
      map((response: IResponseResult<FormModel>) => {
        if (response.status == ResultStatus.Failed) {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: response?.errors?.join(",") || "Error " });
        }
        return response;
      }),
      catchError((error) => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'API call failed' });
        throw error; // Rethrow the error
      }),
      finalize(() => {
        this.loading.set(false); // Set loading to false when API call completes
      })
    );
  }
}
