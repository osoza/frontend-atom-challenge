import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    {
        path: "home",
        loadComponent: () => import("./modules/example-page/example-page.component").then((m) => m.ExamplePageComponent)

    }
];
