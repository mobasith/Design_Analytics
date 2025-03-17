import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { AllDesignsComponent } from './pages/all-designs/all-designs.component';
import { DesignerDashboardComponent } from './pages/designer-dashboard/designer-dashboard.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SubmitFeedbackComponent } from './pages/submit-feedback/submit-feedback.component';
import { DesignerListComponent } from './pages/designer-list/designer-list.component';
import { ChatInterfaceComponent } from './pages/chat-interface/chat-interface.component';
import { DesignerAnalyticsComponent } from './pages/designer-analytics/designer-analytics.component';
import { DashboardComponent } from './pages/dash-board/dash-board.component';

export const routes: Routes = [
    {path:"",component:LandingPageComponent},
    {path:"signin",component:SignInComponent},
    {path:"signup",component:SignUpComponent},
    {path:"user-dashboard",component:UserDashboardComponent},
    {path:"all-designs",component:AllDesignsComponent},
    {path:"designer-dashboard",component:DesignerDashboardComponent},
    {path:"profile",component:ProfilePageComponent},
    {path:"submit-feedback",component:SubmitFeedbackComponent},
    {path:"all-designers",component:DesignerListComponent},
    {path:"chat",component:ChatInterfaceComponent},
    {path:"analytics",component:DesignerAnalyticsComponent},
    {path:"dashboard",component:DashboardComponent},

];
