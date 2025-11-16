import { ApartmentRepository } from '../repositories/apartmentRepository';
import { CreateApartmentDTO } from '../types/apartment';
import Apartment from '../models/Apartment';
import { ValidationError, NotFoundError } from '../errors/AppError';

export class ApartmentService {
  private apartmentRepository: ApartmentRepository;

  constructor() {
    this.apartmentRepository = new ApartmentRepository();
  }

  /**
   * Get all apartments with optional pagination and search
   */
  async listApartments(limit?: number, offset?: number, searchTerm?: string): Promise<{
    apartments: Apartment[];
    total: number;
    limit?: number;
    offset?: number;
    searchTerm?: string;
  }> {
    const apartments = await this.apartmentRepository.findAll(limit, offset, searchTerm);
    const total = await this.apartmentRepository.count(searchTerm);

    return {
      apartments,
      total,
      limit,
      offset,
      searchTerm: searchTerm?.trim(),
    };
  }

  /**
   * Get apartment by ID
   */
  async getApartmentById(id: number): Promise<Apartment> {
    const apartment = await this.apartmentRepository.findById(id);
    
    if (!apartment) {
      throw new NotFoundError('Apartment not found');
    }

    return apartment;
  }

  /**
   * Create a new apartment
   */
  async createApartment(apartmentData: CreateApartmentDTO): Promise<Apartment> {
    // Validate required fields
    this.validateApartmentData(apartmentData);

    // Check if unit number already exists in the same project
    const existing = await this.apartmentRepository.findAll();
    const duplicate = existing.find(
      (apt) => apt.unitNumber === apartmentData.unitNumber
    );

    if (duplicate) {
      throw new ValidationError('Apartment with this unit number already exists in this project');
    }

    return await this.apartmentRepository.create(apartmentData);
  }

  /**
   * Validate apartment data
   */
  private validateApartmentData(data: CreateApartmentDTO): void {
    if (!data.unitName || data.unitName.trim().length === 0) {
      throw new ValidationError('Unit name is required');
    }
    if (!data.unitNumber || data.unitNumber.trim().length === 0) {
      throw new ValidationError('Unit number is required');
    }
    if (!data.projectName || data.projectName.trim().length === 0) {
      throw new ValidationError('Project name is required');
    }
    if (!data.unitLocation || data.unitLocation.trim().length === 0) {
      throw new ValidationError('Unit location is required');
    }
    if (data.price === undefined || data.price <= 0) {
      throw new ValidationError('Price must be greater than 0');
    }
    if (data.area === undefined || data.area <= 0) {
      throw new ValidationError('Area must be greater than 0');
    }
    if (data.bathrooms === undefined || data.bathrooms < 0) {
      throw new ValidationError('Bathrooms must be 0 or greater');
    }
    if (data.bedrooms === undefined || data.bedrooms < 0) {
      throw new ValidationError('Bedrooms must be 0 or greater');
    }
    if (!data.floorNumber || data.floorNumber.trim().length === 0) {
      throw new ValidationError('Floor number is required');
    }
  }
}

