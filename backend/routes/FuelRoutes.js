import { Router } from 'express';
import { createFuel, getAllFuels, getFuelsByDriver, updateFuel, deleteFuel } from '../controllers/FuelController.js';

const router = Router();
router.get('/', getAllFuels);
router.post('/', createFuel);
router.get("/driver/:driverId", getFuelsByDriver);
router.put('/:id', updateFuel);
router.delete('/:id', deleteFuel);

export default router;