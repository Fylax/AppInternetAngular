import {Component, HostListener, OnInit} from '@angular/core';
import {Chart} from 'chart.js';
import {UserSearchRequest} from '../../model/user-search-request';
import {ArchiveService} from '../../services/archive.service';
import {finalize, first} from 'rxjs/operators';
import {ApproximatedArchive} from '../../model/approximated-archive';
import {ShareMapInfoService} from '../../services/share-map-info.service';
import {FullScreenSpinnerService} from '../../full-screen-spinner/full-screen-spinner.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  chart;
  userList = [];
  userSelected = [];

  private colorByUser = new Map();
  private datasets;
  datesValid: boolean;

  loading: boolean;
  map_height: string;

  private userMap = new Map();

  counterPositionsSelected: number;

  userSearchReq: UserSearchRequest;
  private approximatedArchiveList: ApproximatedArchive[];
  approximatedArchiveSelectedList: ApproximatedArchive[];

  constructor(private archiveService: ArchiveService, private shareInfoService: ShareMapInfoService,
              private spinner: FullScreenSpinnerService) {
    this.userSearchReq = new UserSearchRequest();
    this.datesValid = true;
    this.counterPositionsSelected = 0;
  }

  ngOnInit(): void {
    let topHeight = 130;
    if (window.innerWidth < 959) {
      topHeight = 200;
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
              min: this.shareInfoService.userSearchRequest.start,
              max: this.shareInfoService.userSearchRequest.end
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let topHeight = 130;
    if (event.target.innerWidth < 959) {
      topHeight = 200;
    }
    this.map_height = (event.target.innerHeight - topHeight).toLocaleString() + 'px';
  }


  selectAll() {
    this.userSelected = this.userList;
    this.setTimeline();
    this.setApproximatedArchives();
  }

  deselectAll() {
    this.userSelected = [];
    this.setTimeline();
    this.counterPositionsSelected = 0;
    this.approximatedArchiveSelectedList = [];
  }

  onSelectionChange() {
    this.setTimeline();
    this.setApproximatedArchives();
  }

  onPolygonReady(p: L.Polygon) {
    this.userSearchReq.area = p;
    this.getArchives();
  }

  setUsersMap(archives: ApproximatedArchive[]) {
    this.userMap = new Map();
    // this.userList = [];
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
    this.setApproximatedArchives();
    this.setTimeline();
  }

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
        pointRadius: 5,
        pointBorderColor: color,
        pointBackgroundColor: color
      });
    }
    this.chart.data.datasets = Array.from(this.datasets.values());
    this.chart.options.scales.xAxes[0].time.min = this.userSearchReq.start;
    this.chart.options.scales.xAxes[0].time.max = this.userSearchReq.end;
    this.chart.update();

  }

  private getColorByUserID(userId) {
    if (this.colorByUser.has(userId)) {
      return this.colorByUser.get(userId);
    }
    let color;
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    color = 'rgba(' + r + ' ,' + g + ',' + b + ', 0.5)';
    this.colorByUser.set(userId, color);
    return color;
  }

  private getArchives() {
    if (this.datesValid) {
      this.loading = true;
      this.archiveService.searchArchives(this.userSearchReq)
          .subscribe(aaList => {
            this.approximatedArchiveList = aaList;
            this.setUsersMap(aaList);
            this.loading = false;
          });
    }
  }


  private setApproximatedArchives() {
    this.counterPositionsSelected = 0;
    this.approximatedArchiveSelectedList = this.approximatedArchiveList.filter(archive => {
      if (this.userSelected.indexOf(archive.username) > -1) {
        this.counterPositionsSelected = this.counterPositionsSelected + archive.positions.length;
        return archive;
      }
    });
  }
}
