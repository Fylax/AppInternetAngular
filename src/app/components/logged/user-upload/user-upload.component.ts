import {Component, OnInit} from '@angular/core';
import {Urls, UrlService} from "../../../services/url.service";
import {FileUploader} from 'ng2-file-upload';
import {UserTokenService} from "../../../services/user.service";

@Component({
  selector: 'app-user-upload',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.css']
})
export class UserUploadComponent implements OnInit {

  uploader: FileUploader = new FileUploader({url: ""});
  hasBaseDropZoneOver = false;
  displayedColumns = ['name', 'size', 'action', 'progress'];

  constructor(baseService: UrlService, user: UserTokenService) {
    baseService.promise.then((urlList: Urls) =>
        this.uploader = new FileUploader({
          url: urlList.userPositions.href,
          disableMultipart: true
        }));
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit() {
  }

}
