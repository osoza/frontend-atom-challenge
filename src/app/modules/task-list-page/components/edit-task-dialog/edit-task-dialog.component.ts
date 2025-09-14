import { CommonModule } from "@angular/common";
import { Component, Inject, inject } from "@angular/core";
import {
   FormBuilder,
   FormGroup,
   FormsModule,
   ReactiveFormsModule,
   Validators
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Observable, of } from "rxjs";

import { ConfirmDialogComponent } from "../../../../shared/components/confirm-dialog/confirm-dialog.component";
import { DialogResponse } from "../../../../shared/components/confirm-dialog/models/confirm-dialog.model";
import { Errors, Task, TaskResponse } from "../../models/task-list.model";
import { TasksService } from "../../services/task-list.service";

@Component({
   selector: "app-edit-task-dialog",
   standalone: true,
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatSnackBarModule,
      MatProgressSpinnerModule
   ],
   templateUrl: "./edit-task-dialog.component.html",
   styleUrls: ["./edit-task-dialog.component.scss"],
})
export class EditTaskDialogComponent {
   private dialog = inject(MatDialog);
   taskForm!: FormGroup;
   loading: boolean = false;
   errors: Errors = { title: false, description: false };

   constructor(
      public dialogRef: MatDialogRef<EditTaskDialogComponent>,
      private formBuilder: FormBuilder,
      private tasksService: TasksService,
      private snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: { task: Task }
   ) {
      this.taskForm = this.formBuilder.group({
         title: [data.task.title, [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s.,;:áéíóúÁÉÍÓÚñÑ!?()-]*$/)]],
         description: [data.task.description, [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9\s.,;:áéíóúÁÉÍÓÚñÑ!?()-]*$/)]
         ]
      });
   }

   validForm(): boolean {
      const titleControl = this.taskForm.get("title");
      const descriptionControl = this.taskForm.get("description");

      if (titleControl?.hasError("required")) {
         this.errors.title = true;
         this.snackBar.open("Debe completar todos los campos", "Cerrar", { duration: 3000 });
      } else {
         this.errors.title = false;
      }

      if (descriptionControl?.hasError("required")) {
         this.errors.description = true;
      } else {
         this.errors.description = false;
      }

      if (this.errors.title || this.errors.description) {
         this.snackBar.open("Debe completar todos los campos", "Cerrar", { duration: 3000 });
         return false;
      }

      if (titleControl?.hasError("pattern")) {
         this.errors.title = true;
         this.snackBar.open("El título posee caractéres no válidos", "Cerrar", { duration: 3000 });
         return false;
      }

      if (descriptionControl?.hasError("pattern")) {
         this.errors.description = true;
         this.snackBar.open("La descripción posee caractéres no válidos", "Cerrar", { duration: 3000 });
         return false;
      }

      this.errors.title = false;
      this.errors.description = false;
      return true;
   }

   openConfirmDialog(): void {
      if (!this.validForm()) {
         return;
      }

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
         disableClose: true,
         data: {
            title: "Está a punto de editar la tarea",
            positive: "Aceptar",
            callback: (): Observable<DialogResponse> => of({ done: true, message: "" })
         }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
         if (result) {
            this.loading = true;

            this.tasksService.updateTask(this.data.task.id!, this.taskForm.value).subscribe({
               next: (updateResponse: TaskResponse) => {
                  this.loading = false;
                  if (!updateResponse.done) {
                     this.snackBar
                        .open("❌ Hubo un error al procesar", "Cerrar", { duration: 3000 });
                     return;
                  }
                  this.snackBar.open("✅ Operación realizada con éxito", "Cerrar", { duration: 3000 });
                  this.dialogRef.close(true);
               },
               error: (error) => {
                  this.snackBar
                     .open(error?.error?.message
                        || "Error al intentar modificar la tarea", "Cerrar", { duration: 3000 });
                  this.loading = false;
               }
            });
         } else {
            this.loading = false;
         }
      });
   }

   onCancel(): void {
      this.dialogRef.close(false);
   }
}
