import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";

describe("AppComponent", () => {
   let fixture: ComponentFixture<AppComponent>;
   let component: AppComponent;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [CommonModule, RouterTestingModule, AppComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it("should create the app", () => {
      expect(component).toBeTruthy();
   });

   it("should have the 'atom-challenge-fe-template' title", () => {
      expect(component.title).toEqual("atom-challenge-fe-template");
   });

   it("should render header", () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector(".app-header")).toBeTruthy();
   });
});
