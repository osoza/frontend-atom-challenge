import {
   ComponentFixture, fakeAsync, TestBed, tick
} from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";

import { ConfirmDialogComponent } from "./confirm-dialog.component";
import { DialogResponse } from "./models/confirm-dialog.model";

describe("ConfirmDialogComponent", () => {
   let component: ConfirmDialogComponent;
   let fixture: ComponentFixture<ConfirmDialogComponent>;
   let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
   let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

   beforeEach(async () => {
      dialogRefSpy = jasmine.createSpyObj("MatDialogRef", ["close"]);
      snackBarSpy = jasmine.createSpyObj("MatSnackBar", ["open"]);
      snackBarSpy.open.and.returnValue({
         afterDismissed: () => of(null),
         onAction: () => of(null),
         dismiss: () => { }
      } as unknown as MatSnackBarRef<TextOnlySnackBar>);

      await TestBed.configureTestingModule({
         imports: [ConfirmDialogComponent],
         providers: [
            { provide: MatDialogRef, useValue: dialogRefSpy },
            { provide: MatSnackBar, useValue: snackBarSpy },
            {
               provide: MAT_DIALOG_DATA,
               useValue: {
                  title: "Confirmar",
                  positive: "Aceptar",
                  showLoading: false,
                  callback: () => of({ done: true, message: "Ok" })
               }
            }
         ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it("should create", () => {
      expect(component).toBeTruthy();
   });

   it("onCancel closes the dialog with false", () => {
      component.onCancel();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
   });

   it("onAccept closes dialog immediately if showLoading is false", () => {
      component.data.showLoading = false;
      component.onAccept();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
   });

   it("onAccept calls callback and closes dialog on success", fakeAsync(() => {
      component.data.showLoading = true;
      component.data.callback = () => ({
         done: true,
         message: "Success"
      } as DialogResponse);

      component.onAccept();
      tick();

      expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
      expect(component.loading).toBeTrue(); // loading se mantiene hasta cerrar
   }));

   it("onAccept calls callback and shows snackBar on failure", fakeAsync(() => {
      component.data.showLoading = true;
      component.data.callback = () => ({
         done: false,
         message: "Error ocurridos"
      } as DialogResponse);

      component.onAccept();
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
         "Error ocurrido",
         "Cerrar",
         { duration: 3000 }
      );
      expect(component.loading).toBeFalse();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
   }));
});
