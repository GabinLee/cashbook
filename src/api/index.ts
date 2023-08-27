import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ResponseData } from '../models/ResponseData.model';
import AppError from '../models/AppError.model';

export const instance = axios.create({
  baseURL: process.env.REACT_APP_HOST_URL,
  timeout: 15000
});

//if(process.env.REACT_APP_MODE !== 'production') instance.interceptors.request.use(AxiosLogger.requestLogger)

instance.interceptors.request.use(async (request) => {

	const token = localStorage.getItem('token')
	if(token !== null)
	request.headers.Authorization = `Bearer ${token}`;

	console.log('[api 호출]', request.url, request.params, request.data)
	
	return request;
})
instance.interceptors.response.use(response => {

	console.log('interceptors.response')

	const data = response.data as ResponseData

	// if(data.message_code === 20002) {
	// 	return Promise.reject(new Error(data.message_code, data.message));
	// }

	return response;
}, async error => {
	const { config, response: { status } } = error;

	console.log('error', status)

	// if(error instanceof AxiosError) {
	// 	log.debug(JSON.stringify(error))
	// }

	// if(status === 400) {
	// 	console.log('400 error', data)
	// }

	// if(status === 401) {
	// 	return axios(config);

	// }
	// else {
	// 	console.log(`${status} error`)
	// }

	return Promise.reject(error);
})

const responseBody = (response: AxiosResponse) => {

	const data = response.data as ResponseData

	console.log('responseBody')

	//console.log(data);
	
	//log.debug('response', response.config.url)

	if(data.success) {
		return data.data
	}

	throw new AppError(data.errorCode, 'sdfsdkfsjdlf')
}



export const requests = {
	get: <T>(url: string, body: {} = {}): Promise<T> => instance.get(url, {params: body}).then(responseBody),
	post: <T>(url: string, body: {} = {}): Promise<T> => instance.post(url, body).then(responseBody),
	//post: <T>(url: string, body: any = {}): Promise<T> => instance.post(url, body, {headers: {"Content-Type": "multipart/form-data",}}).then(responseBody),
	form: <T>(url: string, body: FormData): Promise<T> => instance.post(url, body, {headers: {"Content-Type": "multipart/form-data",}}).then(responseBody),
	//patch: <T>(url: string, body: {} = {}): Promise<T> => instance.patch(url, body).then(responseBody),
	patch: <T>(url: string, body: any = {}): Promise<T> => {
		const formData = new FormData()
		Object.keys(body).forEach(value => {
			if(Array.isArray(body[value])) {
				body[value].map((v: any) => {
					if(v !== undefined) formData.append(value, `${v}`);
				})
			}
			else {
				if(body[value] !== undefined) {
					formData.append(value, body[value])
				}
			}
			
		})
		return instance.patch(url, Object.keys(body).length !== 0 ? formData : undefined, {headers: {"Content-Type": "multipart/form-data",}}).then(responseBody)
	},
	//delete: <T>(url: string): Promise<T> => instance.delete(url).then(responseBody),
	delete: <T>(url: string, body: any = {}): Promise<T> => instance.delete(url, {data: body}).then(responseBody),
};
