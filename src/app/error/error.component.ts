import {AfterViewInit, Component, OnInit} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {first, tap} from "rxjs/operators";

@Component({
  selector: 'error',
  styles: ['div {display: flex; flex-direction: column; justify-content: center; height: 100%;}' +
  'img {position:absolute;left: 50%; margin-left: -350px}'],
  template: '<div><img src="https://http.cat/{{error}}" /></div>'
})
export class ErrorComponent implements OnInit, AfterViewInit {

  error: number;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(first())
        .subscribe((params: ParamMap) => {
          this.error = parseInt(params.get('id'), 10);
        });
  }

  ngAfterViewInit(): void {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
    document.body.style.backgroundColor = 'black';
  }
}
