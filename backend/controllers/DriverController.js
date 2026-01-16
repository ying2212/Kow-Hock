import prisma from "../prismaClient.js";

export const getDrivers = async (req, res, next) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: { lorry: true }
    });
    res.json(drivers);
  } catch (e) {
    next(e);
  }
};

export const createDriver = async (req, res, next) => {
  try {
    const { name, lorryId } = req.body;
    const driver = await prisma.driver.create({
      data: { name, lorryId }
    });
    res.json(driver);
  } catch (e) {
    next(e);
  }
};
