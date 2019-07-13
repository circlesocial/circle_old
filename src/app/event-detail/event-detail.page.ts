import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  constructor(private location:Location) { }

  ngOnInit() {
  }
  back_to_previous() {
    this.location.back();
  }
}
