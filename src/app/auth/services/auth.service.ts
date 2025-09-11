import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { map, Observable } from "rxjs";
import { Observable } from "rxjs";

import { UserCredentials } from "../models/user-credentials.model";

@Injectable({ providedIn: "root" })
export class AuthService {
    private apiUrl = "http://localhost:3000/api";
    private tokenKey = "auth_token";
    private tokenExpiryKey = "auth_token_expiry";

    constructor(private http: HttpClient) { }

    // login(credentials: UserCredentials): Observable<string> {
    //     return this.http.post<{ token: string }>(`${this.apiUrl}/users/login`, credentials)
    //         .pipe(map((res) => res.token));
    // }

    login(credentials: UserCredentials): Observable<{ done: boolean; message: string; token?: string; user?: any }> {
        return this.http.post<{ done: boolean; message: string; token?: string; user?: any }>(
            `${this.apiUrl}/users/login`,
            credentials
        );
    }

    createUser(credentials: UserCredentials): Observable<any> {
        return this.http.post(`${this.apiUrl}/users/register`, credentials);
    }

    setToken(token: string) {
        const expiry = new Date().getTime() + 1000 * 60 * 60; // 1 hora
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.tokenExpiryKey, expiry.toString());
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem(this.tokenKey);
        const expiry = localStorage.getItem(this.tokenExpiryKey);
        if (!token || !expiry) return false;
        return new Date().getTime() < +expiry;
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.tokenExpiryKey);
    }

    getToken(): string | null {
        if (this.isLoggedIn()) return localStorage.getItem(this.tokenKey);
        this.logout();
        return null;
    }
}
