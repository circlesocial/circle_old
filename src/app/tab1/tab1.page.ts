import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { FIREBASE_CONFIG } from "../../app/firebase.config";
import { storage, initializeApp } from 'firebase';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  events: ActivityOverview[] = [
    new ActivityOverview("/assets/dinner.png", "Dinner at Hyde Park", "Come and join us for a wonderful dinner with uchicago students and alumni. Games and movies provided! Come and join us for a wonderful dinner with uchicago students and alumni. Games and movies provided!", "04/30/2019 3PM", "JCL 380, Jackson Ave, Queens, 11101, NY", "$10/person")
  ];

  urls = {};

  constructor(private router: Router, private httpClient: HttpClient) {
    initializeApp(FIREBASE_CONFIG);
    
    //this.loadEvents();
  }

  ionViewWillEnter(){
    this.loadEvents();
  }

  private set_filter() {
    this.router.navigate(['/filter']);
  }

  private view_detail() {
    this.router.navigate(['/event-detail']);
  }

  getImageSrc(event : ActivityOverview) : string {
    // if (!isNaN(Number(event.image_name))) {
    //   const image = storage().ref(event.image_name);
    //   console.log(event.image_name);
    //   image.getDownloadURL().then((url) => { 
    //     console.log(url);
    //     return url 
    //   });
    // } else {
    console.log(event.image_name);
    return event.image_name;
    //}
    
  }

  getEventTitle(event : ActivityOverview) : string {
    return event.event_name;
  }

  getEventDescription(event : ActivityOverview) : string {
    return event.description;
  }

  getEventStartTime(event: ActivityOverview) : string {
    return event.start_time;
  }

  getEventLocation(event: ActivityOverview) : string {
    return event.address;
  }

  getEventPrice(event: ActivityOverview) : string {
    return event.price;
  }

  loadEvents() {
    this.events = [
      new ActivityOverview("/assets/dinner.png", "Dinner at Hyde Park", "Come and join us for a wonderful dinner with uchicago students and alumni. Games and movies provided! Come and join us for a wonderful dinner with uchicago students and alumni. Games and movies provided!", "04/30/2019 3PM", "JCL 380, Jackson Ave, Queens, 11101, NY", "$10/person")
    ];
    let api_url = "http://3.16.107.6/load_event.php";
    this.httpClient.get(api_url)
    .subscribe(data => {
      for (var i = 0; i < this.getLength(data); i++) {
        const image = storage().ref(data[i]["image_name"]);
        const data_item = data[i];
        image.getDownloadURL().then((url) => { 
          this.events.push(new ActivityOverview(url, data_item["event_name"], data_item["description"], this.buildTime(data_item["start_time"]), data_item["address"], data_item["price"]));
        });
      }
    });
  }

  getLength(data: Object) : Number {
    var i = 0;
    while (data[i] != undefined) {
      i += 1;
    }
    return i;
  }

  buildTime(time: string) : string {
    let two_parts = time.split("T");
    let MDY = two_parts[0].split("-");
    let year = MDY[0];
    let month = MDY[1];
    let day = MDY[2];
    let HM = two_parts[1].split(":");
    if (Number(HM[0]) < 12) {
      return month + "/" + day + "/" + year + " " + two_parts[1] + "AM";
    } else {
      return month + "/" + day + "/" + year + " " + two_parts[1] + "AM";
    }
  }
}

class ActivityOverview {
  image_name: string;
  event_name: string;
  description: string;
  start_time: string;
  address: string;
  price: string;
  constructor(image_name, event_name, description, start_time, address, price) {
    this.image_name = image_name;
    this.event_name = event_name;
    this.description = description;
    this.start_time = start_time;
    this.address = address;
    this.price = price;
  }
}