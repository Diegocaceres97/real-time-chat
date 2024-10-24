import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonAvatar, IonList, IonImg, IonLabel, IonButtons, IonTabButton, IonButton, IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, arrowBack } from 'ionicons/icons';
import { UsersComponent } from 'src/app/components/users/users.component';
import { ChatRoomService } from 'src/app/services/chat-room.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [IonModal, IonIcon, IonButton, IonTabButton, IonButtons, IonLabel, IonImg, IonList, IonAvatar, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, UsersComponent]
})
export class ChatsPage implements OnInit {

  chats = Array(10);
  isNewChat = signal<boolean>(false);
  private chatroom = inject(ChatRoomService);

  constructor() {
    addIcons({
      addCircle,
      arrowBack
    });
  }

  ngOnInit() {
  }

  setIsNewChat(value: boolean) {
    //call users data
    this.chatroom.getUsers();
    this.isNewChat.set(value);

  }

}
