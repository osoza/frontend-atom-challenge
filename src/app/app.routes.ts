import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    {
        path: "login",
        loadComponent: () => import("./auth/components/login.component").then((m) => m.LoginComponent)
    },
    //   {
    //     path: 'list-form',
    //     loadComponent: () => import('./modules/list-form/list-form.component').then(m => m.ListFormComponent),
    //     canActivate: [authGuard]
    //   }
    {
        path: "home",
        loadComponent: () => import("./modules/example-page/example-page.component").then((m) => m.ExamplePageComponent)
    }
];
