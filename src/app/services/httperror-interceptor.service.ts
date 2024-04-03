import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, retry, delay, takeWhile } from "rxjs/operators";
import { AlertyfyService } from "./alertyfy.service";

@Injectable({
    providedIn: "root"
})

export class HttpErrorInterceptorService implements HttpInterceptor{

    constructor(private alertify: AlertyfyService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Http Request Started");
        return next.handle(request)
        .pipe(
            retry(10), // Retry the request up to 2 times
            delay(1000), // Delay between retry attempts in milliseconds
            catchError((error: HttpErrorResponse) => {
            const errorMessage = this.setError(error)
            console.log(error);
            this.alertify.error(errorMessage);
            return new Observable<HttpEvent<any>>(observer => {
                observer.error(errorMessage);
            });
            takeWhile((event: HttpEvent<any>) => !(event instanceof HttpErrorResponse))
        }));
    }
 

    setError(error: HttpErrorResponse) : string{
        let errorMessage = "Some unknown error occured";
        if(error.error instanceof ErrorEvent)
        {
            //client side error
            errorMessage = error.error.message;
        }
        else
        { 
            //server side error
            if(error.status === 401)
            {
                return error.statusText;
            }
            //server side error
            if(error.error.errorMessage && error.status !==0)
            {
                {errorMessage = error.error.errorMessage;}
            }
            //if the errormessage is empty then show the plain text as errorMessage
            if(!error.error.errormessage && error.error && error.status !==0)
            {
                {errorMessage = error.error;}
            }
        }
        return errorMessage;
    }
}