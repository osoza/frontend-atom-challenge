import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { MatButton } from "@angular/material/button";

@Component({
    selector: "app-task-list-page",
    standalone: true,
    imports: [
        MatButton,
        NgOptimizedImage
    ],
    templateUrl: "./task-list-page.component.html",
    styleUrl: "./task-list-page.component.scss"
})
export class TaskListPageComponent {

}
