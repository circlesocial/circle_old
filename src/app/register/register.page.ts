import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  private COLOR_LIST = ["primary", "secondary", "tertiary", "success", "warning", "danger", "light", "medium", "dark"];
  private NUM_COLOR = 9

  constructor(private router: Router) { }

  ngOnInit() {
  }

  register() {
    this.router.navigate(['/tabs']);
  }


  private add_tags(keyCode) {
    if (keyCode == 13) {
      let tag = (document.getElementById('tags') as HTMLInputElement).value;
      var node = document.createElement("ion-badge");          // Create a <ion-badge> node
      node.setAttribute("color", this.COLOR_LIST[Math.floor(Math.random() * 9)]);
      node.setAttribute("style", "margin-right: 0.1rem;")
      var textnode = document.createTextNode(tag);         // Create a text node
      node.appendChild(textnode);                              // Append the text to <li>
      document.getElementById("tag-list").appendChild(node); 
    }
  }
}
