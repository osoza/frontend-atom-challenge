import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";

import { AuthService } from "../services/auth.service";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
   let component: LoginComponent;
   let fixture: ComponentFixture<LoginComponent>;
   let authServiceSpy: jasmine.SpyObj<AuthService>;
   let routerSpy: jasmine.SpyObj<Router>;
   let dialogSpy: jasmine.SpyObj<MatDialog>;
   let snackSpy: jasmine.SpyObj<MatSnackBar>;

   beforeEach(async () => {
      // Creamos spies
      const authMock = jasmine.createSpyObj("AuthService", ["login", "createAccount", "setToken", "isLoggedIn"]);
      const routerMock = jasmine.createSpyObj("Router", ["navigate"]);
      const snackBarMock = jasmine.createSpyObj("MatSnackBar", ["open"]);

      // Mock de MatDialog.open => devuelve un objeto con afterClosed()
      const dialogRefMock = { afterClosed: () => of(true) };
      const dialogMock = jasmine.createSpyObj("MatDialog", ["open"]);
      dialogMock.open.and.returnValue(dialogRefMock);

      await TestBed.configureTestingModule({
         imports: [
            LoginComponent, // componente standalone
            ReactiveFormsModule,
            MatSnackBarModule,
            BrowserAnimationsModule
         ],
         providers: [
            { provide: AuthService, useValue: authMock },
            { provide: Router, useValue: routerMock },
            { provide: MatDialog, useValue: dialogMock },
            { provide: MatSnackBar, useValue: snackBarMock }
         ]
      }).compileComponents();

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
      routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
      dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
      snackSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

      fixture.detectChanges();
   });

   it("debe crear el componente", () => {
      expect(component).toBeTruthy();
   });

   it("form inválido si email vacío", () => {
      component.loginForm.setValue({ email: "" });
      expect(component.loginForm.invalid).toBeTrue();
   });

   it("form inválido si email incorrecto", () => {
      component.loginForm.setValue({ email: "incorrecto" });
      expect(component.loginForm.invalid).toBeTrue();
   });

   it("login exitoso con token", () => {
      authServiceSpy.login.and.returnValue(of({ done: true, message: "Exito", token: "123" }));
      component.loginForm.setValue({ email: "test@example.com" });
      component.onSubmit();

      expect(authServiceSpy.setToken).toHaveBeenCalledWith("123");
      expect(routerSpy.navigate).toHaveBeenCalledWith(["/tasks"]);
   });

   it("login fallido abre dialog de crear cuenta", () => {
      authServiceSpy.login.and.returnValue(of({ done: false, message: "No encontrado" }));
      authServiceSpy.createAccount.and.returnValue(of({ done: true, token: "abc", message: "Usuario creado" }));

      component.loginForm.setValue({ email: "newuser@example.com" });
      component.onSubmit();

      expect(dialogSpy.open).toHaveBeenCalled();
      expect(authServiceSpy.createAccount).toHaveBeenCalledWith({ email: "newuser@example.com" });
      expect(authServiceSpy.setToken).toHaveBeenCalledWith("abc");
      expect(routerSpy.navigate).toHaveBeenCalledWith(["/tasks"]);
   });

   it("error en login muestra snackBar", () => {
      authServiceSpy.login.and.returnValue(throwError(() => ({ error: { message: "Error" } })));
      component.loginForm.setValue({ email: "error@example.com" });

      component.onSubmit();

      expect(snackSpy.open).toHaveBeenCalledWith("Error", "Cerrar", { duration: 3000 });
      expect(component.loading).toBeFalse();
   });
});
