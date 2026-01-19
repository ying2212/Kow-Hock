import prisma from "../prismaClient.js";

export const getAllStores = async (req, res, next) => {
    try {
        const stores = await prisma.store.findMany();
        res.json(stores);
    } catch (e) {
        next(e);
    }
};

export const getStoreById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const store = await prisma.store.findUnique({
            where: { id: Number(id) },
        });

        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        res.json(store);
    } catch (e) {
        next(e);
    }
};

export const createStore = async (req, res, next) => {
    try {
        const { name, location } = req.body;
        if (!name || !location) {
            return res.status(400).json({ error: "Name and location are required" });
        }
        const store = await prisma.store.create({
            data: { name, location }
        });
        res.status(201).json(store);
    } catch (e) {
        next(e);
    }
};
export const updateStore = async (req, res, next) => {  
    try {
        const { id } = req.params;
        const { name, location } = req.body;

        const store = await prisma.store.update({
            where: { id: Number(id) },
            data: { name, location }
        });

        res.json(store);
    } catch (e) {
        next(e);
    }
}

