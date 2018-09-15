import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {ArchiveService} from '../../services/archive.service';
import {PurchaseService} from '../../services/purchase.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  displayedColumns = ['archiveId', 'countPositions', 'amount', 'purchased'];

  archiveList = [];

  constructor(private router: Router,
              private archiveService: ArchiveService,
              private purchaseService: PurchaseService,
              private snackBar: MatSnackBar) {
    if (this.archiveService.approximatedArchiveSelectedList.length === 0) {
      this.router.navigate(['/search']);
    }
    this.archiveList = this.archiveService.approximatedArchiveSelectedList;
  }

  sendConfirmation() {
    this.archiveService.approximatedArchiveSelectedList = [];
    this.archiveService.confirmPurchaseArchives(this.archiveList).subscribe(
        response => {
          this.router.navigate(['purchases']);
        },
        error => {
          let message = 'Errore nell\'operazione di acquisto';
          if (error.status === 500) {
            message = 'Internal Server Error';
          }
          this.openSnackBar(message);
          this.router.navigate(['search']);
        }

    );
  }

  getAmount() {
    let total = 0;
    for (const ar of this.archiveList) {
      total += ar.amount;
    }
    return total.toFixed(2);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }

}

