import { ApartmentService } from '../apartmentService';
import { ApartmentRepository } from '../../repositories/apartmentRepository';
import { CreateApartmentDTO } from '../../types/apartment';
import { ValidationError, NotFoundError } from '../../errors/AppError';
import Apartment from '../../models/Apartment';

// Mock the repository
jest.mock('../../repositories/apartmentRepository');

describe('ApartmentService', () => {
  let service: ApartmentService;
  let mockRepository: jest.Mocked<ApartmentRepository>;
  let mockApartment: any;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      count: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    } as any;

    // Mock the repository constructor to return our mock
    (ApartmentRepository as jest.Mock).mockImplementation(() => mockRepository);

    service = new ApartmentService();

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
    it('should return list of apartments with total count', async () => {
      const mockApartments = [mockApartment];
      mockRepository.findAll.mockResolvedValue(mockApartments);
      mockRepository.count.mockResolvedValue(100);

      const result = await service.listApartments();

      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined, undefined, undefined);
      expect(mockRepository.count).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({ 
        apartments: mockApartments,
        total: 100,
        limit: undefined,
        offset: undefined,
      });
    });

    it('should return apartments with pagination', async () => {
      const mockApartments = [mockApartment];
      mockRepository.findAll.mockResolvedValue(mockApartments);
      mockRepository.count.mockResolvedValue(100);

      const limit = 10;
      const offset = 20;

      const result = await service.listApartments(limit, offset);

      expect(mockRepository.findAll).toHaveBeenCalledWith(limit, offset, undefined);
      expect(mockRepository.count).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({
        apartments: mockApartments,
        total: 100,
        limit: limit,
        offset: offset,
      });
    });

    it('should return apartments with search term', async () => {
      const mockApartments = [mockApartment];
      mockRepository.findAll.mockResolvedValue(mockApartments);
      mockRepository.count.mockResolvedValue(1);

      const result = await service.listApartments(undefined, undefined, 'Test');

      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined, undefined, 'Test');
      expect(mockRepository.count).toHaveBeenCalledWith('Test');
      expect(result).toEqual({
        apartments: mockApartments,
        total: 1,
        limit: undefined,
        offset: undefined,
        searchTerm: 'Test',
      });
    });

    it('should trim search term', async () => {
      const mockApartments = [mockApartment];
      mockRepository.findAll.mockResolvedValue(mockApartments);
      mockRepository.count.mockResolvedValue(1);

      const result = await service.listApartments(undefined, undefined, '  Test  ');

      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined, undefined, '  Test  ');
      expect(mockRepository.count).toHaveBeenCalledWith('  Test  ');
      expect(result.searchTerm).toBe('Test');
    });
  });

  describe('getApartmentById', () => {
    it('should return apartment when found', async () => {
      mockRepository.findById.mockResolvedValue(mockApartment as Apartment);

      const result = await service.getApartmentById(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockApartment);
    });

    it('should throw NotFoundError when apartment not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getApartmentById(999)).rejects.toThrow(NotFoundError);
      await expect(service.getApartmentById(999)).rejects.toThrow('Apartment not found');
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

    it('should create apartment with valid data', async () => {
      mockRepository.findAll.mockResolvedValue([]);
      mockRepository.create.mockResolvedValue({
        ...validApartmentData,
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Apartment);

      const result = await service.createApartment(validApartmentData);

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith(validApartmentData);
      expect(result).toHaveProperty('id');
    });

    it('should throw ValidationError when unitName is empty', async () => {
      const invalidData = { ...validApartmentData, unitName: '' };

      await expect(service.createApartment(invalidData)).rejects.toThrow(ValidationError);
      await expect(service.createApartment(invalidData)).rejects.toThrow('Unit name is required');
    });

    it('should throw ValidationError when unitNumber is empty', async () => {
      const invalidData = { ...validApartmentData, unitNumber: '' };

      await expect(service.createApartment(invalidData)).rejects.toThrow(ValidationError);
      await expect(service.createApartment(invalidData)).rejects.toThrow('Unit number is required');
    });

    it('should throw ValidationError when price is invalid', async () => {
      const invalidData = { ...validApartmentData, price: 0 };

      await expect(service.createApartment(invalidData)).rejects.toThrow(ValidationError);
      await expect(service.createApartment(invalidData)).rejects.toThrow('Price must be greater than 0');
    });

    it('should throw ValidationError when area is invalid', async () => {
      const invalidData = { ...validApartmentData, area: -1 };

      await expect(service.createApartment(invalidData)).rejects.toThrow(ValidationError);
      await expect(service.createApartment(invalidData)).rejects.toThrow('Area must be greater than 0');
    });

    it('should throw ValidationError when bathrooms is negative', async () => {
      const invalidData = { ...validApartmentData, bathrooms: -1 };

      await expect(service.createApartment(invalidData)).rejects.toThrow(ValidationError);
      await expect(service.createApartment(invalidData)).rejects.toThrow('Bathrooms must be 0 or greater');
    });

    it('should throw ValidationError when bedrooms is negative', async () => {
      const invalidData = { ...validApartmentData, bedrooms: -1 };

      await expect(service.createApartment(invalidData)).rejects.toThrow(ValidationError);
      await expect(service.createApartment(invalidData)).rejects.toThrow('Bedrooms must be 0 or greater');
    });

    it('should throw ValidationError when duplicate unit number exists in same project', async () => {
      const existingApartment = {
        ...mockApartment,
        unitNumber: validApartmentData.unitNumber,
        projectName: validApartmentData.projectName,
      };
      mockRepository.findAll.mockResolvedValue([existingApartment] as Apartment[]);

      await expect(service.createApartment(validApartmentData)).rejects.toThrow(ValidationError);
      await expect(service.createApartment(validApartmentData)).rejects.toThrow(
        'Apartment with this unit number already exists in this project'
      );
    });
  });
});

