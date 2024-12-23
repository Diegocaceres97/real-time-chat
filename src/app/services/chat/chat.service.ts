import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Chat } from 'src/app/interface/chat';
import { AuthService } from '../auth/auth.service';
import { DatabaseReference, off, onValue } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private auth = inject(AuthService);
  private api =inject(ApiService);
  currentUserId = computed(() => this.auth.uid);
  chatMessages = signal<Chat[] | null>([]);
  private chatRef: DatabaseReference | null = null;
  private chatsListener: any = null;

  constructor() { }

  init(chatroomid: string){
    this.auth.getId();
    this.getChatMessages(chatroomid);
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
    this.chatRef = this.api.getRef(`chatrooms/${chatroomId}`);

    //listen to realtime updates to the chat messages within the chatroom
    this.chatsListener = onValue(this.chatRef, (snapshot:any) => {
      if(snapshot?.exists()){
        const messages = snapshot.val();
        console.log(messages);
        console.log(this.currentUserId().toString());
        const messageArray: Chat[] = Object.keys(messages).map(messageId => ({
          id: messageId,
          ...messages[messageId],
          isCurrentUser: messages[messageId].senderId === this.currentUserId().toString() ? true : false,
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

  unsubscribeChatrooms(){
    if(this.chatRef){//reset the ref

      off(this.chatRef, 'value', this.chatsListener);
      this.chatRef = null;
      this.chatsListener = null;

      this.chatMessages.set(null);
    }
  }
}
