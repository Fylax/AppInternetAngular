import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js';
import {UserSearchRequest} from '../../../model/user-search-request';
import {ArchiveService} from '../../../services/archive.service';
import {first} from 'rxjs/operators';
import {ApproximatedArchive} from '../../../model/approximated-archive';

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

  userMap = new Map();

  userSearchReq: UserSearchRequest;
  approximatedArchiveList: ApproximatedArchive[];

  constructor(private archiveService: ArchiveService) {
  }

  ngOnInit(): void {
    this.userSearchReq = new UserSearchRequest();
    this.chart = new Chart('canvas', {
      type: 'scatter',
      data: {
        datasets: [
          {
            data: this.timestamps,
            borderColor: '#ffffff',
            pointRadius: 5,
            pointBorderColor: 'rgba(0, 0, 0, 0.2)',
            pointBackgroundColor: 'rgba(0, 0, 0, 0.2)'
          }
        ]
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
              min: new Date(1533891140 * 1000),
              max: new Date(1533898860 * 1000)
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
    this.userSelected = this.userList;
  }
}
