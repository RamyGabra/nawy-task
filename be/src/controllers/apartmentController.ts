import { Request, Response } from 'express';
import { ApartmentService } from '../services/apartmentService';
import { CreateApartmentDTO } from '../types/apartment';
import { ValidationError, NotFoundError } from '../errors/AppError';

export class ApartmentController {
  private apartmentService: ApartmentService;

  constructor() {
    this.apartmentService = new ApartmentService();
  }

  /**
   * List all apartments with optional search
   * GET /apartments?q=searchTerm&limit=10&offset=0
   */
  listApartments = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const searchTerm = req.query.q as string | undefined;

      const result = await this.apartmentService.listApartments(limit, offset, searchTerm);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch apartments',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * Get apartment by ID
   * GET /apartments/:id
   */
  getApartmentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: 'Invalid apartment ID',
        });
        return;
      }

      const apartment = await this.apartmentService.getApartmentById(id);

      res.status(200).json({
        data: apartment,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        message: 'Failed to fetch apartment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * Create a new apartment
   * POST /apartments
   */
  createApartment = async (req: Request, res: Response): Promise<void> => {
    try {
      const apartmentData: CreateApartmentDTO = {
        unitName: req.body.unitName,
        unitNumber: req.body.unitNumber,
        price: req.body.price,
        projectName: req.body.projectName,
        unitLocation: req.body.unitLocation,
        area: req.body.area,
        bathrooms: req.body.bathrooms,
        bedrooms: req.body.bedrooms,
        floorNumber: req.body.floorNumber,
      };

      const apartment = await this.apartmentService.createApartment(apartmentData);

      res.status(200).json({
        message: 'Apartment created successfully',
        data: apartment,
      });
    } catch (error) {
      let statusCode = 500;
      let message = 'Failed to create apartment';
      
      if (error instanceof ValidationError) {
        statusCode = 400;
        message = 'Validation error';
      } else {
        // Unknown error, keep 500
        message = 'Internal server error';
      }

      res.status(statusCode).json({
        message,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

