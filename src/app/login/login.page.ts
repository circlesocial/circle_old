import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router, private httpClient: HttpClient, private toastController: ToastController) { }

  ngOnInit() {
  }

  login(username, password) {
    let api_url = "http://3.16.107.6/login.php";
    // now send username and password to API URL
    let postData = {
      "email": username,
      "password": password
    }
    this.httpClient.post(api_url, postData)
      .subscribe(data => {
        if (data["result"] == "Success") { // if log in check succeeds, go to tab 1
          // tell the user that login is successful
          this.loginSucceedNotification();
          // navigate to tab 1
          this.router.navigate(['/tabs']);
        } else if (data["result"] == "Error") { // password or username not correct
          this.wrongPasswordToast();
        } else if (data["result"] == "Need Verification") { // the email address need verification
          let navigationExtras: NavigationExtras = {
            state: postData
          };
          this.router.navigate(['/verification'], navigationExtras);
        }
       }, error => {
        console.log(error);
      });

    
  }

  async wrongPasswordToast() {
    const toast = await this.toastController.create({
      message: "The password and/or email address you entered are wrong. Please try again.",
      duration: 3000,
      position: 'top'
    });
  
    toast.present();
  }

  async loginSucceedNotification() {
    const toast = await this.toastController.create({
      message: "Login is successful!",
      duration: 500,
      position: 'top'
    });
  
    toast.present();
  }

  jumpToTab1(){
    this.router.navigate(['/tabs/tabs/tab1']);
  }

  switchLoginRegister() {
    this.router.navigate(['/sign-up']);
  }
}
