import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { globalConst } from "../../global";
import { UserCredentials, UserResponse } from "../models/user-credentials.model";

@Injectable({ providedIn: "root" })
export class AuthService {
   private tokenKey = globalConst.tokenKey;
   private tokenExpiryKey = globalConst.tokenExpiryKey;

   constructor(private http: HttpClient, private router: Router) { }

   login(credentials: UserCredentials): Observable<UserResponse> {
      return this.http.post<UserResponse>(`${globalConst.userApiUrl}/login`, credentials);
   }

   createAccount(credentials: UserCredentials): Observable<UserResponse> {
      return this.http.post<UserResponse>(`${globalConst.userApiUrl}/register`, credentials);
   }

   setToken(token: string) {
      const expiry = new Date().getTime() + 1000 * 60 * 60;
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.tokenExpiryKey, expiry.toString());
   }

   isLoggedIn(): boolean {
      const token = localStorage.getItem(this.tokenKey);
      const expiry = localStorage.getItem(this.tokenExpiryKey);
      if (!token || !expiry) {
         return false;
      }

      return new Date().getTime() < +expiry;
   }

   logout() {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.tokenExpiryKey);

      this.router.navigate(["/login"]);
   }

   getToken(): string | null {
      if (this.isLoggedIn()) {
         return localStorage.getItem(this.tokenKey);
      }

      this.logout();
      return null;
   }
}
