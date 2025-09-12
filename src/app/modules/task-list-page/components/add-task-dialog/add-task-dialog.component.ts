import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { AddTask, TaskResponse } from "../../models/task-list.model";
import { TasksService } from "../../services/task-list.service";

@Component({
    selector: "app-add-task-dialog",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: "./add-task-dialog.component.html",
    styleUrls: ["./add-task-dialog.component.scss"],
})
export class AddTaskDialogComponent {
    taskForm!: FormGroup;
    loading = false;

    constructor(
        public dialogRef: MatDialogRef<AddTaskDialogComponent>,
        private formBuilder: FormBuilder,
        private tasksService: TasksService,
        private snackBar: MatSnackBar
    ) {
        this.taskForm = this.formBuilder.group({
            title: [null, [Validators.required]],
            description: [null, [Validators.required]],
            createdAt: [new Date()],
            completed: [false]
        });
    }

    onSave(): void {
        if (this.taskForm.invalid) {
            this.snackBar.open("Debe completar todos los campos", "Cerrar", { duration: 3000 });
            return;
        }

        this.loading = true;

        this.tasksService.addTask(this.taskForm.value as AddTask).subscribe({
            next: (addResponse: TaskResponse) => {
                this.loading = false;
                if (!addResponse.done) {
                    this.snackBar
                        .open(addResponse.message || "Error al intentar crear la tarea", "Cerrar", { duration: 3000 });
                    return;
                }
                this.snackBar.open(addResponse.message, "Cerrar", { duration: 3000 });
                this.dialogRef.close(true);
            },
            error: (error) => {
                if (error?.status === 403 || error?.status === 404) {
                    this.snackBar
                        .open(error?.error?.message
                            || "Error al intentar crear la tarea", "Cerrar", { duration: 3000 });
                }
                this.loading = false;
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
