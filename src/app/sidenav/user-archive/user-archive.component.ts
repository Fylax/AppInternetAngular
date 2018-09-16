import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ArchiveDataSource} from './archive-data-source';
import {tap} from 'rxjs/operators';
import {ArchiveService} from '../../services/archive.service';
import {Subscription} from 'rxjs';
import {MatDialog, MatPaginator, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {saveAs} from 'file-saver';
import {DeleteDialogComponent} from '../../dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-user-archive',
  templateUrl: './user-archive.component.html',
  styleUrls: ['./user-archive.component.css']
})
export class UserArchiveComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * The header of mat-table
   */
  displayedColumns = ['archiveId', 'timestamp', 'counter', 'delete', 'download'];
  dataSource: ArchiveDataSource;

  /**
   *Subscribe to the total elements
   */
  private subscription: Subscription;
  resultsLength: number;

  /**
   * Counter of archives in upload
   */
  countArchiveToUpload: number;

  @ViewChild('file') file;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private archiveService: ArchiveService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.dataSource = new ArchiveDataSource(this.archiveService);
    this.subscription = this.dataSource.resultLength
        .subscribe(totals => {
          this.resultsLength = totals;
        });
    this.resultsLength = -1;
    this.countArchiveToUpload = 0;
    this.dataSource.loadArchive(1, 7);
  }

  /**
   * if purchased archives are less the ten the paginator is hidden
   */
  displayPaginator() {
    if (this.resultsLength > 6) {
      return 'block';
    } else {
      return 'none';
    }
  }

  /**
   * The paginator expose a page Observable that emits a new value each time the user clicks on the paginator navigation button
   * So subscribe to this observable in order to load new pages in response to a pagination event
   */
  ngAfterViewInit(): void {
    this.paginator.page
        .pipe(
            tap(() => this.loadArchivesPage())
        )
        .subscribe();
  }

  /**
   * Load archive calling method in datasource class
   */
  loadArchivesPage() {
    this.dataSource.loadArchive(
        this.paginator.pageIndex + 1,
        this.paginator.pageSize);
  }

  ngOnDestroy(): void {
    this.paginator.page.unsubscribe();
    this.subscription.unsubscribe();
  }

  /**
   * Method called when user clicks on the delete button. Open a dialog to confirm the operation.
   * Visualize a message basing on operation result
   * @param archiveId
   */
  deleteArchive(archiveId: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '50%', height: '25%',
      data: {
        archiveId: archiveId,
      }
    });
    dialogRef.componentInstance.responseStatus.subscribe(status => {
      const config = new MatSnackBarConfig();
      config.panelClass = ['red-snackbar'];
      config.duration = 5000;
      let message = 'Impossibile eliminare l\'archivio, prova di nuovo';
      if (status === 200) {
        config.panelClass = ['blue-snackbar'];
        message = 'Archivio eliminato con successo';
        this.loadArchivesPage();
      }
      this.openSnackBar(message, config);
    });
  }

  /**
   * Method called when user clicks on the download button. The response is saved as Blob with name ArchiveId
   * @param archiveId
   */
  downloadArchive(archiveId: string): void {
    this.archiveService.downloadArchive(archiveId).subscribe(data => {
      data = JSON.stringify(data.positionList, undefined, 2);
      const blob = new Blob([data], {type: 'application/json'});
      saveAs(blob, archiveId);
    });
  }

  /**
   * open the dialog to select the archive to be uploaded
   */
  openUpload() {
    this.file.nativeElement.click();
  }

  /**
   * send archive to backend, increment number of archive in upload. When the operation is terminated decrement the counter
   * and visualize a message basing on the operation result
   */
  onFileUpload() {
    this.countArchiveToUpload = this.countArchiveToUpload + 1;
    this.archiveService.upload(this.file.nativeElement.files[0]).subscribe(
        response => {
          this.countArchiveToUpload = this.countArchiveToUpload - 1;
          if (this.countArchiveToUpload === 0) {
            const config = new MatSnackBarConfig();
            config.panelClass = ['blue-snackbar'];
            config.duration = 5000;
            this.openSnackBar('Operazione di caricamento terminata con successo!', config);
          }
          this.loadArchivesPage();
        },
        error => {
          this.countArchiveToUpload = this.countArchiveToUpload - 1;
          const config = new MatSnackBarConfig();
          config.panelClass = ['red-snackbar'];
          config.duration = 5000;
          let message = 'Errore nel caricamento dell\'archivio';
          if (error.status === 400) {
            message = 'L\'archivio è già presente o non rispetta la sintassi';
          }
          this.openSnackBar(message, config);
        });
  }

  private openSnackBar(message: string, config: MatSnackBarConfig) {
    this.snackBar.open(message, 'Chiudi', config);
  }
}
