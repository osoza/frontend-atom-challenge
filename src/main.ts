import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { AuthInterceptor } from "./app/auth/interceptors/auth.interceptor";

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        importProvidersFrom(BrowserAnimationsModule, HttpClientModule),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ]
});
