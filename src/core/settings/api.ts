import {defer, Observable} from 'rxjs';
import initializeAxios from './axios-setup';
import { axiosRequestConfiguration, axiosRequestConfiguration2 } from './config';
import { map } from 'rxjs/operators';

const axiosInstance = initializeAxios(axiosRequestConfiguration);
const axiosInstance2 = initializeAxios(axiosRequestConfiguration2);

const get = <T>(url: string, queryParams?: object): Observable<T> => {
    return defer(()=> axiosInstance.get<T>(url, { params: queryParams }))
        .pipe(map(result => result.data));
};

const post = <T>(url: string, body: any, queryParams?: object): Observable<T | void> => {
    return defer(()=> axiosInstance.post<T>(url, body, { params: queryParams }))
        .pipe(map(result => result.data));
};

const put = <T>(url: string, body: any, queryParams?: object): Observable<T | void> => {
    return defer(()=>axiosInstance.put<T>(url, body, { params: queryParams }))
        .pipe(map(result => result.data));
};

const patch = <T>(url: string, body: any, queryParams?: object): Observable<T | void> => {
    return defer(()=> axiosInstance.patch<T>(url, body, { params: queryParams }))
        .pipe(map(result => result.data));
};

const deleteR = <T>(url: string, id:number): Observable<T | void> => {
    return defer(() => (axiosInstance.delete(`${url}/${id}` )))
        .pipe(map(result => result.data)
    );
};

//BIODATA HTTPS AXIOS CONFIGURATION 

/* const get = <T>(url: string, queryParams?: object): Observable<T> => {
    return defer(()=> axiosInstance.get<T>(url, { params: queryParams }))
        .pipe(map(result => result.data));
}; */

const bioPost = <T>(url: string, body: any, queryParams?: object): Observable<T | void> => {
    return defer(()=> axiosInstance2.post<T>(url, body, { params: queryParams }))
        .pipe(map(result => result.data));
};

/* const put = <T>(url: string, body: any, queryParams?: object): Observable<T | void> => {
    return defer(()=>axiosInstance.put<T>(url, body, { params: queryParams }))
        .pipe(map(result => result.data));
};

const patch = <T>(url: string, body: any, queryParams?: object): Observable<T | void> => {
    return defer(()=> axiosInstance.patch<T>(url, body, { params: queryParams }))
        .pipe(map(result => result.data));
};

const deleteR = <T>(url: string, id:number): Observable<T | void> => {
    return defer(() => (axiosInstance.delete(`${url}/${id}` )))
        .pipe(map(result => result.data)
    );
}; */

export default { get, post, put, patch, delete: deleteR, bioPost };