import prisma from "../prismaClient.js";

export const getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: { id: true, name: true, phone: true }
        },
        store: true,
        items: {
          include: {
            product: true
          }
        },
        deliveries: {
          include: {
            driver: true,
            lorry: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        customer: true,
        store: true,
        items: {
          include: { product: true }
        },
        deliveries: {
          include: {
            driver: true,
            lorry: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (e) {
    next(e);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { customerId, storeId, items, deliveryAddress } = req.body;

    // Validate required fields
    if (!customerId || !storeId || !items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ 
        error: "customerId, storeId, items, and deliveryAddress are required" 
      });
    }

    // Calculate total price and validate products
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(404).json({ 
          error: `Product with id ${item.productId} not found` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: product.price
      });
    }

    // Generate unique order number
    const orderNumber = `#${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        storeId,
        totalPrice,
        deliveryAddress,
        status: 'PENDING',
        items: {
          create: orderItems
        }
      },
      include: {
        customer: true,
        store: true,
        items: {
          include: { product: true }
        }
      }
    });

    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        customer: true,
        items: {
          include: { product: true }
        }
      }
    });

    res.json(order);
  } catch (e) {
    next(e);
  }
};

