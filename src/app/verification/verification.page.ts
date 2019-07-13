import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {

  email: any;

  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient, private toastController: ToastController) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.email = this.router.getCurrentNavigation().extras.state.email;
        console.log("called constructor");
      }
    });
  }

  ngOnInit() {
  }

  register(code) {
    let api_url = "http://3.16.107.6/verify.php";
      // now send username and password to API URL
      let postData = {
        "email": this.email,
        "verifi_code": code
      }

      this.httpClient.post(api_url, postData)
      .subscribe(data => {
        if (data["result"] == "Success") {
          this.router.navigate(['/tabs']);
        } else {
          // do something here to handle failure
          // basically it's the case that the verification code is wrong
          this.presentToast();
        }
       }, error => {
        console.log(error);
      });

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'The verification code you entered is not correct',
      duration: 3000,
      position: 'top'
    });
  
    toast.present();
  }

}
