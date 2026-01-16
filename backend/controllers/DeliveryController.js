import prisma from "../prismaClient.js";

export const getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await prisma.delivery.findMany({
      include: {
        order: {
          include: {
            customer: true,
            items: {
              include: { product: true }
            }
          }
        },
        driver: true,
        lorry: true
      },
      orderBy: { id: 'desc' }
    });
    res.json(deliveries);
  } catch (e) {
    next(e);
  }
};

export const createDelivery = async (req, res, next) => {
  try {
    const { orderId, lorryId, driverId } = req.body;

    if (!orderId || !lorryId || !driverId) {
      return res.status(400).json({ 
        error: "orderId, lorryId, and driverId are required" 
      });
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Create delivery
    const delivery = await prisma.delivery.create({
      data: {
        orderId,
        lorryId,
        driverId,
        status: 'ASSIGNED'
      },
      include: {
        order: {
          include: { customer: true }
        },
        driver: true,
        lorry: true
      }
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'OUT_FOR_DELIVERY' }
    });

    // Update lorry status
    await prisma.lorry.update({
      where: { id: lorryId },
      data: { status: 'DELIVERING' }
    });

    res.status(201).json(delivery);
  } catch (e) {
    next(e);
  }
};

export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ASSIGNED', 'PICKED_UP', 'DELIVERING', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const delivery = await prisma.delivery.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        order: true,
        driver: true,
        lorry: true
      }
    });

    // If delivered, update order and lorry status
    if (status === 'DELIVERED') {
      await prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: 'DELIVERED' }
      });

      await prisma.lorry.update({
        where: { id: delivery.lorryId },
        data: { status: 'IDLE' }
      });
    }

    res.json(delivery);
  } catch (e) {
    next(e);
  }
};

