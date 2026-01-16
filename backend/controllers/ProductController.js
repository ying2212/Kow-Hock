import prisma from "../prismaClient.js";

// Create product
export async function createProduct(req, res) {
    const { name, description, unit, price, imageUrl } = req.body;
  
    if (!name || !unit || price == null) {
      return res.status(400).json({ error: "name, unit, and price are required" });
    }
  
    try {
      const product = await prisma.product.create({
        data: {
            name,
            description,
            unit,
            price: Number(price),
            imageUrl,
        },
      });
  
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create product" });
    }
}
  
// Get all products
export async function getAllProducts(req, res) {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
}
  
// Get product by ID
export async function getProductById(req, res) {
    const id = Number(req.params.id);

    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
        return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
}
  
// Update product
export async function updateProduct(req, res) {
    const id = Number(req.params.id);
    const { name, description, unit, price, imageUrl } = req.body;

    try {
        const product = await prisma.product.update({
        where: { id },
        data: {
            name,
            description,
            unit,
            price: price != null ? Number(price) : undefined,
            imageUrl,
        },
        });

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update product" });
    }
}

// Delete product
export async function deleteProduct(req, res) {
    const id = Number(req.params.id);

    try {
        await prisma.product.delete({
        where: { id },
        });

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete product" });
    }
}
