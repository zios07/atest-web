import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';


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

  deleteNode(id) {
    return this.http.delete(TEST_CASES_URL + 'tree/node/' + id);
  }

  renameNode(node) {
    return this.http.put(TEST_CASES_URL + 'tree/node', node);
  }

}
