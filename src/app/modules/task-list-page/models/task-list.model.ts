export interface Task {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    completed: boolean;
}

export interface AddTask {
    title: string;
    description: string;
    createdAt: string;
    completed: boolean;
}

export interface TaskResponse {
    done: boolean;
    message: string;
}

export interface TasksListResponse {
    done: boolean;
    message: string;
    tasks: Task[];
}

export interface TasksFilters {
    title: string | undefined;
    description: string | undefined;
    completed: boolean | undefined;
}
