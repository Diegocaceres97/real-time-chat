import { set } from '@angular/fire/database';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonBackButton,
  IonText,
  IonList,
  IonFooter,
  IonTextarea,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { CheckBoxComponent } from 'src/app/components/check-box/check-box.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { addIcons } from 'ionicons';
import {
  chatbubblesOutline,
  checkmarkDoneOutline,
  add,
  send,
} from 'ionicons/icons';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonTextarea,
    FormsModule,
    IonFooter,
    CheckBoxComponent,
    EmptyScreenComponent,
    IonList,
    IonText,
    IonBackButton,
    IonIcon,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class ChatPage implements OnInit {
  isLoading = signal<boolean>(false);
  private route = inject(ActivatedRoute);
  name = signal<string | null>(null);
  id = signal<string>('');
  message = signal<string | null>(null);
  model = {
    icon: 'chatbubbles-outline',
    title: 'No chats',
    color: 'primary',
  };

  private chatService = inject(ChatService);

  chats = signal([]);

  constructor() {
    addIcons({ send, add, checkmarkDoneOutline, chatbubblesOutline });
  }

  ngOnInit() {
    const data: any = this.route.snapshot.queryParams;
    if (data?.name) {
      console.log(data.name);
      this.name.set(data.name);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.id.set(id);
  }

  async sendMessage() {
    if (!this.message() || this.message()?.trim() === '') {
      //show a toast message
      return;
    }

    try {
      this.setIsLoading(true);
      await this.chatService.sendMesage(this.id(), this.message() as string);
      this.message.set(null);
      this.setIsLoading(false);
    } catch (error) {
      console.log(error);
      this.setIsLoading(false);
    }
  }

  setIsLoading(value: boolean) {
    this.isLoading.set(value);
  }
}
