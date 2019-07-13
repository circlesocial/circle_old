import { Component, OnInit } from '@angular/core';

import { Location } from "@angular/common";


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.page.html',
  styleUrls: ['./chat-box.page.scss'],
})
export class ChatBoxPage implements OnInit {

    newmessage : string = "";

    constructor(private location:Location) { }

    ngOnInit() {
    }

    back_to_previous() {
      this.location.back();
    }

    // called when user click the button to send a message
    addmessage() {
      var text_node = document.createTextNode(this.newmessage);         // Create a text node

      this.newmessage = "";

      var item_node = document.createElement("ion-item");
      item_node.setAttribute("slot", "end");
      item_node.setAttribute("lines", "none");
      item_node.setAttribute("style", "margin-top: 10px;");
      // create an ion-card
      var card_node = document.createElement("ion-card");
      card_node.setAttribute("slot", "end");
      card_node.setAttribute("color", "primary");
      card_node.setAttribute("style", "max-width: 60% !important; margin-left: 0px;  margin-bottom: 0; margin-top: 0;")
     
      // create the content from user_typed text
      var content_node = document.createElement("ion-card-content");
      content_node.appendChild(text_node);
      content_node.setAttribute("style", "padding: 5px;");
      // append ion-card-content to ion-card
      card_node.appendChild(content_node);
      // create ion-icon
      var icon_node = document.createElement("ion-icon");
      icon_node.setAttribute("ios", "ios-person");
      icon_node.setAttribute("md", "md-person");
      icon_node.setAttribute("size", "large");
      icon_node.setAttribute("slot", "end");
      // append ion-card, ion-icon to ion-item
      item_node.appendChild(card_node);
      item_node.appendChild(icon_node);
      // append item_node to the chat_window
      var chat_window = document.getElementById("chat_window");
      chat_window.appendChild(item_node);
      
    }
}
