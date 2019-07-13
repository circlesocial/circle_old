import { Component } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { storage, initializeApp, database } from 'firebase';
import { FIREBASE_CONFIG } from "../../app/firebase.config";
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  // private COLOR_LIST = ["primary", "secondary", "tertiary", "success", "warning", "danger", "light", "medium", "dark"];
  // private NUM_COLOR = 9
  private options: CameraOptions = {
    // quality: 100,
    // destinationType: this.camera.DestinationType.FILE_URI,
    // encodingType: this.camera.EncodingType.JPEG,
    // mediaType: this.camera.MediaType.PICTURE
    destinationType: this.camera.DestinationType.DATA_URL,
    // targetWidth: 500,
    // targetHeight: 500,
    quality: 60,
    // allowEdit: true,
    correctOrientation: false,
    // targetWidth: 325,
    // targetHeight: 159,
    // saveToPhotoAlbum: true,

  }

  // the image the user took
  image: any;
  // event name
  event_name: string;
  // description
  description: string;
  // location
  location: string;
  // price
  price: string;


  constructor(private photoLibrary: PhotoLibrary, private camera: Camera, private httpClient: HttpClient, private router: Router, private toastController: ToastController) {
    // initializeApp(FIREBASE_CONFIG);
  }

  private add_tags(keyCode) {
    if (keyCode == 13) {
      let tag = (document.getElementById('tags') as HTMLInputElement).value;
      var node = document.createElement("ion-badge");          // Create a <ion-badge> node
      // node.setAttribute("color", this.COLOR_LIST[Math.floor(Math.random() * 9)]);
      node.setAttribute("color", "light-favorite");
      node.setAttribute("style", "margin-right: 0.1rem;")
      var textnode = document.createTextNode(tag);         // Create a text node
      node.appendChild(textnode);                              // Append the text to <li>
      document.getElementById("tag-list").appendChild(node); 
    }
  }

  take_photo() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      let html_image = document.getElementById("camera-image");
      html_image.setAttribute("src", base64Image);
      this.image = base64Image;
     }, (err) => {
      console.log(err);
     });
  }

  // post the event to firebase database
  post() {
    // get tags 
    let tag_list = document.getElementsByTagName("ion-badge");
    var tags = [];
    for (var i = 0; i < tag_list.length; i++) {
      tags.push(tag_list[i].innerText);
    }
    // get start & end date
    let start_date_element = document.getElementById("start_date");
    let end_date_element = document.getElementById("end_date");
    let start_date = start_date_element.getElementsByTagName("input")[0].value.substring(0, 16);
    let end_date = end_date_element.getElementsByTagName("input")[0].value.substring(0, 16);
    
    // console.log(this.event_name);
    // console.log(this.description);
    let tags_to_store = tags.join(',');
    // console.log(tags_to_store);
    // console.log(start_date);
    // console.log(end_date);
    // console.log(this.location);
    // console.log(this.price);
    // generate image name (must be unique)
    let image_name = Date.now().toString() + this.getRandomInt(100000000).toString();
    //console.log(image_name);
    // upload event data to ec2 server database first
    this.register_event(image_name, tags_to_store, start_date, end_date);
    // upload image to Google FireBase
    const pictures = storage().ref(image_name);
    pictures.putString(this.image, 'data_url');
    // Create a root reference
	  // var storageRef = storage().ref(image_name);
    // var uploadTask = storageRef.put(this.image);
    // uploadTask.on('state_changed', function(snapshot){
    //   // Observe state change events such as progress, pause, and resume
    //   // See below for more detail
    // }, function(error) {
    //   // Handle unsuccessful uploads
    // }, function() {
    //   // var downloadURL = uploadTask.snapshot.downloadURL;
    //   // console.log(downloadURL);
    //   return storageRef.getDownloadURL().then(downloadUrl => {
    //     console.log(downloadUrl)
    //   });     
    
    // });
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  register_event(image_name, tags_to_store, start_date, end_date) {
    let api_url = "http://3.16.107.6/event.php";
    // now send username and password to API URL
    let postData = {
      "image_name": image_name,
      "event_name": this.event_name,
      "description": this.description,
      "tags": tags_to_store,
      "start": start_date,
      "end": end_date,
      "location": this.location,
      "price": this.price 
    }

    this.httpClient.post(api_url, postData)
    .subscribe(data => {
      if (data["result"] == "Success") {
        this.postEventSucceedToast();

        //this.router.navigate(['/tabs/tabs/tab1']);
      } else {
        // do something here to handle failure
        // basically it's the case that the email has already been registered
        this.postEventFailureToast();
      }
      }, error => {
      console.log(error);
    });
  }

  async postEventFailureToast() {
    const toast = await this.toastController.create({
      message: "Unable to post this event. Please try again!",
      duration: 3000,
      position: 'top'
    });
  
    toast.present();
  }

  async postEventSucceedToast() {
    const toast = await this.toastController.create({
      message: "Event successfully posted! It will be approved shortly",
      duration: 3000,
      position: 'top'
    });
  
    toast.present();
  }
}
