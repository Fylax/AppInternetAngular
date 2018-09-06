import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ArchiveDataSource} from './archive-data-source';
import {first, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ArchiveService} from '../../services/archive.service';
import {Subscription} from 'rxjs';
import {MatDialog, MatPaginator, MatSnackBar} from '@angular/material';
import {DialogComponent} from './dialog/dialog.component';
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
  resultsLength = -1;

  userId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private archiveService: ArchiveService,
              route: ActivatedRoute,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    route.queryParams.pipe(first()).subscribe((param) => {
      this.userId = param.customer;
    });
  }

  ngOnInit() {
    this.dataSource = new ArchiveDataSource(this.archiveService);
    this.subscription = this.dataSource.resultLength
        .subscribe(totals => this.resultsLength = totals);
    this.dataSource.loadArchive(1, 10, this.userId);
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
        this.paginator.pageSize,
        this.userId);
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
      let message = 'Archivio eliminato con successo';
      if (status !== 200) {
        message = 'Impossibile eliminare l\'archivio, prova di nuovo';
      }
      this.openSnackBar(message);
      this.loadArchivesPage();
    });
  }

  downloadArchive(archiveId: string): void {
    this.archiveService.downloadArchive(archiveId).subscribe(data => {
      data = JSON.stringify(data.positionList, undefined, 2);
      const blob = new Blob([data], {type: 'application/json'});
      saveAs(blob, archiveId);
    });
  }

  public openUploadDialog() {
    this.dialog.open(DialogComponent, {width: '50%', height: '25%'});
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }
}
