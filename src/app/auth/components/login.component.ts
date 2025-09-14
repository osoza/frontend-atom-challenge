import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
   FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { ConfirmCreateUserComponent } from "../dialogs/confirm-create-user.component";
import { AuthService } from "../services/auth.service";

@Component({
   selector: "app-login",
   standalone: true,
   imports: [
      CommonModule,
      ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      MatSnackBarModule,
      MatProgressSpinnerModule,
      NgOptimizedImage,
      MatDialogModule
   ],
   templateUrl: "./login.component.html",
   styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
   loginForm!: FormGroup;
   loading: boolean = false;

   constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private snackBar: MatSnackBar,
      private dialog: MatDialog
   ) {
      this.loginForm = this.fb.group({
         email: ["", [Validators.required, Validators.email]]
      });
   }

   ngOnInit() {
      if (this.authService.isLoggedIn()) {
         this.router.navigate(["/tasks"]);
      }
   }

   onSubmit() {
      if (this.loginForm.invalid) {
         return;
      }

      this.loading = true;
      const { email } = this.loginForm.value;

      this.authService.login({ email } as any).subscribe({
         next: (loginResponse: any) => {
            this.loading = false;

            if (loginResponse.done) {
               this.authService.setToken(loginResponse.token);
               this.router.navigate(["/tasks"]);
            } else {
               const dialogRef = this.dialog.open(ConfirmCreateUserComponent, { data: { email } });
               dialogRef.afterClosed().subscribe((create: any) => {
                  if (create) {
                     this.authService.createAccount({ email } as any).subscribe({
                        next: (accountResponse: any) => {
                           if (!accountResponse.done) {
                              this.snackBar.open(accountResponse.message, "Cerrar", { duration: 3000 });
                           }

                           this.authService.setToken(accountResponse.token);
                           this.router.navigate(["/tasks"]);
                        },
                        error: () => {
                           this.snackBar.open("Error al crear la cuenta", "Cerrar", { duration: 3000 });
                        }
                     });
                  }
               });
            }
         },
         error: (error: any) => {
            this.loading = false;
            this.snackBar.open(error?.error?.message || "Error al iniciar sesión", "Cerrar", { duration: 3000 });
         }
      });
   }
}
