export enum ResponseStatus {
	SUCCESS = 'SUCCESS',
	FAIL = 'FAIL',
	ERROR = 'ERROR',
}

export interface IApiResponse<T = any> {
	iStatus: ResponseStatus;
	iMessage: string;
	iPayload: T | null;
	iCode: number;
	iError?: string;
	iTimestamp?: string;
}

export class ApiResponseBuilder {
	static success<T>(
		iPayload: T,
		iMessage: string = 'Operation successful',
		iCode: number = 200
	): IApiResponse<T> {
		return {
			iStatus: ResponseStatus.SUCCESS,
			iMessage,
			iPayload,
			iCode,
			iTimestamp: new Date().toISOString(),
		};
	}

	static created<T>(
		iPayload: T,
		iMessage: string = 'Resource created successfully'
	): IApiResponse<T> {
		return {
			iStatus: ResponseStatus.SUCCESS,
			iMessage,
			iPayload,
			iCode: 201,
			iTimestamp: new Date().toISOString(),
		};
	}

	static fail<T = null>(
		iMessage: string,
		iCode: number = 400,
		iPayload: T | null = null,
		iError?: string
	): IApiResponse<T> {
		return {
			iStatus: ResponseStatus.FAIL,
			iMessage,
			iPayload,
			iCode,
			iError,
			iTimestamp: new Date().toISOString(),
		};
	}

	static notFound(
		iMessage: string = 'Resource not found',
		iError?: string
	): IApiResponse {
		return {
			iStatus: ResponseStatus.FAIL,
			iMessage,
			iPayload: null,
			iCode: 404,
			iError,
			iTimestamp: new Date().toISOString(),
		};
	}

	static error(
		iMessage: string,
		iCode: number = 500,
		iError?: string
	): IApiResponse {
		return {
		iStatus: ResponseStatus.ERROR,
		iMessage,
		iPayload: null,
		iCode,
		iError,
		iTimestamp: new Date().toISOString(),
		};
	}

	static deleted(
		id: number | string,
		iMessage: string = 'Resource deleted successfully'
	): IApiResponse {
		return {
			iStatus: ResponseStatus.SUCCESS,
			iMessage,
			iPayload: { id },
			iCode: 200,
			iTimestamp: new Date().toISOString(),
		};
	}
}
