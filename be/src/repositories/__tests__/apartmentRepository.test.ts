import { Op } from 'sequelize';
import { ApartmentRepository } from '../apartmentRepository';
import Apartment from '../../models/Apartment';
import { CreateApartmentDTO } from '../../types/apartment';

// Mock the Apartment model
jest.mock('../../models/Apartment');

describe('ApartmentRepository', () => {
  let repository: ApartmentRepository;
  let mockApartment: any;

  beforeEach(() => {
    repository = new ApartmentRepository();
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

  describe('findAll', () => {
    it('should return all apartments without pagination', async () => {
      const mockApartments = [mockApartment, { ...mockApartment, id: 2 }];
      (Apartment.findAll as jest.Mock).mockResolvedValue(mockApartments);

      const result = await repository.findAll();

      expect(Apartment.findAll).toHaveBeenCalledWith({
        order: [['id', 'ASC']],
      });
      expect(result).toEqual(mockApartments);
    });

    it('should return apartments with limit', async () => {
      const mockApartments = [mockApartment];
      (Apartment.findAll as jest.Mock).mockResolvedValue(mockApartments);

      const result = await repository.findAll(10);

      expect(Apartment.findAll).toHaveBeenCalledWith({
        order: [['id', 'ASC']],
        limit: 10,
      });
      expect(result).toEqual(mockApartments);
    });

    it('should search apartments when searchTerm is provided', async () => {
      const mockApartments = [mockApartment];
      (Apartment.findAll as jest.Mock).mockResolvedValue(mockApartments);

      const result = await repository.findAll(undefined, undefined, 'Test');

      expect(Apartment.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { projectName: { [Op.iLike]: '%Test%' } },
            { unitName: { [Op.iLike]: '%Test%' } },
            { unitNumber: { [Op.iLike]: '%Test%' } },
          ],
        },
        order: [['id', 'ASC']],
      });
      expect(result).toEqual(mockApartments);
    });

    it('should search apartments with pagination', async () => {
      const mockApartments = [mockApartment];
      (Apartment.findAll as jest.Mock).mockResolvedValue(mockApartments);

      const result = await repository.findAll(10, 0, 'Project');

      expect(Apartment.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { projectName: { [Op.iLike]: '%Project%' } },
            { unitName: { [Op.iLike]: '%Project%' } },
            { unitNumber: { [Op.iLike]: '%Project%' } },
          ],
        },
        order: [['id', 'ASC']],
        limit: 10,
        offset: 0,
      });
      expect(result).toEqual(mockApartments);
    });

    it('should not add search condition when searchTerm is empty', async () => {
      const mockApartments = [mockApartment];
      (Apartment.findAll as jest.Mock).mockResolvedValue(mockApartments);

      const result = await repository.findAll(undefined, undefined, '');

      expect(Apartment.findAll).toHaveBeenCalledWith({
        order: [['id', 'ASC']],
      });
      expect(result).toEqual(mockApartments);
    });
  });

  describe('count', () => {
    it('should return the total count of apartments', async () => {
      (Apartment.count as jest.Mock).mockResolvedValue(100);

      const result = await repository.count();

      expect(Apartment.count).toHaveBeenCalledWith({});
      expect(result).toBe(100);
    });

    it('should return count with search term', async () => {
      (Apartment.count as jest.Mock).mockResolvedValue(5);

      const result = await repository.count('Test');

      expect(Apartment.count).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { projectName: { [Op.iLike]: '%Test%' } },
            { unitName: { [Op.iLike]: '%Test%' } },
            { unitNumber: { [Op.iLike]: '%Test%' } },
          ],
        },
      });
      expect(result).toBe(5);
    });
  });

  describe('findById', () => {
    it('should return an apartment by ID', async () => {
      (Apartment.findByPk as jest.Mock).mockResolvedValue(mockApartment);

      const result = await repository.findById(1);

      expect(Apartment.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockApartment);
    });

    it('should return null when apartment not found', async () => {
      (Apartment.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(Apartment.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new apartment', async () => {
      const apartmentData: CreateApartmentDTO = {
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

      (Apartment.create as jest.Mock).mockResolvedValue({
        ...apartmentData,
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await repository.create(apartmentData);

      expect(Apartment.create).toHaveBeenCalledWith(apartmentData);
      expect(result).toHaveProperty('id');
      expect(result.id).toBe(2);
      expect(result).toHaveProperty('unitName', 'New Apartment');
    });
  });
});

