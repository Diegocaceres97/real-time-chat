import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Chat } from 'src/app/interface/chat';
import { AuthService } from '../auth/auth.service';
import { onValue } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private auth = inject(AuthService);
  private api =inject(ApiService);
  currentUserId = computed(() => this.auth.uid);
  chatMessages = signal<Chat[]>([]);

  constructor() {
    this.auth.getId();
   }

  async sendMesage(chatroomId:string, message:string){
    try {
      const chatRoomRef = this.api.getRef(`chatrooms/${chatroomId}`);

      //prepare message object
      const chatData: Chat = {
        senderId: this.currentUserId()?.toString(),
        message,
        timestamp: new Date().getTime(),
      }

      //push the message to the chat room messages node
      const newMessageRef = this.api.pushData(chatRoomRef);
      await this.api.setRefData(newMessageRef, chatData);
    }catch(error){
      throw error;
    }
  }

  getChatMessages(chatroomId:string){
    const chatRoomRef = this.api.getRef(`chatrooms/${chatroomId}`);

    //listen to realtime updates to the chat messages within the chatroom
    onValue(chatRoomRef, (snapshot:any) => {
      if(snapshot?.exists()){
        const messages = snapshot.val();
        console.log(messages);
        const messageArray: Chat[] = Object.keys(messages).map(messageId => ({
          id: messageId,
          ...messages[messageId],
          isCurrentUser: messages[messageId].senderId === this.currentUserId() ? true : false,
        }));
        this.chatMessages.set(messageArray);
        console.log('por aca')
      } else {
        this.chatMessages.set([]);
        console.log('por aca no')
      }
      }, (error) => {
        console.error('error fetching realtime chat messages ', error);
      }
    );
  }
}
