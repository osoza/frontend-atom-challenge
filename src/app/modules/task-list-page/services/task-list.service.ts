import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { globalConst } from "../../../global";
import { AddTask, TaskResponse, TasksListResponse } from "../models/task-list.model";

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
        return this.http.get<TasksListResponse>(`${globalConst.taskApiUrl}/`, { params });
    }

    addTask(credentials: AddTask): Observable<TaskResponse> {
        return this.http.post<TaskResponse>(`${globalConst.taskApiUrl}/`, credentials);
    }

    deleteTask(id: string): Observable<boolean> {
        return this.http.delete<boolean>(`${globalConst.taskApiUrl}/${id}`);
    }

    updateTask(filters?: { title?: string; description?: string; completed?: boolean }): Observable<TaskResponse> {
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
        return this.http.get<TasksListResponse>(`${globalConst.taskApiUrl}/`, { params });
    }
}
