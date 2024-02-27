import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HousingService } from 'src/app/services/housing.service';
import { Property } from 'src/app/model/property';
import { GalleryItem } from '@daelmaak/ngx-gallery';


@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
 public propertyID!: number;
 property = new Property();
  constructor(private route: ActivatedRoute,
    private router: Router,
    private housingService: HousingService) { }   
     
    galleryImages: GalleryItem[] = [];

  ngOnInit() {
    this.propertyID =  + this.route.snapshot.params['id']; //Number(this.route.snapshot.params['id']);
  
    this.route.params.subscribe(
      (params) => {
       // this.propertyID  = + params['id'];
       this.propertyID = +params['id'];
        this.housingService.getProperty(this.propertyID).subscribe(
          (data: any) => {
            if (data) {
              this.property = data as Property;
            }
          },error => this.router.navigate(['/'])
        );
      }
    )  

    this.galleryImages = [
      {
        src: 'assets/Images/prop-1.jpg',
        thumbSrc:
          'assets/Images/prop-1.jpg',
      },
      {
        src: 'assets/Images/prop-2.jpg',
        thumbSrc:
          'assets/Images/prop-2.jpg',
      },
      {
        src: 'assets/Images/prop-3.jpg',
        thumbSrc:
          'assets/Images/prop-3.jpg',
      },
      {
        src: 'https://cdn.pixabay.com/photo/2020/05/11/18/49/island-5159729_960_720.jpg',
        thumbSrc:
          'https://cdn.pixabay.com/photo/2020/05/11/18/49/island-5159729_960_720.jpg',
      },
      {
        src: 'https://cdn.pixabay.com/photo/2013/11/15/23/18/john-work-garrett-library-211375_960_720.jpg',
        thumbSrc:
          'https://cdn.pixabay.com/photo/2013/11/15/23/18/john-work-garrett-library-211375_960_720.jpg',
      },
    ];
    
  }

  // onSelectNext()
  // {
  //   this.propertyID += 1
  //   this.router.navigate(['property-detail/',this.propertyID]);
  // }
  
}