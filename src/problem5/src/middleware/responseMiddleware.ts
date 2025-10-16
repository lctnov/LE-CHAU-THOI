import { Request, Response, NextFunction } from 'express';
import { IApiResponse, ResponseStatus } from '../types/response';

declare global {
	namespace Express {
		interface Response {
			sendSuccess<T>(
				iPayload: T,
				iMessage?: string,
				iCode?: number
			): Response;
			sendCreated<T>(iPayload: T, iMessage?: string): Response;
			sendFail(
				iMessage: string,
				iCode?: number,
				iError?: string
			): Response;
			sendNotFound(iMessage?: string, iError?: string): Response;
			sendError(iMessage: string, iCode?: number, iError?: string): Response;
			sendDeleted(id: number | string, iMessage?: string): Response;
		}
	}
}

export const responseMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.sendSuccess = function <T>(
		iPayload: T,
		iMessage: string = 'Operation successful',
		iCode: number = 200
	): Response {
		const response: IApiResponse<T> = {
			iStatus: ResponseStatus.SUCCESS,
			iMessage,
			iPayload,
			iCode,
			iTimestamp: new Date().toISOString(),
		};
		return res.status(iCode).json(response);
	};

	res.sendCreated = function <T>(
		iPayload: T,
		iMessage: string = 'Resource created successfully'
	): Response {
		const response: IApiResponse<T> = {
			iStatus: ResponseStatus.SUCCESS,
			iMessage,
			iPayload,
			iCode: 201,
			iTimestamp: new Date().toISOString(),
		};
		return res.status(201).json(response);
	};

	res.sendFail = function (
		iMessage: string,
		iCode: number = 400,
		iError?: string
	): Response {
		const response: IApiResponse = {
		iStatus: ResponseStatus.FAIL,
		iMessage,
		iPayload: null,
		iCode,
		iError,
		iTimestamp: new Date().toISOString(),
		};
		return res.status(iCode).json(response);
	};

	res.sendNotFound = function (
		iMessage: string = 'Resource not found',
		iError?: string
	): Response {
		const response: IApiResponse = {
			iStatus: ResponseStatus.FAIL,
			iMessage,
			iPayload: null,
			iCode: 404,
			iError,
			iTimestamp: new Date().toISOString(),
		};
		return res.status(404).json(response);
	};

	res.sendError = function (
		iMessage: string,
		iCode: number = 500,
		iError?: string
	): Response {
		const response: IApiResponse = {
			iStatus: ResponseStatus.ERROR,
			iMessage,
			iPayload: null,
			iCode,
			iError,
			iTimestamp: new Date().toISOString(),
		};
		return res.status(iCode).json(response);
	};

	res.sendDeleted = function (
		id: number | string,
		iMessage: string = 'Resource deleted successfully'
	): Response {
		const response: IApiResponse = {
			iStatus: ResponseStatus.SUCCESS,
			iMessage,
			iPayload: { id },
			iCode: 200,
			iTimestamp: new Date().toISOString(),
		};
		return res.status(200).json(response);
	};

	next();
};
