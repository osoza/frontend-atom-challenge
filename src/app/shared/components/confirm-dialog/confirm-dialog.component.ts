import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";

import { DialogResponse } from "./models/confirm-dialog.model";

@Component({
    selector: "app-confirm-dialog",
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ],
    templateUrl: "./confirm-dialog.component.html",
    styleUrls: ["./confirm-dialog.component.scss"]
})
export class ConfirmDialogComponent {
    loading: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: {
            title?: string,
            positive?: string,
            callback: () => DialogResponse
        }
    ) { }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onAccept(): void {
        this.loading = true;
        if (this.data?.callback) {
            const result$ = this.data.callback() as unknown as Observable<DialogResponse>;
            result$.subscribe((response: DialogResponse) => {
                if (response.done) {
                    this.dialogRef.close(true);
                }

                if (!response.done) {
                    this.snackBar
                        .open(response.message || "No se pudo eliminar la tarea", "Cerrar", { duration: 3000 });
                    this.loading = false;
                }
            });
        }
    }
}
