import { Request, Response } from 'express';
import { ApartmentController } from '../apartmentController';
import { ApartmentService } from '../../services/apartmentService';
import { ValidationError, NotFoundError } from '../../errors/AppError';
import { CreateApartmentDTO } from '../../types/apartment';

// Mock the service
jest.mock('../../services/apartmentService');

describe('ApartmentController', () => {
  let controller: ApartmentController;
  let mockService: jest.Mocked<ApartmentService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockApartment: any;

  beforeEach(() => {
    mockService = {
      listApartments: jest.fn(),
      getApartmentById: jest.fn(),
      createApartment: jest.fn(),
    } as any;

    // Mock the service constructor
    (ApartmentService as jest.Mock).mockImplementation(() => mockService);

    controller = new ApartmentController();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockApartment = {
      id: 1,
      unitName: 'Test Apartment',
      unitNumber: 'A101',
      price: 1000000,
      projectName: 'Test Project',
      unitLocation: 'Test Location',
      area: 100,
      bathrooms: 2,
      bedrooms: 3,
      floorNumber: '5',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listApartments', () => {
    it('should return list of apartments', async () => {
      mockRequest = {
        query: {},
      };

      const mockResult = {
        apartments: [mockApartment],
        total: 100,
      };

      mockService.listApartments.mockResolvedValue(mockResult);

      await controller.listApartments(mockRequest as Request, mockResponse as Response);

      expect(mockService.listApartments).toHaveBeenCalledWith(undefined, undefined, undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockResult,
      });
    });

    it('should handle pagination parameters', async () => {
      mockRequest = {
        query: {
          limit: '10',
          offset: '20',
        },
      };

      const mockResult = {
        apartments: [mockApartment],
        total: 100,
        limit: 10,
        offset: 20,
      };

      mockService.listApartments.mockResolvedValue(mockResult);

      await controller.listApartments(mockRequest as Request, mockResponse as Response);

      expect(mockService.listApartments).toHaveBeenCalledWith(10, 20, undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle search query parameter', async () => {
      mockRequest = {
        query: {
          q: 'Test',
        },
      };

      const mockResult = {
        apartments: [mockApartment],
        total: 1,
        searchTerm: 'Test',
      };

      mockService.listApartments.mockResolvedValue(mockResult);

      await controller.listApartments(mockRequest as Request, mockResponse as Response);

      expect(mockService.listApartments).toHaveBeenCalledWith(undefined, undefined, 'Test');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockResult,
      });
    });

    it('should handle search with pagination', async () => {
      mockRequest = {
        query: {
          q: 'Project',
          limit: '10',
          offset: '0',
        },
      };

      const mockResult = {
        apartments: [mockApartment],
        total: 5,
        limit: 10,
        offset: 0,
        searchTerm: 'Project',
      };

      mockService.listApartments.mockResolvedValue(mockResult);

      await controller.listApartments(mockRequest as Request, mockResponse as Response);

      expect(mockService.listApartments).toHaveBeenCalledWith(10, 0, 'Project');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      mockRequest = {
        query: {},
      };

      mockService.listApartments.mockRejectedValue(new Error('Database error'));

      await controller.listApartments(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Failed to fetch apartments',
        error: 'Database error',
      });
    });
  });

  describe('getApartmentById', () => {
    it('should return apartment by ID', async () => {
      mockRequest = {
        params: { id: '1' },
      };

      mockService.getApartmentById.mockResolvedValue(mockApartment);

      await controller.getApartmentById(mockRequest as Request, mockResponse as Response);

      expect(mockService.getApartmentById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockApartment,
      });
    });

    it('should return 400 for invalid ID', async () => {
      mockRequest = {
        params: { id: 'invalid' },
      };

      await controller.getApartmentById(mockRequest as Request, mockResponse as Response);

      expect(mockService.getApartmentById).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid apartment ID',
      });
    });

    it('should return 404 when apartment not found', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      mockService.getApartmentById.mockRejectedValue(new NotFoundError('Apartment not found'));

      await controller.getApartmentById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Apartment not found',
      });
    });

    it('should return 500 for other errors', async () => {
      mockRequest = {
        params: { id: '1' },
      };

      mockService.getApartmentById.mockRejectedValue(new Error('Database error'));

      await controller.getApartmentById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Failed to fetch apartment',
        error: 'Database error',
      });
    });
  });

  describe('createApartment', () => {
    const validApartmentData: CreateApartmentDTO = {
      unitName: 'New Apartment',
      unitNumber: 'B202',
      price: 2000000,
      projectName: 'New Project',
      unitLocation: 'New Location',
      area: 150,
      bathrooms: 3,
      bedrooms: 4,
      floorNumber: '10',
    };

    it('should create apartment successfully', async () => {
      mockRequest = {
        body: validApartmentData,
      };

      const createdApartment = {
        ...validApartmentData,
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.createApartment.mockResolvedValue(createdApartment as any);

      await controller.createApartment(mockRequest as Request, mockResponse as Response);

      expect(mockService.createApartment).toHaveBeenCalledWith(validApartmentData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Apartment created successfully',
        data: createdApartment,
      });
    });

    it('should return 400 for validation errors', async () => {
      mockRequest = {
        body: { ...validApartmentData, unitName: '' },
      };

      mockService.createApartment.mockRejectedValue(new ValidationError('Unit name is required'));

      await controller.createApartment(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Validation error',
        error: 'Unit name is required',
      });
    });

    it('should return 500 for unknown errors', async () => {
      mockRequest = {
        body: validApartmentData,
      };

      mockService.createApartment.mockRejectedValue(new Error('Database connection failed'));

      await controller.createApartment(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
        error: 'Database connection failed',
      });
    });

    it('should handle non-Error objects', async () => {
      mockRequest = {
        body: validApartmentData,
      };

      mockService.createApartment.mockRejectedValue('String error');

      await controller.createApartment(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
        error: 'Unknown error',
      });
    });
  });
});

