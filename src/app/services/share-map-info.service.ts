import {Injectable} from '@angular/core';
import {UserSearchRequest} from '../model/UserSearchRequest';
import {Observable} from 'rxjs/internal/Observable';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Moment} from 'moment';
import {Marker, Polygon} from 'leaflet';
import {UserRequest} from '../model/UserRequest';

@Injectable({
    providedIn: 'root'
})
export class ShareMapInfoService {

    private customerRequest_: UserSearchRequest;
    private userRequest_: UserRequest;

    private allSet_ = new BehaviorSubject<boolean>(false);
    private infoUserSet_ = new BehaviorSubject<boolean>(false);

    private polygon_ = new BehaviorSubject<boolean>(false);
    private marker_ = new BehaviorSubject<boolean>(false);

    private startDate_ = new BehaviorSubject<boolean>(false);
    private startHour_ = new BehaviorSubject<boolean>(false);
    private startMinutes_ = new BehaviorSubject<boolean>(false);

    private endDate_ = new BehaviorSubject<boolean>(false);
    private endHour_ = new BehaviorSubject<boolean>(false);
    private endMinutes_ = new BehaviorSubject<boolean>(false);

    constructor() {
        this.customerRequest_ = new UserSearchRequest();
        this.userRequest_ = new UserRequest();
        this.polygon_.subscribe(() => this.checkAllSet());
        this.startDate_.subscribe(() => this.checkAllSet());
        this.startHour_.subscribe(() => this.checkAllSet());
        this.startMinutes_.subscribe(() => this.checkAllSet());
        this.endDate_.subscribe(() => this.checkAllSet());
        this.endHour_.subscribe(() => this.checkAllSet());
        this.endMinutes_.subscribe(() => this.checkAllSet());
    }

    private checkAllSet(): void {
        if (this.polygon_.getValue() && this.startDate_.getValue() &&
            this.startHour_.getValue() && this.startMinutes_.getValue() &&
            this.endDate_.getValue() && this.endHour_.getValue() &&
            this.endMinutes_.getValue()) {
            this.allSet_.next(true);
        } else if (this.startDate_.getValue() &&
            this.startHour_.getValue() && this.startMinutes_.getValue() &&
            this.endDate_.getValue() && this.endHour_.getValue() &&
            this.endMinutes_.getValue()) {
            this.infoUserSet_.next(true);
        } else {
            this.allSet_.next(false);
            this.infoUserSet_.next(false);
        }
    }

    set polygon(area: Polygon | null) {
        if (area === null) {
            this.polygon_.next(false);
        } else {
            this.customerRequest_.area = area;
            this.polygon_.next(true);
        }
    }

    set marker(point: Marker | null) {
        if (point === null) {
            this.marker_.next(false);
        } else {
            // TODO add point into list markersUser???
            this.marker_.next(true);
        }
    }

    get customerRequest() {
        return this.customerRequest_;
    }

    get userRequest() {
        return this.userRequest_;
    }

    get polygon(): Polygon {
        return (this.polygon_.getValue()) ? this.customerRequest_.area : undefined;
    }

    set startDate(date: Moment) {
        this.customerRequest_.start.setFullYear(date.year(), date.month(), date.date());
        this.userRequest_.start.setFullYear(date.year(), date.month(), date.date());
        this.startDate_.next(true);
    }
    set startHours(hours: number) {
        if (isNaN(hours)) {
            this.startHour_.next(false);
        } else {
            this.customerRequest_.start.setHours(hours);
            this.userRequest_.start.setHours(hours);
            this.startHour_.next(true);
        }
    }

    set startMinutes(minutes: number) {
        if (isNaN(minutes)) {
            this.startMinutes_.next(false);
        } else {
            this.customerRequest_.start.setMinutes(minutes);
            this.userRequest_.start.setMinutes(minutes);
            this.startMinutes_.next(true);
        }
    }

    set endDate(date: Moment) {
        this.customerRequest_.end.setFullYear(date.year(), date.month(), date.date());
        this.userRequest_.end.setFullYear(date.year(), date.month(), date.date());
        this.endDate_.next(true);
    }

    set endHours(hours: number) {
        if (isNaN(hours)) {
            this.endHour_.next(false);
        } else {
            this.customerRequest_.end.setHours(hours);
            this.userRequest_.end.setHours(hours);
            this.endHour_.next(true);
        }
    }

    set endMinutes(minutes: number) {
        if (isNaN(minutes)) {
            this.endMinutes_.next(false);
        } else {
            this.customerRequest_.end.setMinutes(minutes);
            this.userRequest_.end.setMinutes(minutes);
            this.endMinutes_.next(true);
        }
    }

    get dateReady(): BehaviorSubject<boolean> {
        return this.allSet_;
    }

    get infoUserReady(): BehaviorSubject<boolean> {
        return this.infoUserSet_;
    }

    set customerRequest(cr: UserSearchRequest) {
        this.customerRequest_ = cr;
    }

    set userRequest(ur: UserRequest) {
        this.userRequest_ = ur;
    }

    reset(): void {
        this.customerRequest = new UserSearchRequest();
    }
}
