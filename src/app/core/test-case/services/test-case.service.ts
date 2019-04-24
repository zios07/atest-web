import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { TestCase } from '../model/TestCase';


const BASE_URL = environment.baseUrl;
const TEST_CASES_URL = BASE_URL + 'api/test-cases';

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {

  constructor(private http: HttpClient) { }

  createTestCase(testCase: TestCase): Observable<any> {
    return this.http.post<TestCase>(TEST_CASES_URL, testCase);
  }

}
