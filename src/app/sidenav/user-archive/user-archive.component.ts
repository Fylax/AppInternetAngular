import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ArchiveDataSource} from './archive-data-source';
import {first, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ArchiveService} from '../../services/archive.service';
import {Subscription} from 'rxjs';
import {MatDialog, MatPaginator, MatSnackBar} from '@angular/material';
import {saveAs} from 'file-saver';
import {DeleteDialogComponent} from '../../dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-user-archive',
  templateUrl: './user-archive.component.html',
  styleUrls: ['./user-archive.component.css']
})
export class UserArchiveComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['archiveId', 'timestamp', 'counter', 'delete', 'download'];
  dataSource: ArchiveDataSource;

  private subscription: Subscription;
  resultsLength: number;
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
    this.dataSource.loadArchive(1, 1);
  }

  displayPaginator() {
    if (this.resultsLength > 10) {
      return 'block';
    } else {
      return 'none';
    }
  }

  ngAfterViewInit(): void {
    this.paginator.page
        .pipe(
            tap(() => this.loadArchivesPage())
        )
        .subscribe();
  }

  loadArchivesPage() {
    this.dataSource.loadArchive(
        this.paginator.pageIndex + 1,
        this.paginator.pageSize);
  }

  ngOnDestroy(): void {
    this.paginator.page.unsubscribe();
    this.subscription.unsubscribe();
  }

  deleteArchive(archiveId: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '50%', height: '25%',
      data: {
        archiveId: archiveId,
      }
    });
    dialogRef.componentInstance.responseStatus.subscribe(status => {
      let message = 'Impossibile eliminare l\'archivio, prova di nuovo';
      if (status === 200) {
        message = 'Archivio eliminato con successo';
        this.loadArchivesPage();
      }
      this.openSnackBar(message);
    });
  }

  downloadArchive(archiveId: string): void {
    this.archiveService.downloadArchive(archiveId).subscribe(data => {
      data = JSON.stringify(data.positionList, undefined, 2);
      const blob = new Blob([data], {type: 'application/json'});
      saveAs(blob, archiveId);
    });
  }

  openUpload() {
    this.file.nativeElement.click();
  }

  onFileUpload() {
    this.countArchiveToUpload = this.countArchiveToUpload + 1;
    this.archiveService.upload(this.file.nativeElement.files[0]).subscribe(
        response => {
          this.countArchiveToUpload = this.countArchiveToUpload - 1;
          if (this.countArchiveToUpload === 0) {
            this.openSnackBar('Operazione di caricamento terminata con successo!');
          }
          this.loadArchivesPage();
        },
        error => {
          this.countArchiveToUpload = this.countArchiveToUpload - 1;
          let message = 'Errore nel caricamento dell\'archivio';
          if (error.status === 400) {
            message = 'L\'archivio è già presente o non rispetta la sintassi';
          }
          this.openSnackBar(message);
        });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }
}
