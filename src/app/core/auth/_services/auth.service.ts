import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Account } from '../_models/account';
import { UserAuth } from '../_models/user';

const BASE_URL = environment.baseUrl;
const API_USERS_URL = BASE_URL + 'api/users';
const API_PERMISSION_URL = BASE_URL + 'api/permissions';
const API_ROLES_URL = BASE_URL + 'api/roles';
const API_LOGIN_URL = BASE_URL + "api/v1/authentication/authenticate";
const API_REGISTRATION_URL = BASE_URL + "api/users/register";

@Injectable()
export class AuthService {


    constructor(private http: HttpClient) { }

    // Authentication/Authorization
    login(username: string, password: string) {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let account = new Account();
        account.username = username;
        account.password = password;
        return this.http.post(API_LOGIN_URL, account, { headers, responseType: 'text' as 'json' });
    }

    getUserByToken(): Observable<User> {
        const userToken = localStorage.getItem(environment.authTokenKey);
        const httpHeaders = new HttpHeaders();
        httpHeaders.append('Authorization', 'Bearer ' + userToken);
        return this.http.get<User>(API_USERS_URL, { headers: httpHeaders });
    }

    register(user: UserAuth): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<UserAuth>(API_REGISTRATION_URL, user, { headers: httpHeaders });
    }

    /*
     * Submit forgot password request
     *
     * @param {string} email
     * @returns {Observable<any>}
     */
    public requestPassword(email: string): Observable<any> {
        return this.http.get(API_USERS_URL + '/forgot?=' + email)
            .pipe(catchError(this.handleError('forgot-password', []))
            );
    }


    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(API_USERS_URL);
    }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(API_USERS_URL + `/${userId}`);
    }

    getConnectedUser(): Observable<UserAuth> {
        return this.http.get<UserAuth>(API_USERS_URL + '/find/connected');
    }

    // DELETE => delete the user from the server
    deleteUser(userId: number) {
        const url = `${API_USERS_URL}/${userId}`;
        return this.http.delete(url);
    }

    // UPDATE => PUT: update the user on the server
    updateUser(_user: User): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.put(API_USERS_URL, _user, { headers: httpHeaders });
    }

    // UPDATE_PROFILE => PUT: update the user profile on the server
    updateProfile(profile): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.put(API_USERS_URL + '/profile', profile, { headers: httpHeaders });
    }


    // CREATE =>  POST: add a new user to the server
    createUser(user: User): Observable<User> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders });
    }

    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
    // items => filtered/sorted result
    findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<QueryResultsModel>(API_USERS_URL + '/findUsers', queryParams, { headers: httpHeaders });
    }

    // Permission
    getAllPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(API_PERMISSION_URL);
    }

    getRolePermissions(roleId: number): Observable<Permission[]> {
        return this.http.get<Permission[]>(API_PERMISSION_URL + '/getRolePermission?=' + roleId);
    }

    // Roles
    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(API_ROLES_URL);
    }

    getRoleById(roleId: number): Observable<Role> {
        return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
    }

    // CREATE =>  POST: add a new role to the server
    createRole(role: Role): Observable<Role> {
        // Note: Add headers if needed (tokens/bearer)
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<Role>(API_ROLES_URL, role, { headers: httpHeaders });
    }

    // UPDATE => PUT: update the role on the server
    updateRole(role: Role): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
    }

    // DELETE => delete the role from the server
    deleteRole(roleId: number): Observable<Role> {
        const url = `${API_ROLES_URL}/${roleId}`;
        return this.http.delete<Role>(url);
    }

    // Check Role Before deletion
    isRoleAssignedToUsers(roleId: number): Observable<boolean> {
        return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?roleId=' + roleId);
    }

    findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<QueryResultsModel>(API_ROLES_URL + '/findRoles', queryParams, { headers: httpHeaders });
    }

    getToken() {
        return localStorage.getItem('token');
    }

    /*
     * Handle Http operation that failed.
     * Let the app continue.
   *
   * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }
}
