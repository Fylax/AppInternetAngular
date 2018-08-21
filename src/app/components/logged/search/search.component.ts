import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  data = [{x: new Date(1533892140 * 1000), y: 0},
    {x: new Date(1533895740 * 1000), y: 0}, {x: new Date(1533895800 * 1000), y: 0},
    {x: new Date(1533895860 * 1000), y: 0}];
  chart = [];
  userList: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers',
    'Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  userSelected = [];

  ngOnInit(): void {
    this.userSelected = this.userList;
    this.chart = new Chart('canvas', {
      type: 'scatter',
      data: {
        datasets: [
          {
            data: this.data,
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

  onSelectionChange(users) {
    console.log(users.selectedOptions.selected);
  }

  selectAll(users) {
    users.selectAll();
    // this.userSelected = this.userList;
  }

  deselectAll(users) {
    users.deselectAll();
    // this.userSelected = [];
  }

}
