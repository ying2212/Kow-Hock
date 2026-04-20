import prisma from "../prismaClient.js";

export const getAllFuels = async (req, res) => {
    try {
        const fuels = await prisma.fuel.findMany();
        res.status(200).json(fuels);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fuels' });
    }
}
export const getFuelsByDriver = async (req, res) => {
    const { driverId } = req.params;
    try {
        const fuels = await prisma.fuel.findMany({
            where: { driverId: Number(driverId) },
            orderBy: { date: "desc" },
        });
        res.json(fuels);
          
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch fuels" });
    }
};

export const createFuel = async (req, res) => {
    const { driverId, lorryId, liters, price, odometer, station, receiptUrl } =
      req.body;
  
    try {
      const fuel = await prisma.fuel.create({
        data: {
          driverId: Number(driverId),
          lorryId: Number(lorryId),
          liters: Number(liters),
          price: Number(price),
          pricePerLiter: liters ? Number(price) / Number(liters) : null,
          odometer: odometer ? Number(odometer) : null,
          station,
          receiptUrl,
        },
      });
      res.status(201).json(fuel);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create fuel record" });
    }
  };
  

export const updateFuel = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverId, lorryId, liters, price, odometer, station, receiptUrl } = req.body;
        const updatedFuel = await prisma.fuel.update({
            where: { id: parseInt(id) },
            data: {
                driverId: Number(driverId),
                lorryId: Number(lorryId),
                liters: Number(liters),
                price: Number(price),
                pricePerLiter: liters ? Number(price) / Number(liters) : null,
                odometer: odometer ? Number(odometer) : null,
                station,
                receiptUrl,
            },
        });
        
        res.status(200).json(updatedFuel);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update fuel record' });
    }
}

export const deleteFuel = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.fuel.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete fuel record' });
    }
}
