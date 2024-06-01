import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CountriesService } from './countries.service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { ICountry } from './country.interface';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent implements OnInit {

  countries: ICountry[] = [];

  searchText = new FormControl();

  constructor(private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries(): void {
    this.searchText.valueChanges
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        filter((value: string) => value.length > 2),
        switchMap((value) => this.countriesService.fetchData(value))
      )
      .subscribe(
        results => this.countries = results,
        error => console.error(error)
      );
  }
}
