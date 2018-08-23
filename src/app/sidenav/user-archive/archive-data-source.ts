import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {Archive} from "../../model/archive";
import {ArchiveService} from "../../services/archive.service";
import {ArchivesPaginationSupport} from "../../model/archives-pagination-support";


export class ArchiveDataSource implements DataSource<Archive> {

    private archiveSubject = new BehaviorSubject<Archive[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private total = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private archiveService: ArchiveService) {}

    connect(collectionViewer: CollectionViewer): Observable<Archive[]> {
        return this.archiveSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.loadingSubject.complete();
        this.archiveSubject.complete();
    }

    loadArchive(pageIndex = 1, pageSize = 3, userId?: string) {
        this.loadingSubject.next(true);

        this.archiveService.getArchiveList(pageIndex, pageSize, userId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: ArchivesPaginationSupport) => {
                this.archiveSubject.next(response.items);
                this.total.next(response.totalElements);
            });
    }

    get resultLength(): BehaviorSubject<number> {
        return this.total;
    }
}
