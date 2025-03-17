import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { provideHttpClient } from '@angular/common/http'; // Import HttpClientModule
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    ReactiveFormsModule,  // Add this line to enable reactive forms
    provideHttpClient(), provideAnimationsAsync(),  // Add this line to enable HttpClient
  ]
};
