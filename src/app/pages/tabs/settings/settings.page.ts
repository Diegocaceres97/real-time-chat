import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';
import { add, power } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {

  private auth = inject(AuthService);

  constructor() {
    addIcons({
      power
    });
   }

  ngOnInit() {

  }

  logout(){
    this.auth.logout();
  }

}
