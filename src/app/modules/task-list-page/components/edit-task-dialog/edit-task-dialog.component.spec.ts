import {
   ComponentFixture, fakeAsync, TestBed, tick
} from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from "@angular/material/snack-bar";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";

import { TaskResponse } from "../../models/task-list.model";
import { TasksService } from "../../services/task-list.service";
import { EditTaskDialogComponent } from "./edit-task-dialog.component";

describe("EditTaskDialogComponent", () => {
   let component: EditTaskDialogComponent;
   let fixture: ComponentFixture<EditTaskDialogComponent>;
   let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
   let tasksServiceSpy: jasmine.SpyObj<TasksService>;
   let dialogSpy: jasmine.SpyObj<MatDialog>;

   const mockTask = { id: "1", title: "Task 1", description: "Desc 1" };

   beforeEach(async () => {
      snackBarSpy = jasmine.createSpyObj("MatSnackBar", ["open"]);
      snackBarSpy.open.and.returnValue({
         afterDismissed: () => of(null),
         onAction: () => of(null),
         dismiss: () => { }
      } as unknown as MatSnackBarRef<TextOnlySnackBar>);

      tasksServiceSpy = jasmine.createSpyObj("TasksService", ["updateTask"]);
      dialogSpy = jasmine.createSpyObj("MatDialog", ["open"]);

      await TestBed.configureTestingModule({
         imports: [EditTaskDialogComponent, NoopAnimationsModule],
         providers: [
            { provide: MatSnackBar, useValue: snackBarSpy },
            { provide: TasksService, useValue: tasksServiceSpy },
            { provide: MatDialog, useValue: dialogSpy },
            { provide: MatDialogRef, useValue: { close: jasmine.createSpy("close") } },
            { provide: MAT_DIALOG_DATA, useValue: { task: mockTask } }
         ]
      }).compileComponents();

      fixture = TestBed.createComponent(EditTaskDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it("should create", () => {
      expect(component).toBeTruthy();
   });

   it("validForm returns false if title is empty", fakeAsync(() => {
      component.taskForm.controls["title"].setValue("");
      component.taskForm.controls["description"].setValue("Desc");

      const result = component.validForm();
      tick();

      expect(result).toBeFalse();
      expect(snackBarSpy.open).toHaveBeenCalledWith(
         "Debe completar todos los campos",
         "Cerrar",
         { duration: 3000 }
      );
   }));

   it("validForm returns true for valid data", () => {
      component.taskForm.controls["title"].setValue("Title OK");
      component.taskForm.controls["description"].setValue("Desc OK");

      const result = component.validForm();
      expect(result).toBeTrue();
   });

   it("onCancel closes the dialog with false", () => {
      component.onCancel();
      expect(component.dialogRef.close).toHaveBeenCalledWith(false);
   });

   it("openConfirmDialog updates task successfully", fakeAsync(() => {
      // Mock del diálogo → devuelve true
      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<any>);

      // Mock del servicio → devuelve observable de éxito
      tasksServiceSpy.updateTask.and.returnValue(of({ done: true, message: "Ok" } as TaskResponse));

      // Rellenar formulario
      component.taskForm.controls["title"].setValue("Updated Title");
      component.taskForm.controls["description"].setValue("Updated Desc");

      // Llamar método
      component.openConfirmDialog();
      tick(); // dispara el subscribe

      expect(tasksServiceSpy.updateTask).toHaveBeenCalledWith("1", {
         title: "Updated Title",
         description: "Updated Desc"
      });
      expect(snackBarSpy.open).toHaveBeenCalledWith(
         "✅ Operación realizada con éxito",
         "Cerrar",
         { duration: 3000 }
      );
      expect(component.dialogRef.close).toHaveBeenCalledWith(true);
   }));

   it("openConfirmDialog handles error response", fakeAsync(() => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<any>);
      tasksServiceSpy.updateTask.and.returnValue(throwError(() => ({ error: { message: "Error" } })));

      component.taskForm.controls["title"].setValue("Updated Title");
      component.taskForm.controls["description"].setValue("Updated Desc");

      component.openConfirmDialog();
      tick(); // dispara el subscribe

      expect(snackBarSpy.open).toHaveBeenCalledWith(
         "Error",
         "Cerrar",
         { duration: 3000 }
      );
      expect(component.loading).toBeFalse();
   }));
});
