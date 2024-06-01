import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CountriesService } from './countries.service';
import { ICountry } from './country.interface';

describe('CountriesService', () => {
  let service: CountriesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CountriesService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CountriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data with the correct URL', () => {
    const mockCountries: ICountry[] = [
      { name: 'Argentina', populationNumber: 1000000, percentageOfPopulation: 10 },
      { name: 'Brazil', populationNumber: 2000000, percentageOfPopulation: 20 }
    ];

    const searchValue = 'TestCountry';

    service.fetchData(searchValue).subscribe((countries) => {
      expect(countries).toEqual(mockCountries);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/countries?value=${searchValue}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCountries);
  });
});
