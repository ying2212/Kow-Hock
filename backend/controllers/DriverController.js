import prisma from "../prismaClient.js";

export const getDrivers = async (req, res, next) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: { 
        lorry: true,
        deliveries: true
      }
    });
    res.json(drivers);
  } catch (e) {
    next(e);
  }
};

export const createDriver = async (req, res, next) => {
  try {
    const { name, lorryNumber, plateNumber } = req.body;

    if (!name || !lorryNumber || !plateNumber) {
      return res.status(400).json({
        error: "Name, lorry number, and plate number are required",
      });
    }

    // Find existing lorry
    let lorry = await prisma.lorry.findFirst({
      where: {
        OR: [{ lorryNumber }, { plateNumber }],
      },
    });

    // Create if not exists
    if (!lorry) {
      lorry = await prisma.lorry.create({
        data: { lorryNumber, plateNumber },
      });
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        lorryId: lorry.id,
      },
      include: { lorry: true },
    });

    res.status(201).json(driver);
  } catch (e) {
    next(e);
  }
};
