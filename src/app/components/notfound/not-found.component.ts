import {AfterViewInit, Component} from "@angular/core";

@Component({
  selector: 'not-found',
  styles: ['div {display: flex; flex-direction: column; justify-content: center; height: 100%;}' +
  'img {position:absolute;left: 50%; margin-left: -350px}'],
  template: '<div><img src="https://http.cat/404" /></div>'
})
export class NotFoundComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
    document.body.style.backgroundColor = 'black';
  }
}
