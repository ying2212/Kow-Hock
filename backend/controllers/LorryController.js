import prisma from "../prismaClient.js";

export const createLorry = async (req, res, next) => {
    try {
        const { plateNumber, lorryNumber } = req.body;
        if (!plateNumber || !lorryNumber) {
        return res.status(400).json({ error: "Plate number and lorry number are required" });
        }
        const lorry = await prisma.lorry.create({
        data: { plateNumber, lorryNumber }
        });
        res.status(201).json(lorry);
    } catch (e) {
        next(e);
    }
};

export const getLorrys = async (req, res, next) => {
    try {
      const lorrys = await prisma.lorry.findMany({
        include: {
          deliveries: true,
          gpsLogs: true,
          drivers: true,
        },
      });
      res.json(lorrys);
    } catch (e) {
      next(e);
    }
  };
  