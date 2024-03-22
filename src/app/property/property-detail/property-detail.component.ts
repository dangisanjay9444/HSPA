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
 public mainPhotoUrl?:string ;
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
              this.property.age  = this.housingService.getPropertyAge(this.property.estPossessionOn);
              console.log(this.property.photos)
              console.log(this.getPropertyPhotos())

              // Assign galleryImages inside the subscription block
          this.galleryImages = this.getPropertyPhotos();
            }
          },error => this.router.navigate(['/'])
        );
      }
    )        

    // this.galleryImages = [
    //   {
    //     src: 'assets/Images/prop-1.jpg',
    //     thumbSrc:
    //       'assets/Images/prop-1.jpg',
    //   },
    //   {
    //     src: 'assets/Images/prop-2.jpg',
    //     thumbSrc:
    //       'assets/Images/prop-2.jpg',
    //   },
    //   {
    //     src: 'assets/Images/prop-3.jpg',
    //     thumbSrc:
    //       'assets/Images/prop-3.jpg',
    //   },
    //   {
    //     src: 'https://cdn.pixabay.com/photo/2020/05/11/18/49/island-5159729_960_720.jpg',
    //     thumbSrc:
    //       'https://cdn.pixabay.com/photo/2020/05/11/18/49/island-5159729_960_720.jpg',
    //   },
    //   {
    //     src: 'https://cdn.pixabay.com/photo/2013/11/15/23/18/john-work-garrett-library-211375_960_720.jpg',
    //     thumbSrc:
    //       'https://cdn.pixabay.com/photo/2013/11/15/23/18/john-work-garrett-library-211375_960_720.jpg',
    //   },
    // ];    
    
  }

  getPropertyPhotos(): { src: string; thumbSrc: string }[] {
    const photoUrls: { src: string; thumbSrc: string }[] = [];
    // Check if this.property.photos is defined
    if (this.property && this.property.photos) {
        for (const photo of this.property.photos) {

           if(photo.isPrimary)
           {
            this.mainPhotoUrl = photo.imageUrl;
           }
           else
           {
              photoUrls.push({
                 src: photo.imageUrl,
                 thumbSrc: photo.imageUrl
              });
            }
          }
      }
    return photoUrls;
  }

  // onSelectNext()
  // {
  //   this.propertyID += 1
  //   this.router.navigate(['property-detail/',this.propertyID]);
  // }
  
}
