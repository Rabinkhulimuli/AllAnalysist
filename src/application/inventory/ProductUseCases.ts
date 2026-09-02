// Application: Product Use Cases

import { CreateProductInput, Product } from '@/src/domain/inventory/Product';
import { ProductRepository } from '@/src/infrastructure/inventory/ProductRepository';

export class ProductUseCases {
  constructor(private productRepository: ProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProduct(id: string): Promise<Product | null> {
    if (!id) throw new Error('Product ID is required');
    return this.productRepository.findById(id);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    // Validation
    if (!input.name || input.price < 0 || input.stock < 0) {
      throw new Error('Invalid product data');
    }

    return this.productRepository.create(input);
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!id) throw new Error('Product ID is required');
    return this.productRepository.delete(id);
  }
}
