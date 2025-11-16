import { Router } from 'express';
import { ApartmentController } from '../controllers/apartmentController';

const router = Router();
const apartmentController = new ApartmentController();

// List all apartments
router.get('/', apartmentController.listApartments);

// Get apartment by ID
router.get('/:id', apartmentController.getApartmentById);

// Create new apartment
router.post('/', apartmentController.createApartment);

export default router;

