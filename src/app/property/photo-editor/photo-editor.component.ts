import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileSelectDirective, FileDropDirective,FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/model/photo';
import { Property } from 'src/app/model/property';
import { HousingService } from 'src/app/services/housing.service';
import { environment } from 'src/environments/environment';
import { AlertyfyService } from 'src/app/services/alertyfy.service'

@Component({
  selector: 'app-photo-editor',  
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() Property !: Property;
  @Output() mainPhotoChangedEvent = new EventEmitter<string>();

    uploader!: FileUploader;
    hasBaseDropZoneOver!: boolean;
    baseURL = environment.baseUrl;
    maxAllowedFileSize = 10*1024*1024;
    response !: string;


    constructor(private housingService:HousingService, private alertyfy:AlertyfyService){}

    public fileOverBase(e: any): void {
      this.hasBaseDropZoneOver = e;
  }

  initializeFileUploader() {    
      this.uploader = new FileUploader({
          url: this.baseURL +'/property/add/photo/'+ String(this.Property.id),
          authToken: 'Bearer '+ localStorage.getItem('token'),
          isHTML5: true,
          allowedFileType: ['image'],
          removeAfterUpload: true,
          autoUpload: true,
          maxFileSize:this.maxAllowedFileSize
      });   

      this.uploader.onAfterAddingFile = (file) => {
          file.withCredentials = false;
      };

      this.uploader.onSuccessItem = (item, response, status, headers) => {
          if (response) {
              const photo = JSON.parse(response);
              this.Property.photos?.push(photo);
          }
      };

      this.uploader.onErrorItem = (item, response, status, headers) => {          
          
          let errorMessage = 'Some unknown error occured';
          if (status===401) {
              errorMessage ='Your session has expired, login again';
          }

          if (response) {
              errorMessage = response;
          }

          this.alertyfy.error(errorMessage);
      };
  }

  mainPhotoChanged(url: string){
      this.mainPhotoChangedEvent.emit(url);
  }

  ngOnInit(): void {     
      
  }

  ngOnChanges(){    
    this.initializeFileUploader();
  }

    setPrimaryPhoto(propertyId:number, photo:Photo)
    {
      this.housingService.setPropertyPhoto(propertyId,photo.publicId).subscribe(()=>{
        this.mainPhotoChanged(photo.imageUrl);
        this.Property.photos?.forEach(p => {
          if(p.isPrimary)
            {p.isPrimary = false}
          if(p.publicId === photo.publicId)
          {
            p.isPrimary = true;
          }
        })
      });
    }

    deletePhoto(propertyId:number, photo:Photo)
    {
      this.housingService.deletePhoto(propertyId,photo.publicId).subscribe(()=>{
        this.Property.photos = this.Property.photos?.filter(p =>{
          p.publicId != photo.publicId
        })
      });
    }
}
