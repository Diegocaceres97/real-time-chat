import { Component, input, OnInit } from '@angular/core';
import { IonItem, IonLabel, IonText, IonNote, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline } from 'ionicons/icons';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
  standalone: true,
  imports: [IonIcon, IonNote, IonText, IonLabel, IonItem, ]
})
export class CheckBoxComponent  implements OnInit {

  chat = input<any>(null);

  constructor() {
    addIcons({
      checkmarkDoneOutline
    })
  }

  ngOnInit() {}

}
