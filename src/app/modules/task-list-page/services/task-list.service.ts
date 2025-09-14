import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../../environments/environment";
import {
   AddTask,
   Task,
   TaskResponse,
   TasksListResponse
} from "../models/task-list.model";

@Injectable({ providedIn: "root" })
export class TasksService {
   constructor(private http: HttpClient) { }

   getTasks(filters?: { title?: string; description?: string; completed?: boolean }): Observable<TasksListResponse> {
      let params = new HttpParams();

      if (filters) {
         if (filters.title) {
            params = params.set("title", filters.title);
         }
         if (filters.description) {
            params = params.set("description", filters.description);
         }
         if (filters.completed !== undefined) {
            params = params.set("completed", String(filters.completed));
         }
      }
      return this.http.get<TasksListResponse>(`${environment.apiUrl}/tasks/`, { params });
   }

   addTask(credentials: AddTask): Observable<TaskResponse> {
      return this.http.post<TaskResponse>(`${environment.apiUrl}/tasks/`, credentials);
   }

   deleteTask(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${environment.apiUrl}/tasks/${id}`);
   }

   updateTask(id: string, data: Partial<Task>): Observable<TaskResponse> {
      return this.http.put<TaskResponse>(`${environment.apiUrl}/tasks/${id}`, data);
   }
}
