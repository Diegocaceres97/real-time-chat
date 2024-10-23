import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uid = signal<string|null>(null);
  private fireAuth = inject(Auth);
  private router = inject(Router);
  private api = inject(ApiService);

  constructor() { }

 /*  setData(uid: string | null) {
    if(!this.uid())this.uid.set(uid);
  } */

  getId() {
    const auth = getAuth();
    const uid = auth.currentUser?.uid || null;
    //this.setData(uid);
    return uid;
  }

  async login(email: string, password: string) {
    try {
      const response = await signInWithEmailAndPassword(
        this.fireAuth,
        email,
        password
      );

      if(response?.user) {
        //save data

        //this.setData(response.user.uid);

      }
    } catch (error) {
      console.error('Login error ',error);
      throw error;
    }
  }

  async register(data:{name:string,email: string, password: string}):Promise<{id: string}> {
    try {
      const register = await createUserWithEmailAndPassword(
        this.fireAuth,
        data.email,
        data.password
      );

      const id = register.user.uid;

      const userData = {
        uid: id,
        name: data.name,
        email: data.email,
        photo: 'https://i.pravatar.cc/' + this.randomIntFromInterval(200, 400) + '.jpg',
      };

      //set data in database
await this.api.setData(`users/${id}`, userData);
//this.setData(id);

      return {id};
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async resetPassword(email: string) {
    try {
       await sendPasswordResetEmail(this.fireAuth,email);

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  checkAuth(): Promise<User|null|Error> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.fireAuth, (user) => {
      resolve(user);
      }, (error)=> {
        reject(error);
        console.error(error);
      })
    })
  }

  navigateByUrl(path: string) {
    this.router.navigateByUrl(path, {replaceUrl: true});
  }

  async getUserData(id: string) {
    try {
      const userRef = this.api.getRef(`users/${id}`);
      const snapshot = await this.api.getData(userRef);
      if(snapshot?.exists()){
        return snapshot.val();
      } else {
        throw new Error('User not found');
      }

    } catch (error) {
      console.error('error data fetching ', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.fireAuth.signOut();
      //this.uid.set(null);
      this.navigateByUrl('/login');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
