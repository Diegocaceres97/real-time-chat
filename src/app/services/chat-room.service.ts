import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api/api.service';
import { DatabaseReference, off, onValue, query } from '@angular/fire/database';
import { AuthService } from './auth/auth.service';
import { User } from '../interfaces/user';
import { ChatRoom } from '../interfaces/chat-room';
import { last } from 'rxjs';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {

  private api = inject(ApiService);
  currentUser = computed(() => this.auth.uid());
  users = signal<User[] | null>(null);
  chatrooms = signal<ChatRoom[] | null>(null);
  private auth = inject(AuthService);
  private chatroomsRef: DatabaseReference | null = null;
  private userRef: DatabaseReference | null = null;
  private chatroomListener: any = null;
  private userListener: any = null;

  constructor() {
    this.auth.getId();
    this.getChartRooms();
  }

  getUsers(){
    this.userRef = this.api.getRef(`users`);

    //listen to realtime users List
    this.userListener = onValue(this.userRef, (snapshot) => {
      if(snapshot?.exists()){
        const users = snapshot.val();
        console.log(users);
        //

        const userArray: User[] = Object.values(users);
        console.log(userArray);

        const filteredUsers: User[] = userArray.filter(user => user.uid !== this.currentUser());
        this.users.set(filteredUsers);
      } else {
        this.users.set([]);
      }
    },
      (error) => {
        console.error('error fetching realtime users ', error);
      });
  }

  async createChatRoom(userIds: string[], roomName: string, type: string = 'private'): Promise<any>{

    try {
      const chatRoomRef = this.api.getRef(`chatrooms`);
    const userIdsRef = this.api.getRef(`users`);
    const userList = [this.currentUser(), ...userIds];
    const sortedUserList = userList.sort();
    const userHash = sortedUserList.join(',');

    const existingChatRoomQuery = query(
      chatRoomRef,
      this.api.orderByChild('userHash'), //query by userHash
      this.api.equalTo(userHash)
    );

    const existingChatRoomSnapshot = await this.api.getData(existingChatRoomQuery);

    if(existingChatRoomSnapshot?.exists()){
      //filter the results for a private chat room
      const chatRooms = existingChatRoomSnapshot.val();

      //check for private chat room
      const privateChatRooms = Object.values(chatRooms).find((chatRoom:any) => chatRoom.type === 'private');

      if(privateChatRooms){
        console.log(privateChatRooms);
        return privateChatRooms; //return existing private chat room
      }
    }

    //if not marching private chat room, create new room
    const newChatRoom = this.api.pushData(chatRoomRef);
    const chatRoomId = newChatRoom.key;
    const chatRoomData = {
      roomId: chatRoomId,
      name: roomName,
      userHash,
      users: sortedUserList,
      type,
      createdAt: new Date().toISOString(),
    };

    await this.api.setRefData(newChatRoom, chatRoomData);
    return chatRoomData;
    } catch (error) {
      throw error;
    }

  }

  getChartRooms(){
     this.chatroomsRef = this.api.getRef(`chatrooms`);

    //listen to realtime users List
    this.chatroomListener = onValue(this.chatroomsRef, (snapshot:any) => {
      if(snapshot?.exists()){
        const chatRooms = snapshot.val();
        console.log(chatRooms);

       const chatroomKeys= Object.keys(chatRooms);

       const chatRoomData = chatroomKeys.map((roomId:string) => {
         const room = chatRooms[roomId];

         //check if current user is part of the room

         if(room.type=='private' && room.users.includes(this.currentUser())){
          //find the other user in the room
          const otherUser = room.users.find((user:any) => user !== this.currentUser());
          //get the chat room data
         /*  const chatRoom = chatRooms[otherUser];
          console.log(chatRoom);
          this.chatrooms.set([chatRoom]); */

          //fetch the other user data and last message
          return this.getUserDataAndLastMessage(
            otherUser,
            roomId,
            room,
            room.messages
          );
         }
         return null;
       });

      //execute all promises and filter out null results
       Promise.all(chatRoomData).then((chatRoomWithDetails:any) => {

        const validateChatRooms = chatRoomWithDetails.filter((chatRoom:any) => chatRoom !== null);

        this.chatrooms.set(validateChatRooms as ChatRoom[]);
      })
      .catch(e => console.error(e));
      } else {
        //not chat rooms found
        this.chatrooms.set([]);
      }
    });
  }

  private async getUserDataAndLastMessage(otherUserId: string, roomId: string, room: any, messages:any){
    try {
      //fetch other user data
      const userRef=this.api.getRef(`users/${otherUserId}`);
      const snapshot = await this.api.getData(userRef);
      const user = snapshot?.exists() ? snapshot.val() : null;

      //fetch last message
      let lastMessage:any = null;
      if(messages){
        const messagesArray= Object.values(messages);
        const sortedMessages = messagesArray.sort((a:any, b:any) => b.timestamp - a.timestamp);

        lastMessage = sortedMessages[0];
      }
      /*  lastMessage = messages ? Object.values(messages).sort((a:any, b:any) => b.timestamp - a.timestamp)[0] : null;
      const lastMessageTimestamp = lastMessage?.timestamp; */

      //create chat room object
     const roomUserData: ChatRoom = {
      roomId,
      name: user?.name || null,
      photo: user?.photo || null,
      room,
      lastMessage: lastMessage?.message || null,
      lastMessageTimestamp: lastMessage?.timestamp || null,
     };

     return roomUserData;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  unsubscribeChatrooms(){
    if(this.chatroomsRef){
      this.chatroomsRef=null; //unsubscribe from the listener
      this.chatroomListener = null;
    }
  }

  unsubscribeUsers(){
    if(this.userRef){
      off(this.userRef, 'value', this.userListener);
      this.userRef = null; //unsubscribe from the listener
      this.userListener = null;
    }
  }

  unsubscribeChatroomsAndUsers(){
    this.unsubscribeChatrooms();
    this.unsubscribeUsers();
  }
}
