import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonAvatar, IonList, IonImg, IonLabel, IonButtons, IonTabButton, IonButton, IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, arrowBack } from 'ionicons/icons';
import { UsersComponent } from 'src/app/components/users/users.component';
import { ChatRoomService } from 'src/app/services/chat-room.service';
import { User } from 'src/app/interfaces/user';
import { NavigationExtras, Router } from '@angular/router';
import { ChatRoom } from 'src/app/interfaces/chat-room';
import { empty } from 'rxjs';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [IonModal, IonIcon, IonButton, IonTabButton, IonButtons, IonLabel, IonImg, IonList, IonAvatar, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, UsersComponent,EmptyScreenComponent]
})
export class ChatsPage implements OnInit {

  isNewChat = signal<boolean>(false);
  public chatroom = inject(ChatRoomService);
  users = computed<User[] | null>(() => this.chatroom.users());
  private router = inject(Router);
  chatrooms = computed<ChatRoom[] | null>(() =>this.chatroom.chatrooms());

model = {
  icon: 'chatbubbles-outline',
  title: 'No chat rooms found',
  color: 'primary'
}

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
    if(!this.users() || this.users()?.length === 0) this.chatroom.getUsers();
    this.isNewChat.set(value);

  }

  async startChat(user: User, modal: IonModal){
    console.log(user);
    try {
      const room = await this.chatroom.createChatRoom([user.uid], user.name);
      //dismiss modal
      //navigate to chat room page
      modal.dismiss();

      this.navigateToChat(user.name, room?.roomId);
    } catch (error) {
      console.error(error);
    }
  }

  getChat(chatroom: ChatRoom){
    this.navigateToChat(chatroom?.name, chatroom.roomId);
  }


  navigateToChat(name: string | null, id: string) {
    const navData: NavigationExtras = {
      queryParams: {
        name: name,
      }
    };

    this.router.navigate(['/', 'tabs','chats', id],navData);
  }

}
