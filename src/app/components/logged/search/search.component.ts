import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js';
import {UserSearchRequest} from '../../../model/UserSearchRequest';
import {ArchiveService} from '../../../services/archive.service';
import {first} from 'rxjs/operators';
import {ApproximatedArchive} from '../../../model/ApproximatedArchive';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  timestamps: Date[];
  chart = [];
  userList = [];
  userSelected = [];

  datasets = new Map();

  userMap = new Map();

  userSearchReq: UserSearchRequest;
  approximatedArchiveList: ApproximatedArchive[];

  constructor(private archiveService: ArchiveService) {
  }

  ngOnInit(): void {
    this.userSearchReq = new UserSearchRequest();
  }

  selectAll() {
    this.userSelected = this.userList;
  }

  deselectAll() {
    this.userSelected = [];
  }

  onPolygonReady(p: L.Polygon) {
    this.userSearchReq.area = p;
    this.archiveService.searchArchives(this.userSearchReq)
        .pipe(first()).subscribe(aaList => {
      this.approximatedArchiveList = aaList;
      this.setTimestampsMap(aaList);
    });
  }

  setTimestampsMap(archives: ApproximatedArchive[]) {
    for (const archive of archives) {
      if (this.userMap.has(archive.username)) {
        const timestampList = this.userMap.get(archive.username).concat(archive.timestamps);
        this.userMap.set(archive.username, timestampList);
      } else {
        this.userMap.set(archive.username, archive.timestamps);
        this.userList.push(archive.username);
      }
    }
    this.setTimeline();
    this.userSelected = this.userList;
  }

  setTimeline() {
    for (const user of this.userList) {
      const timeDates = []
      for (const timestamp of this.userMap.get(user)) {
        timeDates.push({x: timestamp * 1000, y: 0});
      }
      this.datasets.set(user, {
        data: timeDates,
        pointRadius: 5,
        pointBorderColor: this.getColor(),
        pointBackgroundColor: this.getColor()
      });
    }
    console.log(Array.from(this.datasets.values()));
    this.chart = new Chart('canvas', {
      type: 'scatter',
      data: {
        datasets: Array.from(this.datasets.values())
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
            type: 'time'
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
  }

  getColor() {
    let color;
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    color = 'rgba(' + r + ' ,' + g + ',' + b + ', 0.2)';
    return color;
  }
}
