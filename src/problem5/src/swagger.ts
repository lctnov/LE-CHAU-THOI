import swaggerJsdoc from 'swagger-jsdoc';

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Product CRUD API',
			version: '1.0.0',
			description: 'A simple CRUD API for managing products with SQLite database',
			contact: {
				name: 'API Support',
			},
		},
		servers: [
			{
				url: 'http://localhost:4000',
				description: 'Development server',
			},
		],
		components: {
			schemas: {
				Product: {
					type: 'object',
					required: ['name', 'description', 'price', 'quantity'],
					properties: {
						id: {
							type: 'integer',
							description: 'Product ID (auto-generated)',
							example: 1,
						},
						name: {
							type: 'string',
							description: 'Product name',
							example: 'Laptop',
						},
						description: {
							type: 'string',
							description: 'Product description',
							example: 'High-performance laptop',
						},
						price: {
							type: 'number',
							format: 'decimal',
							description: 'Product price',
							example: 1299.99,
						},
						quantity: {
							type: 'integer',
							description: 'Product quantity in stock',
							example: 10,
						},
						category: {
							type: 'string',
							nullable: true,
							description: 'Product category',
							example: 'Electronics',
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
							description: 'Product creation timestamp',
							example: '2024-01-15T10:30:00.000Z',
						},
						updatedAt: {
							type: 'string',
							format: 'date-time',
							description: 'Product last update timestamp',
							example: '2024-01-15T10:30:00.000Z',
						},
					},
				},
				ApiResponse: {
					type: 'object',
					description: 'Standardized API Response',
					properties: {
						iStatus: {
							type: 'string',
							enum: ['SUCCESS', 'FAIL', 'ERROR'],
							description: 'Response status',
							example: 'SUCCESS',
						},
						iMessage: {
							type: 'string',
							description: 'Human-readable message',
							example: 'Product created successfully',
						},
						iPayload: {
							type: 'object',
							nullable: true,
							description: 'Response payload data',
							example: null,
						},
						iCode: {
							type: 'integer',
							description: 'HTTP status code',
							example: 200,
						},
						iError: {
							type: 'string',
							nullable: true,
							description: 'Error code or details',
							example: null,
						},
						iTimestamp: {
							type: 'string',
							format: 'date-time',
							description: 'Response timestamp',
							example: '2024-01-15T10:30:00.000Z',
						},
					},
				},
				SuccessResponse: {
				allOf: [
					{ $ref: '#/components/schemas/ApiResponse' },
					{
						type: 'object',
						properties: {
							iStatus: {
								type: 'string',
								enum: ['SUCCESS'],
								example: 'SUCCESS',
							},
							iCode: {
								type: 'integer',
								enum: [200, 201],
							},
						},
					},
				],
				},
				FailResponse: {
				allOf: [
					{ $ref: '#/components/schemas/ApiResponse' },
					{
						type: 'object',
						properties: {
							iStatus: {
								type: 'string',
								enum: ['FAIL'],
								example: 'FAIL',
							},
							iCode: {
								type: 'integer',
								enum: [400, 404],
							},
							iPayload: {
								type: 'null',
								example: null,
							},
						},
					},
				],
				},
				ErrorResponse: {
				allOf: [
					{ $ref: '#/components/schemas/ApiResponse' },
					{
						type: 'object',
						properties: {
							iStatus: {
								type: 'string',
								enum: ['ERROR'],
								example: 'ERROR',
							},
							iCode: {
								type: 'integer',
								enum: [500],
							},
							iPayload: {
								type: 'null',
								example: null,
							},
						},
					},
				],
				},
			},
		},
	},
	apis: ['./src/routes/productRoutes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
