import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api/api.service';
import { onValue } from '@angular/fire/database';
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
}
