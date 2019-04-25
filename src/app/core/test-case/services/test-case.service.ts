import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { TestCase } from '../model/TestCase';


const BASE_URL = environment.baseUrl;
const TEST_CASES_URL = BASE_URL + 'api/test-cases/';

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {

  constructor(private http: HttpClient) { }

  createTestCase(testCase, path): Observable<any> {
    return this.http.post(TEST_CASES_URL + path, testCase);
  }

  getTree() {
    return this.http.get(TEST_CASES_URL + 'tree');
  }

}
