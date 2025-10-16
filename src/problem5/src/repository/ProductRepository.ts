import { Product } from '../entity/Product';
import { AppDataSource } from '../database';

export class ProductRepository {
	private static repository = AppDataSource.getRepository(Product);

	/**
	 * Create a new product
	 * @throws Error if validation fails or database error occurs
	 */
	static async create(req: any): Promise<Product> {
		const { name, description, price, quantity, category } = req.body;

		// Validate required fields
		if (!name || !description || price === undefined || quantity === undefined) {
			throw new Error('Missing required fields: name, description, price, quantity');
		}

		// Validate price and quantity
		if (price < 0) {
			throw new Error('Price cannot be negative');
		}

		if (quantity < 0) {
			throw new Error('Quantity cannot be negative');
		}

		try {
			let isCheck = await this.repository.findOneBy({ name: name });

			// console.log('isCheck', isCheck);

			if (isCheck) {
				throw new Error('Product with the same name already exists');
			}
			const product = this.repository.create({ name, description, price, quantity, category });
			return await this.repository.save(product);
		} catch (err) {
			throw new Error(`Failed to create product: ${(err instanceof Error) ? err.message : 'Unknown error'}`);
		}
	}

	/**
	 * Find all products with optional filters
	 */
	static async findAll(req: any): Promise<Product[]> {
		try {
			const { category, minPrice, maxPrice } = req.query;
			
			const filters = {
				category: category ? String(category) : undefined,
				minPrice: minPrice ? Number(minPrice) : undefined,
				maxPrice: maxPrice ? Number(maxPrice) : undefined,
			};

			let query = this.repository.createQueryBuilder('product');

			if (filters?.category) {
				query = query.where('product.category = :category', { category: filters.category });
			}

			if (filters?.minPrice !== undefined && !isNaN(filters.minPrice)) {
				query = query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
			}

			if (filters?.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
				query = query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
			}

			return await query.orderBy('product.id', 'ASC').getMany();
		} catch (err) {
			throw new Error(`Failed to fetch products: ${(err instanceof Error) ? err.message : 'Unknown error'}`);
		}
	}

	/**
	 * Find a product by ID
	 */
	static async findById(id: number): Promise<Product | null> {
		try {
			if (!id || isNaN(id) || id <= 0) {
				throw new Error('Invalid product ID');
			}

			return await this.repository.findOneBy({ id });
		} catch (err) {
			throw new Error(`Failed to fetch product: ${(err instanceof Error) ? err.message : 'Unknown error'}`);
		}
	}

	/**
	 * Update a product by ID
	 * @throws Error if product not found or validation fails
	 */
	static async update(req: any): Promise<Product> {
		try {
			const id = parseInt(req.params.id, 10);
			const { name, description, price, quantity, category } = req.body;
			if (!id || isNaN(id) || id <= 0) {
				throw new Error('Invalid product ID');
			}

			// Validate price if provided
			if (price !== undefined && price < 0) {
				throw new Error('Price cannot be negative');
			}

			// Validate quantity if provided
			if (quantity !== undefined && quantity < 0) {
				throw new Error('Quantity cannot be negative');
			}

			const product = await this.repository.findOneBy({ id });
			if (!product) {
				throw new Error(`Product with ID ${id} not found`);
			}

			// Update only provided fields
			Object.assign(product, req.body);
			return await this.repository.save(product);
		} catch (err) {
			throw new Error((err instanceof Error) ? err.message : 'Failed to update product');
		}
	}

	/**
	 * Delete a product by ID
	 * @throws Error if product not found
	 */
	static async delete(id: number): Promise<number> {
		try {
			if (!id || isNaN(id) || id <= 0) {
				throw new Error('Invalid product ID');
			}

			const product = await this.repository.findOneBy({ id });
			if (!product) {
				throw new Error(`Product with ID ${id} not found`);
			}

			await this.repository.remove(product);
			return id;
		} catch (err) {
			throw new Error((err instanceof Error) ? err.message : 'Failed to delete product');
		}
	}

	/**
	 * Count total products
	 */
	static async count(): Promise<number> {
		try {
			return await this.repository.count();
		} catch (err) {
			throw new Error(`Failed to count products: ${(err instanceof Error) ? err.message : 'Unknown error'}`);
		}
	}

	/**
	 * Check if product exists by ID
	 */
	static async exists(id: number): Promise<boolean> {
		try {
			const count = await this.repository.countBy({ id });
			return count > 0;
		} catch (err) {
			throw new Error(`Failed to check product existence: ${(err instanceof Error) ? err.message : 'Unknown error'}`);
		}
	}
}
