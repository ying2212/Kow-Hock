import { Router } from "express";
import prisma from "../prismaClient.js";
import { authMiddleWare as authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/summary", authMiddleware, async (req, res, next) => {
    try {
      const days = parseInt(req.query.days) || 7;
      const since = new Date();
      since.setDate(since.getDate() - days);
  
      const [totalDeliveries, fuelRecords, drivers, deliveryStatuses] = await Promise.all([
        prisma.delivery.count({ where: { createdAt: { gte: since } } }),
        prisma.fuel.findMany(),
        prisma.driver.findMany({
          include: {
            lorry: { select: { status: true } },
            deliveries: { where: { status: { not: "DELIVERED" } }, select: { id: true } },
          },
        }),
        prisma.delivery.groupBy({
          by: ["status"],
          _count: { id: true },
        }),
      ]);
  
      const totalFuel   = fuelRecords.reduce((s, f) => s + f.price, 0);
      const totalLiters = fuelRecords.reduce((s, f) => s + f.liters, 0);
      const avgPerLiter = totalLiters > 0 ? totalFuel / totalLiters : 0;
      const activeDrivers = drivers.filter(d => d.lorry?.status === "DELIVERING").length;
      const utilization = drivers.length > 0
        ? Math.round((activeDrivers / drivers.length) * 100)
        : 0;
  
      // Map status counts for pie chart
      const statusMap = {};
      deliveryStatuses.forEach(s => { statusMap[s.status] = s._count.id; });
  
      res.json({
        totalDeliveries,
        totalFuelSpend: Math.round(totalFuel * 100) / 100,
        avgPricePerLiter: Math.round(avgPerLiter * 100) / 100,
        utilization,
        delivered:  statusMap["DELIVERED"]  ?? 0,
        delivering: statusMap["DELIVERING"] ?? 0,
        pending:    statusMap["ASSIGNED"]   ?? 0,
        cancelled:  0,
      });
    } catch (e) { next(e); }
});

router.get("/deliveries-per-day", authMiddleware, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const raw = await prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "Delivery"
      WHERE "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;
    res.json(raw);
  } catch (e) { next(e); }
});

router.get("/fuel-trend", authMiddleware, async (req, res, next) => {
    try {
      const raw = await prisma.$queryRaw`
        SELECT DATE(date) as day,
               ROUND(SUM(price)::numeric, 2)::float as total_cost,
               ROUND(AVG(price / NULLIF(liters,0))::numeric, 2)::float as avg_per_liter
        FROM "Fuel"
        GROUP BY DATE(date)
        ORDER BY day ASC
      `;
      res.json(raw);
    } catch (e) { next(e); }
  });

router.get("/driver-utilization", authMiddleware, async (req, res, next) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        lorry: { select: { status: true } },
        deliveries: {
          where: { status: { not: "DELIVERED" } },
          select: { id: true },
        },
      },
    });

    const data = drivers.map((d) => ({
      id:          d.id,
      name:        d.name,
      lorryStatus: d.lorry?.status,
      activeJobs:  d.deliveries.length,
      utilization:
        d.lorry?.status === "DELIVERING" ? 100 :
        d.lorry?.status === "MAINTENANCE" ? 0 : 20,
    }));

    res.json(data);
  } catch (e) { next(e); }
});

export default router;