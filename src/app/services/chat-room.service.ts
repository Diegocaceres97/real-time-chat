import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api/api.service';
import { onValue, query } from '@angular/fire/database';
import { AuthService } from './auth/auth.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {

  private api = inject(ApiService);
  currentUser = computed(() => this.auth.uid());
  users = signal<User[] | null>(null);
  private auth = inject(AuthService);

  constructor() {
    this.auth.getId();
  }

  getUsers(){
    const userRef = this.api.getRef(`users`);

    //listen to realtime users List
    onValue(userRef, (snapshot) => {
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
        return privateChatRooms; //return existing private chat room
      }
    }

    //if not marching private chat room, create new room
    const newChatRoom = this.api.pushData(chatRoomRef);
    const chatRoomId = newChatRoom.key;
    const chatRoomData = {
      roomId: chatRoomId,
      name: roomName,
      userHash: userHash,
      users: sortedUserList,
      type,
      createdAt: new Date().toISOString(),
    };

    await this.api.setRefData(newChatRoom, chatRoomData);
    return chatRoomData;
  }
}
