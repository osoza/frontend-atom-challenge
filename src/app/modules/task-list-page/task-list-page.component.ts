import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
   Component,
   inject,
   OnInit,
   signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import {
   catchError, map, Observable, of
} from "rxjs";

import { AuthService } from "../../auth/services/auth.service";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { DialogResponse } from "../../shared/components/confirm-dialog/models/confirm-dialog.model";
import { AddTaskDialogComponent } from "./components/add-task-dialog/add-task-dialog.component";
import { EditTaskDialogComponent } from "./components/edit-task-dialog/edit-task-dialog.component";
import {
   Task,
   TaskResponse,
   TasksFilters,
   TasksListResponse
} from "./models/task-list.model";
import { TasksService } from "./services/task-list.service";

@Component({
   selector: "app-task-list-page",
   standalone: true,
   imports: [
      CommonModule,
      FormsModule,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      MatTableModule,
      MatCheckboxModule,
      MatDialogModule,
      NgbDropdownModule,
      NgOptimizedImage,
   ],
   templateUrl: "./task-list-page.component.html",
   styleUrl: "./task-list-page.component.scss"
})
export class TaskListPageComponent implements OnInit {
   private dialog = inject(MatDialog);
   tasks: Task[] = [];
   loading: boolean = true;
   filters = signal({ title: "", description: "", completed: "", });
   displayedColumns = ["title", "description", "createdAt", "completed", "actions"];

   get filterValues() {
      return this.filters();
   }

   constructor(private tasksService: TasksService, private snackBar: MatSnackBar, private authService: AuthService) { }

   ngOnInit(): void {
      this.getTasks();
   }

   getTasks(filters?: { title?: string; description?: string; completed?: boolean }) {
      this.loading = true;
      this.tasksService.getTasks(filters).subscribe({
         next: (getResponse: TasksListResponse) => {
            if (getResponse.done) {
               this.tasks = getResponse.tasks;
            }
            this.loading = false;
         },
         error: (error) => {
            if (error?.status === 403 || error?.status === 404) {
               this.snackBar
                  .open(error?.error?.message
                     || "Error al intentar obtener las tarea", "Cerrar", { duration: 3000 });
            }
            this.loading = false;
         }
      });
   }

   setFilter(key: "title" | "description" | "completed", value: string) {
      const newFilters = { ...this.filters(), [key]: value };
      this.filters.set(newFilters);
      this.getTasks(this.getFilters());
   }

   getFilters(): TasksFilters {
      const filters = { ...this.filters() };
      let completedFilter: boolean | undefined;

      if (filters.completed === "completed") {
         completedFilter = true;
      } else if (filters.completed === "pending") {
         completedFilter = false;
      }

      return {
         title: filters.title || undefined,
         description: filters.description || undefined,
         completed: completedFilter
      };
   }

   toggleTask(task: Task): void {
      const previousState = task.completed;
      const newState = !previousState;
      const taskCopy = { ...task, completed: newState };
      const index = this.tasks.findIndex((t: Task) => t.id === task.id);

      if (index !== -1) {
         this.tasks[index] = taskCopy;
      }

      this.tasksService.updateTask(task.id!, { completed: newState }).subscribe({
         next: (updateResponse: TaskResponse) => {
            if (updateResponse.done) {
               if (index !== -1) {
                  this.tasks[index] = { ...this.tasks[index], completed: newState };
               }
            }

            if (!updateResponse.done) {
               if (index !== -1) {
                  this.tasks[index] = { ...this.tasks[index], completed: previousState };
               }
            }
         },
         error: () => {
            if (index !== -1) {
               this.tasks[index] = { ...this.tasks[index], completed: previousState };
            }
         }
      });
   }

   deleteTask(task: Task): Observable<DialogResponse> {
      return this.tasksService.deleteTask(task.id).pipe(
         map((deleted: boolean) => ({
            done: deleted,
            message: deleted
               ? "✅ Operación realizada con éxito"
               : "❌ Hubo un error al procesar"
         })),
         catchError((error) => of({
            done: false,
            message: error || "❌ Hubo un error al procesar"
         }))
      );
   }

   openDeleteDialog(task: Task): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
         disableClose: true,
         data: {
            title: "Está a punto de eliminar una tarea",
            positive: "Eliminar",
            showLoading: true,
            callback: (): Observable<DialogResponse> => this.deleteTask(task)
         }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
         if (result) {
            this.snackBar.open("✅ Operación realizada con éxito", "Cerrar", { duration: 3000 });
            this.getTasks(this.getFilters());
         }
      });
   }

   openAddDialog(): void {
      const dialogRef = this.dialog.open(AddTaskDialogComponent, {
         width: "400px",
         disableClose: true,
         autoFocus: false
      });

      dialogRef.afterClosed().subscribe((result: false | undefined) => {
         if (result && result !== false) {
            this.getTasks(this.getFilters());
         }
      });
   }

   openEditDialog(task: Task): void {
      const dialogRef = this.dialog.open(EditTaskDialogComponent, {
         width: "400px",
         disableClose: true,
         autoFocus: false,
         data: { task }
      });

      dialogRef.afterClosed().subscribe((result: false | undefined) => {
         if (result && result !== false) {
            this.getTasks(this.getFilters());
         }
      });
   }

   logout() {
      this.authService.logout();
   }
}
