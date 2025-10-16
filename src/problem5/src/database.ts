import path from 'path';
import { DataSource } from 'typeorm';
import { Product } from './entity/Product';

export const AppDataSource = new DataSource({
	type: 'sqlite',
	database: path.join(__dirname, '..', 'database.sqlite'),
	entities: [Product],
	synchronize: true,
	logging: false,
});

export async function initializeDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();
		console.log('✅ Database connected successfully');
    }
  } catch (err) {
		console.error('❌ Error during Data Source initialization:', err);
		throw err;
  }
}
