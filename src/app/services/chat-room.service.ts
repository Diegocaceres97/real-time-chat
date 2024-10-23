import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api/api.service';
import { onValue } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {

  private api = inject(ApiService);
  users = signal<any[]>([]);

  constructor() { }

  getUsers(){
    const userRef = this.api.getRef(`users`);

    //listen to realtime users List
    onValue(userRef, (snapshot) => {
      if(snapshot?.exists()){
        const users = snapshot.val();
        console.log(users);
       // this.users.set(users);
      }
    });
  }
}
