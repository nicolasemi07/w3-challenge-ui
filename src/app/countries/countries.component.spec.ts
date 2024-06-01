import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CountriesComponent } from './countries.component';
import { Observable, of } from 'rxjs';
import { CountriesService } from './countries.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ICountry } from './country.interface';

class MockCountriesService {
  fetchData(query: string): Observable<ICountry[]> {
    return of([{ name: 'Argentina', populationNumber: 1000000, percentageOfPopulation: 10 }]);
  }
}

describe('CountriesComponent', () => {
  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;
  let countriesService: CountriesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountriesComponent],
      providers: [
        provideHttpClient(withFetch()),
        { provide: CountriesService, useClass: MockCountriesService }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CountriesComponent);
    countriesService = TestBed.inject(CountriesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCountries on init', () => {
    spyOn(component, 'getCountries');
    component.ngOnInit();
    expect(component.getCountries).toHaveBeenCalled();
  });

  it('should update countries on valid search input', fakeAsync(() => {
    spyOn(countriesService, 'fetchData').and.callThrough();
    component.searchText.setValue('TestCountry');
    tick(700);
    fixture.detectChanges();

    expect(countriesService.fetchData).toHaveBeenCalledWith('TestCountry');
    expect(component.countries.length).toBeGreaterThan(0);
    expect(component.countries[0].name).toBe('Argentina');
  }));

  it('should not call fetchData if input length is less than 3', fakeAsync(() => {
    spyOn(countriesService, 'fetchData');
    component.searchText.setValue('Te');
    tick(700);
    fixture.detectChanges();

    expect(countriesService.fetchData).not.toHaveBeenCalled();
  }));
});
