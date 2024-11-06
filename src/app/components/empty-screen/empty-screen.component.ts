import { Component, input, OnInit } from '@angular/core';
import { IonGrid, IonCol, IonRow, IonIcon, IonLabel, IonText } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { chatbubblesOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-screen',
  templateUrl: './empty-screen.component.html',
  styleUrls: ['./empty-screen.component.scss'],
  standalone: true,
  imports: [IonText, IonLabel, IonIcon, IonRow, IonCol, IonGrid, ]
})
export class EmptyScreenComponent  implements OnInit {

  model = input<any>();

  constructor() {
    addIcons({
      chatbubblesOutline
    })
  }

  ngOnInit() {}

}
