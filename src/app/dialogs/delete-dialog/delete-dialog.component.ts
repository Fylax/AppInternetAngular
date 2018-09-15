import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ArchiveService} from '../../services/archive.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  /**
   * Specify which archive will be deleted
   */
  archiveId;
  /**
   * emits the status of the delete response
   */
  responseStatus = new EventEmitter();

  constructor(private dialogRef: MatDialogRef<DeleteDialogComponent>,
              private archiveService: ArchiveService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.archiveId = data.archiveId;
  }

  ngOnInit() {
  }

  /**
   * send the delete request to backend and emitsthe response status
   */
  deleteArchive() {
    this.archiveService.deleteArchive(this.archiveId).subscribe(
        response => {
          this.responseStatus.emit(response.status);
        },
        error => {
          this.responseStatus.emit(error.status);
        });
  }

}
