import prisma from "../prismaClient.js";

export const getDrivers = async (req, res, next) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: { 
        lorry: true,
        deliveries: {
          include: {
            order: {
              include: {
                customer: true
              }
            }
          }
        }
      }
    });
    res.json(drivers);
  } catch (e) {
    next(e);
  }
};

export const createDriver = async (req, res, next) => {
  try {
    const { name, lorryId } = req.body;
    
    if (!name || !lorryId) {
      return res.status(400).json({ error: "name and lorryId are required" });
    }

    const driver = await prisma.driver.create({
      data: { name, lorryId },
      include: { lorry: true }
    });
    res.status(201).json(driver);
  } catch (e) {
    next(e);
  }
};

