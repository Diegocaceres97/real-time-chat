import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  sendMesage(chatroomId:string, message:string){}
/*
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
   }

   getChartRooms(){
     const chatRoomRef = this.api.getRef(`chatrooms`);

     //listen to realtime users List
     onValue(chatRoomRef, (snapshot:any) => {
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
           this.chatrooms.set([chatRoom]);

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
   } */
}
