import {Component, OnInit} from '@angular/core';
import {Urls, UrlService} from "../../../services/url.service";
import {FileUploader, FileUploaderOptions, FilterFunction} from 'ng2-file-upload';
import {UserTokenService} from "../../../services/user.service";
import {FileLikeObject} from "ng2-file-upload/file-upload/file-like-object.class";

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
    const filter: FilterFunction = {
      name: 'json',
      fn: (item: FileLikeObject) => {
        const name = item.name;
        return (name.lastIndexOf('json') === name.length - 4);
      }
    };
    baseService.promise.then((urlList: Urls) =>
        this.uploader.setOptions({
          url: urlList.userPositions.href,
          disableMultipart: true,
          authToken: `Bearer ${user.accessToken}`,
          filters: [filter]
        })
    );
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit() {
  }

}
