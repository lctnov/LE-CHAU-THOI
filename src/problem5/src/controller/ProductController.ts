import { Request, Response } from 'express';
import { ProductRepository } from '../repository/ProductRepository';

/**
 * ProductController
 * Responsibilities:
 * - Route HTTP requests to appropriate methods
 * - Parse request parameters and body
 * - Call repository methods
 * - Return formatted responses via middleware
 *
 * Business logic is delegated to ProductRepository
 */
export class ProductController {
	/**
	 * Create a new product
	 * POST /api/products
	 */
	static async createProduct(req: Request, res: Response): Promise<void> {
		try {
			const product = await ProductRepository.create(req);
			
			res.sendCreated(product, 'Product created successfully');
		} catch (err) {
			const message = (err instanceof Error) ? err.message : 'Failed to create product';
			res.sendFail(message, 400, 'VALIDATION_ERROR');
		}
	}

	/**
	 * List all products with optional filters
	 * GET /api/products?category=...&minPrice=...&maxPrice=...
	 */
	static async listProducts(req: Request, res: Response): Promise<void> {
		try {
			const products = await ProductRepository.findAll(req);

			res.sendSuccess(products, `Found ${products.length} product${products.length !== 1 ? 's' : ''}`);
		} catch (err) {
			const message = (err instanceof Error) ? err.message : 'Failed to fetch products';
			res.sendError(message, 500);
		}
	}

	/**
	 * Get product details by ID
	 * GET /api/products/:id
	 */
	static async getProduct(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id, 10);
			const product = await ProductRepository.findById(id);

			if (!product) {
				res.sendNotFound(`Product with ID ${id} not found`);
				return;
			}

			res.sendSuccess(product, 'Product retrieved successfully');
		} catch (err) {
			const message = (err instanceof Error) ? err.message : 'Failed to fetch product';
			res.sendError(message, 500);
		}
	}

	/**
	 * Update a product
	 * PUT /api/products/:id
	 */
	static async updateProduct(req: Request, res: Response): Promise<void> {
		try {
			const product = await ProductRepository.update(req);

			res.sendSuccess(product, 'Product updated successfully');
		} catch (err) {
			const message = (err instanceof Error) ? err.message : 'Failed to update product';

			// Check if it's a not found error
			if (message.includes('not found')) {
				res.sendNotFound(message);
			} else {
				res.sendFail(message, 400, 'VALIDATION_ERROR');
			}
		}
	}

	/**
	 * Delete a product
	 * DELETE /api/products/:id
	 */
	static async deleteProduct(req: Request, res: Response): Promise<void> {
		try {
			const id = parseInt(req.params.id, 10);
			await ProductRepository.delete(id);
			res.sendDeleted(id, 'Product deleted successfully');
		} catch (err) {
			const message = (err instanceof Error) ? err.message : 'Failed to delete product';
			// Check if it's a not found error
			if (message.includes('not found')) {
				res.sendNotFound(message);
			} else {
				res.sendError(message, 500);
			}
		}
	}
}