import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { initializeDatabase } from './database';
import { productRouter } from './routes/productRoutes';
import { responseMiddleware } from './middleware/responseMiddleware';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

app.use('/api/products', productRouter);

app.get('/health', (req, res) => {
  	res.status(200).json({ status: 'ok', message: 'Server is running' });
});

async function startServer() {
	try {
		await initializeDatabase();

		app.listen(PORT, () => {
		console.log(`🚀 Server running at http://localhost:${PORT}`);
		console.log(`📚 Swagger UI available at http://localhost:${PORT}/api/docs`);
		console.log(`📝 API Specification at http://localhost:${PORT}/api/docs.json`);
		console.log(`\n📋 API Endpoints:`);
		console.log(`   POST   /api/products - Create a product`);
		console.log(`   GET    /api/products - List products`);
		console.log(`   GET    /api/products/:id - Get product details`);
		console.log(`   PUT    /api/products/:id - Update product`);
		console.log(`   DELETE /api/products/:id - Delete product`);
		console.log(`   💚 /health - Health check endpoint`);
		});
	} catch (err) {
		console.error('❌ Failed to start server:', err);
		process.exit(1);
	}
}

startServer();
