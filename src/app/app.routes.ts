import { Routes } from "@angular/router";

import { authGuard } from "./auth/guards/auth.guard";

export const routes: Routes = [
   { path: "", redirectTo: "/login", pathMatch: "full" },
   {
      path: "login",
      loadComponent: () => import("./auth/components/login.component").then((m) => m.LoginComponent)
   },
   {
      path: "tasks",
      loadComponent: () => import("./modules/task-list-page/task-list-page.component")
         .then((m) => m.TaskListPageComponent),
      canActivate: [authGuard]
   }
];
