import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {ArchiveService} from '../../services/archive.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
    displayedColumns = ['countPositions', 'purchased'];

    archiveList = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private router: Router,
                private archiveService: ArchiveService,
                private snackBar: MatSnackBar) {
            this.archiveList = this.archiveService.approximatedArchiveSelectedList;
    }

    sendConfirmation() {
        this.archiveService.confirmPurchaseArchives(this.archiveList).subscribe(
            response => {
            this.router.navigate(['search']);
        },
        error => {
            let message = 'Errore nel caricamento dell\'archivio';
            if (error.status === 500) {
                message = 'Internal Server Error';
            }
            this.openSnackBar(message);
        }
        );
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, '', {
            duration: 2000,
        });
    }

}

