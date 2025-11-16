import { Op } from 'sequelize';
import Apartment from '../models/Apartment';
import { CreateApartmentDTO } from '../types/apartment';

export class ApartmentRepository {
  /**
   * Get all apartments with optional pagination and search
   */
  async findAll(limit?: number, offset?: number, searchTerm?: string): Promise<Apartment[]> {
    const options: any = {
      order: [['id', 'ASC']],
    };

    // Add search condition if searchTerm is provided
    if (searchTerm && searchTerm.trim().length > 0) {
      options.where = {
        [Op.or]: [
          { projectName: { [Op.iLike]: `%${searchTerm.trim()}%` } },
          { unitName: { [Op.iLike]: `%${searchTerm.trim()}%` } },
          { unitNumber: { [Op.iLike]: `%${searchTerm.trim()}%` } },
        ],
      };
    }

    if (limit !== undefined) {
      options.limit = limit;
    }
    if (offset !== undefined) {
      options.offset = offset;
    }

    return await Apartment.findAll(options);
  }

  /**
   * Get total count of apartments with optional search
   */
  async count(searchTerm?: string): Promise<number> {
    const options: any = {};

    // Add search condition if searchTerm is provided
    if (searchTerm && searchTerm.trim().length > 0) {
      options.where = {
        [Op.or]: [
          { projectName: { [Op.iLike]: `%${searchTerm.trim()}%` } },
          { unitName: { [Op.iLike]: `%${searchTerm.trim()}%` } },
          { unitNumber: { [Op.iLike]: `%${searchTerm.trim()}%` } },
        ],
      };
    }

    const result = await Apartment.count(options);
    return typeof result === 'number' ? result : (result as any).length || 0;
  }

  /**
   * Find apartment by ID
   */
  async findById(id: number): Promise<Apartment | null> {
    return await Apartment.findByPk(id);
  }

  /**
   * Create a new apartment
   */
  async create(apartmentData: CreateApartmentDTO): Promise<Apartment> {
    return await Apartment.create(apartmentData as any);
  }
}

