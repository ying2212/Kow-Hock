import prisma from "../prismaClient.js";

export const getDrivers = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const [drivers, total] = await Promise.all([
      prisma.driver.findMany({
        skip,
        take: limit,
        include: {
          lorry: true,
          deliveries: {
            where: { status: { not: "DELIVERED" } },
            take: 1,
            include: { order: true },
          },
        },
        orderBy: { id: "desc" },
      }),
      prisma.driver.count(),
    ]);

    res.json({ data: drivers, total, page, limit, hasMore: skip + limit < total });
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
