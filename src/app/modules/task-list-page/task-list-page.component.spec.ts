import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";

import { AuthService } from "../../auth/services/auth.service";
import { TasksService } from "./services/task-list.service";
import { TaskListPageComponent } from "./task-list-page.component";

describe("TaskListPageComponent", () => {
   let component: TaskListPageComponent;
   let fixture: ComponentFixture<TaskListPageComponent>;
   let tasksServiceSpy: jasmine.SpyObj<TasksService>;
   let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
   let authServiceSpy: jasmine.SpyObj<AuthService>;

   beforeEach(async () => {
      // Creamos los spies de los servicios
      const tasksSpy = jasmine.createSpyObj("TasksService", ["getTasks", "updateTask", "deleteTask"]);
      const snackSpy = jasmine.createSpyObj("MatSnackBar", ["open"]);
      const authSpy = jasmine.createSpyObj("AuthService", ["logout"]);

      await TestBed.configureTestingModule({
         imports: [TaskListPageComponent, MatDialogModule],
         providers: [
            { provide: TasksService, useValue: tasksSpy },
            { provide: MatSnackBar, useValue: snackSpy },
            { provide: AuthService, useValue: authSpy }
         ]
      }).compileComponents();

      fixture = TestBed.createComponent(TaskListPageComponent);
      component = fixture.componentInstance;

      tasksServiceSpy = TestBed.inject(TasksService) as jasmine.SpyObj<TasksService>;
      snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
      authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
   });

   it("should create", () => {
      expect(component).toBeTruthy();
   });

   it("should load tasks on init", () => {
      const mockTasksResponse = {
         done: true,
         message: "Ok",
         tasks: [
            {
               id: "1",
               title: "Tarea 1",
               description: "Desc 1",
               completed: false,
               createdAt: "2025-09-13T12:00:00Z"
            }
         ]
      };

      tasksServiceSpy.getTasks.and.returnValue(of(mockTasksResponse));

      component.ngOnInit();

      expect(tasksServiceSpy.getTasks).toHaveBeenCalled();
      expect(component.tasks.length).toBe(1);
      expect(component.tasks[0].title).toBe("Tarea 1");
   });
});
