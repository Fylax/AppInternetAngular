import {Component, OnDestroy, OnInit, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {first} from "rxjs/operators";

@Component({
  selector: 'error',
  styleUrls: ['./error.component.css'],
  templateUrl: './error.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ErrorComponent implements OnInit, OnDestroy {

  error: number;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    document.body.classList.add('error');
    this.route.paramMap.pipe(first())
        .subscribe((params: ParamMap) => {
          this.error = parseInt(params.get('id'), 10);
        });
  }


  ngOnDestroy(): void {
    document.body.classList.remove('error');
  }
}
