import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css'],
})
export class ChatInterfaceComponent {
  groups = [
    { id: '1', name: 'Design Team', description: 'Creative professionals' },
    { id: '2', name: 'Development Team', description: 'Tech innovators' },
    { id: '3', name: 'Marketing Team', description: 'Brand storytellers' },
  ];

  userIcons = [
    { name: 'Emma', avatar: '👩‍💻' },
    { name: 'Alex', avatar: '👤' },
    { name: 'Sam', avatar: '🧑‍🎨' },
  ];

  selectedGroup: string | null = null;
  message: string = '';
  messages: Array<{
    groupId: string;
    text: string;
    sender: string;
    timestamp: Date;
  }> = [];
  currentUser = this.userIcons[0];

  get filteredMessages() {
    return this.selectedGroup
      ? this.messages.filter((msg) => msg.groupId === this.selectedGroup)
      : [];
  }

  get selectedGroupName(): string {
    const group = this.groups.find((g) => g.id === this.selectedGroup);
    return group ? group.name : 'Select a Group';
  }

  handleSendMessage(): void {
    if (this.message.trim() && this.selectedGroup) {
      this.messages.push({
        groupId: this.selectedGroup,
        text: this.message,
        sender: this.currentUser.name,
        timestamp: new Date(),
      });
      this.message = '';
    }
  }

  formatTimestamp(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  handleGroupSelection(groupId: string): void {
    this.selectedGroup = groupId;
  }

  handleUserSelection(user: { name: string; avatar: string }): void {
    this.currentUser = user;
  }
}
