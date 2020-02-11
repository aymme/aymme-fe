import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";

import * as servicesActions from "./services.actions";
import { concatMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { HomeService } from "../../shared/home.service";

@Injectable()
export class ServicesEffects {
  constructor(private actions$: Actions, private homeService: HomeService) {}

  @Effect()
  loadServices$ = this.actions$.pipe(
    ofType(servicesActions.ServicesActionTypes.LoadServices),
    concatMap((action: servicesActions.LoadServices) =>
      this.homeService.getServices().pipe(
        map(
          (services: any[]) => new servicesActions.LoadServicesSuccess(services)
        ),
        catchError(err => of(new servicesActions.LoadServicesFailure(err)))
      )
    )
  );

  @Effect()
  loadSelectedEndpoint$ = this.actions$.pipe(
    ofType(servicesActions.ServicesActionTypes.LoadSelectedEndpoint),
    concatMap((action: servicesActions.LoadSelectedEndpoint) =>
      this.homeService.getEndpoint(action.payload.id).pipe(
        map(
          (endpoint: any) => new servicesActions.LoadEndpointSuccess(endpoint)
        ),
        catchError(err => of(new servicesActions.LoadEndpointFailure(err)))
      )
    )
  );
}
