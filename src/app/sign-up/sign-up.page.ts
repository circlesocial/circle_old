import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  constructor(private router: Router, private httpClient: HttpClient, private toastController: ToastController) { }

  ngOnInit() {
  }

  register(email, password, reppassword) {
    if (password != reppassword) {
      // do something here, maybe show a red message telling the user
      // that passwords don't match
      this.passwordsNotMatchToast();
    } else {
      let api_url = "http://3.16.107.6/register.php";
      // now send username and password to API URL
      let postData = {
        "email": email,
        "password": password
      }

      this.httpClient.post(api_url, postData)
      .subscribe(data => {
        if (data["result"] == "Success") {
          let navigationExtras: NavigationExtras = {
            state: postData
          };
          this.router.navigate(['/verification'], navigationExtras);
        } else {
          // do something here to handle failure
          // basically it's the case that the email has already been registered
          this.registrationFailureToast();
        }
       }, error => {
        console.log(error);
      });
 
    }
    
  }


  async passwordsNotMatchToast() {
    const toast = await this.toastController.create({
      message: "Please make sure passwords match! Please try again.",
      duration: 3000,
      position: 'top'
    });
  
    toast.present();
  }

  async registrationFailureToast() {
    const toast = await this.toastController.create({
      message: "The email has already been registered! Please try again.",
      duration: 3000,
      position: 'top'
    });
  
    toast.present();
  }
}
