import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICountry } from './country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  fetchData(value: string): Observable<ICountry[]> {
    return this.http.get<ICountry[]>(`${this.apiUrl}/api/countries?value=${value}`);
  }
}
