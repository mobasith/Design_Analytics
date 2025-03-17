import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LandingPageComponent,SignInComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'design-metrics-frontend';
}
