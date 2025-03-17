import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

interface UserData {
  userId: number;
  userName: string;
  email: string;
  roleId: number;
  role: string;
  phoneNumber: string;
  address: string;
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class ProfilePageComponent implements OnInit {
  userData: UserData = {
    userId: 0,
    userName: '',
    email: '',
    roleId: 0,
    role: '',
    phoneNumber: '',
    address: '',
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userData = {
          userId: Number(payload.userId),
          userName: payload.userName,
          email: payload.email,
          roleId: payload.roleId,
          role: payload.roleId === 1 ? 'User' : 'Designer',
          phoneNumber: payload.phoneNumber || '',
          address: payload.address || '',
        };
      } catch (error) {
        console.error('Error parsing JWT token:', error);
        sessionStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  }

  handlePasswordUpdate(event: Event): void {
    event.preventDefault();

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.showAlert('New passwords do not match', 'error');
      return;
    }

    const token = sessionStorage.getItem('token');
    fetch(`http://localhost:3000/api/users/update/${this.userData.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: this.passwordData.currentPassword,
        newPassword: this.passwordData.newPassword,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.showAlert('Password updated successfully', 'success');
          this.passwordData = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          };
        } else {
          return response.json().then((err) => {
            throw new Error(err.message);
          });
        }
        return null;
      })
      .catch((error) => {
        this.showAlert(error.message, 'error');
      });
  }

  logout(): void {
    sessionStorage.removeItem('token');
    window.location.href = '/signin';
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'snackbar-error' : 'snackbar-success',
    });
  }
}