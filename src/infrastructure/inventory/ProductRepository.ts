import { CreateProductInput, Product, UpdateProductInput } from '@/src/domain/inventory/Product';

export class ProductRepository {
  private products: Map<string, Product> = new Map();

  async create(input: CreateProductInput): Promise<Product> {
    const product: Product = {
      id: Date.now().toString(),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.set(product.id, product);
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const product = this.products.get(id);
    if (!product) return null;

    const updated: Product = {
      ...product,
      ...input,
      updatedAt: new Date(),
    };

    this.products.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}

export const productRepository = new ProductRepository();
