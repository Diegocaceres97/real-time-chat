import { CommonModule, DatePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { IonItem, IonLabel, IonText, IonNote, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline } from 'ionicons/icons';
import { Chat } from 'src/app/interface/chat';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
  standalone: true,
  imports: [IonIcon, IonNote, IonText, IonLabel, IonItem, DatePipe, CommonModule ]
})
export class CheckBoxComponent  implements OnInit {

  chat = input<Chat | null>(null);

  constructor() {
    addIcons({checkmarkDoneOutline});
  }

  ngOnInit() {}

}
