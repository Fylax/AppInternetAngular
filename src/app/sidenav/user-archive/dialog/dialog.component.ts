import {Component, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {forkJoin} from 'rxjs';
import {ArchiveService} from '../../../services/archive.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  @ViewChild('file') file;
  fileToUpload: File;

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              public uploadService: ArchiveService) {
  }

  addFile() {
    this.file.nativeElement.click();
  }

  onFileAdded() {
    this.fileToUpload = this.file.nativeElement.files[0];
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.fileToUpload);

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // // When all progress-observables are completed...
    forkJoin(this.progress).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;

      this.dialogRef.close();
    });
  }





}
