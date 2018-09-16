import {Component} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
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

  /**
   * Send the book confirmation to server
   * If the operation terminate succesfully route to purchases view,
   * otherwise back to search view
   */
  sendConfirmation() {
    this.archiveService.approximatedArchiveSelectedList = [];
    this.archiveService.confirmPurchaseArchives(this.archiveList).subscribe(
        response => {
          const config = new MatSnackBarConfig();
          config.panelClass = ['blue-snackbar'];
          config.duration = 5000;
          this.openSnackBar("Operazione di acquisto eseguita", config);
          this.router.navigateByUrl('purchases');
        },
        error => {
          const config = new MatSnackBarConfig();
          config.panelClass = ['red-snackbar'];
          config.duration = 5000;
          let message = 'Errore nell\'operazione di acquisto';
          if (error.status === 500) {
            message = 'Internal Server Error';
          }
          this.openSnackBar(message, config);
          this.router.navigateByUrl('search');
        }

    );
  }

  /**
   * Get the total amount to pay
   */
  getAmount() {
    let total = 0;
    for (const ar of this.archiveList) {
      total += ar.amount;
    }
    return total.toFixed(2);
  }

  /**
   * Visualize a message in a snackbar
   * @param message
   * @param config: snackbar configuration
   */
  private openSnackBar(message: string, config: MatSnackBarConfig) {
    this.snackBar.open(message, 'Chiudi', config);
  }

}

