import {Component, HostListener, OnInit} from '@angular/core';
import {Chart} from 'chart.js';
import {UserSearchRequest} from '../../model/user-search-request';
import {ArchiveService} from '../../services/archive.service';
import {ApproximatedArchive} from '../../model/approximated-archive';
import {FullScreenSpinnerService} from '../../full-screen-spinner/full-screen-spinner.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  /**
   * timeline graph
   */
  chart;
  /**
   * list of users
   */
  userList = [];
  /**
   * list of selected users
   */
  userSelected = [];

  /**
   * associate a color to a user
   */
  private colorByUser = new Map();

  /**
   * data passed to populate the timeline
   */
  private datasets;
  /**
   * check if dates are valid
   */
  datesValid: boolean;

  /**
   * variable used to check if the system is loading data from the backend server
   */
  loading: boolean;
  /**
   * the map height to be passed to map component as input
   */
  map_height: string;

  /**
   * map used to associate user and timestap list
   */
  private userMap = new Map();

  /**
   * counter archive selected
   */
  counterPositionsSelected: number;

  /**
   * object that wrap a user request (polygon and start and end dates)
   */
  userSearchReq: UserSearchRequest;

  /**
   * approximated archive list retrieved from the backend
   */
  private approximatedArchiveList: ApproximatedArchive[];

  /**
   * approximated archives selected by the user
   */
  approximatedArchiveSelectedList: ApproximatedArchive[];

  first: boolean;

  constructor(private archiveService: ArchiveService,
              private spinner: FullScreenSpinnerService,
              private snackBar: MatSnackBar) {
    this.userSearchReq = this.archiveService.userSearchRequest;
    this.datesValid = true;
    this.counterPositionsSelected = 0;
    this.first = true;
  }

  ngOnInit(): void {
    let topHeight = 192;
    if (window.innerWidth < 959) {
      topHeight = 262;
    }
    this.map_height = (window.innerHeight - topHeight).toLocaleString() + 'px';
    this.chart = new Chart('canvas', {
      type: 'scatter',
      data: {
        datasets: []
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                hour: 'H:MM'
              },
              min: this.archiveService.userSearchRequest.start,
              max: this.archiveService.userSearchRequest.end
            },
          }],
          yAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              display: false
            }
          }]
        }
      }
    });
    this.loading = true;
    this.spinner.hideSpinner();
  }

  /**
   * this method intercepts the windows resize event and computes the map-height
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let topHeight = 192;
    if (event.target.innerWidth < 959) {
      topHeight = 262;
    }
    this.map_height = (event.target.innerHeight - topHeight).toLocaleString() + 'px';
  }

  /**
   * select all user in list
   */
  selectAll() {
    this.userSelected = this.userList;
    this.setTimeline();
    this.setApproximatedArchives();
  }

  /**
   * select none
   */
  deselectAll() {
    this.userSelected = [];
    this.setTimeline();
    this.counterPositionsSelected = 0;
    this.approximatedArchiveSelectedList = [];
    this.archiveService.approximatedArchiveSelectedList = [];
  }

  /**
   * Each time a user is selected or deselected from the list recompute the list of archive selected
   */
  onSelectionChange() {
    this.setTimeline();
    this.setApproximatedArchives();
  }

  /**
   * Called when a new polygon is emitted from the map component
   * @param p
   */
  onPolygonReady(p: L.Polygon) {
    this.archiveService.userSearchRequest.area = p;
    this.getArchives();
  }

  /**
   * Process the list of approximated archives
   * fill map user-timestamps and call method to set timeline
   * @param archives
   */
  setUsersMap(archives: ApproximatedArchive[]) {
    this.userMap = new Map();
    this.userList = [];
    for (const archive of archives) {
      archive.color = this.getColorByUserID(archive.username);
      if (this.userMap.has(archive.username)) {
        const timestampList = this.userMap.get(archive.username).concat(archive.timestamps);
        this.userMap.set(archive.username, timestampList);
      } else {
        this.userMap.set(archive.username, archive.timestamps);
        this.userList.push(archive.username);
      }
    }
    if (this.userSelected.length === 0
        || this.userList.length === 0
        || this.userSelected.length > this.userList.length) {
      this.userSelected = this.userList;
    }
    if (this.first && this.userList.length === 0) {
      this.first = false;
      const config = new MatSnackBarConfig();
      config.panelClass = ['red-snackbar'];
      config.duration = 10000;
      this.snackBar.open(
          'Nessun archivio presente! Cambia le date oppure muovi e allarga la mappa per effettuare una nuova ricerca',
          'Chiudi',
            config);
    }
    this.setApproximatedArchives();
    this.setTimeline();
  }

  /**
   * method to fill timeline with timestamps
   */
  private setTimeline() {
    this.datasets = new Map();
    for (const user of this.userSelected) {
      const timeDates = [];
      for (const timestamp of this.userMap.get(user)) {
        timeDates.push({x: timestamp * 1000, y: 0});
      }
      const color = this.getColorByUserID(user);
      this.datasets.set(user, {
        data: timeDates,
        pointRadius: 8,
        pointBorderColor: color,
        pointBackgroundColor: color
      });
    }
    this.chart.data.datasets = Array.from(this.datasets.values());
    this.chart.options.scales.xAxes[0].time.min = this.archiveService.userSearchRequest.start;
    this.chart.options.scales.xAxes[0].time.max = this.archiveService.userSearchRequest.end;
    this.chart.update();
  }

  /**
   * get the color for the given user
   * @param userId
   */
  private getColorByUserID(userId) {
    if (this.colorByUser.has(userId)) {
      return this.colorByUser.get(userId);
    }
    let color;
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    color = 'rgba(' + r + ' ,' + g + ',' + b + ', 0.8)';
    this.colorByUser.set(userId, color);
    return color;
  }

  /**
   * retrieve approximated archives from backend
   */
  getArchives() {
    if (this.datesValid) {
      this.loading = true;
      this.archiveService.searchArchives(this.archiveService.userSearchRequest)
          .subscribe(aaList => {
            this.approximatedArchiveList = aaList;
            this.setUsersMap(aaList);
            this.loading = false;
          });
    }
  }

  /**
   * set the approximated archives selected
   */
  private setApproximatedArchives() {
    this.counterPositionsSelected = 0;
    this.approximatedArchiveSelectedList = this.approximatedArchiveList.filter(archive => {
      if (this.userSelected.indexOf(archive.username) > -1) {
        this.counterPositionsSelected = this.counterPositionsSelected + archive.positions.length;
        return archive;
      }
    });
    this.archiveService.approximatedArchiveSelectedList = this.approximatedArchiveSelectedList;
  }
}
