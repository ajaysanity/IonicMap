import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import LocationData from '../data/places_dataset.json';
import { LocationModel } from '../models/location.model';
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  zoom = 15;
  map: any;
  marker: any;
  infoWindow: any;
  locationData: LocationModel[];
  locations: LocationModel[];
  isFocus: boolean = false;

  @ViewChild('mapElement',{static: true}) mapElement: ElementRef;

  constructor(private geolocation: Geolocation) {
  }
  ngOnInit() {
    this.locations = JSON.parse(LocationData.data.listPlacesString2);
    console.log(this.locations)
    // const locationString = LocationData.data.listPlacesString2;
    // const locationObject = JSON.parse(locationString.place);
    // this.locationData.forEach((data: LocationModel) => this.locations = data as LocationModel)
  }
ionViewWillEnter(){
  this.mapInit()
}

mapInit(){
  let options = {
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.HYBRID
  }
  this.map = new google.maps.Map(this.mapElement.nativeElement,options)
  this.geolocation.getCurrentPosition().then(pos => {
      let latitude = pos.coords.latitude
      let longitude = pos.coords.longitude
      let latLng = new google.maps.LatLng(latitude, longitude);
      this.map.setCenter(latLng);
      this.map.setZoom(13);
      this.addMarker(latitude, longitude)
  })

}

searchLocation(location: LocationModel){
this.addMarker(location.lat,location.long, location)
  this.isFocus = !this.isFocus;

}
addMarker(lat:number, lng:number, data?: LocationModel){
  let latLng = {
    lat: lat,
    lng: lng
  }
  if(!this.marker){
    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      animation: google.maps.Animation.DROP
    })
  }else{
    this.marker.setPosition(latLng)
  }

    this.map.setCenter(latLng)
    this.openInfoWindow(data);

}

openInfoWindow(data?: LocationModel)
{
  if(!data){
    let name = "You are Here!"
    this.infoWindow = new google.maps.InfoWindow({
      content: `<div class="content" style="color:black; width: 100% !important; border-style: solid; padding: 15px;"> 
      <h5 style="color:black; text-align:center;">${name}</h5> 
      </div>`
      });
  }else{
    this.infoWindow = new google.maps.InfoWindow({
      content: `<div class="content" style="color:black; width: 40vw !important; border-style: solid; padding: 15px;"> 
      <div>
      <h3 style="border-bottom: solid red; width: 100%">${data.name}</h3> 
      </div>
      <h6>${data.address}</h6>
      <p>Rating: ${data.rating}</p>
      </div>`
      });
   }

  this.marker.addListener("click", () => {
    this.infoWindow.open(this.map, this.marker)
  });
}

detectFocus(){
  this.isFocus = !this.isFocus;
}
loseFocus(){
}
}
