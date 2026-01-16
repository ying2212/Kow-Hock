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
    if(!name || !lorryId) {
      return res.status(400).json({ error: "Name and Lorry ID are required" });
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
