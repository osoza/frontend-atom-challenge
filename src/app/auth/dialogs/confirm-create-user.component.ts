import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-confirm-create-user",
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        NgOptimizedImage
    ],
    templateUrl: "./confirm-create-user.component.html",
    styleUrls: ["./confirm-create-user.component.scss"]
})
export class ConfirmCreateUserComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { email: string },
        private dialogRef: MatDialogRef<ConfirmCreateUserComponent>
    ) { }

    cancel() {
        this.dialogRef.close(false);
    }

    confirm() {
        this.dialogRef.close(true);
    }
}
