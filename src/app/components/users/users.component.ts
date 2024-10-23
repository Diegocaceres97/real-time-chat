import { Component, OnInit, output } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonContent, IonList, IonLabel, IonItem, IonAvatar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [IonAvatar, IonItem, IonLabel, IonList, IonContent, IonIcon, IonButtons, IonButton, IonToolbar, IonHeader, IonTitle, ]
})
export class UsersComponent  implements OnInit {

  public users = Array(10);
  close = output<boolean>();

  constructor() { }

  ngOnInit() {}

}
