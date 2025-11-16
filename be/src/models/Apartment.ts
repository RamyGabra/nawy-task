import {
    DataTypes,
    Model,
} from 'sequelize';
import { sequelize } from '../config/database';

class Apartment extends Model {
    declare id: number;
    declare unitName: string;
    declare unitNumber: string;
    declare price: number;
    declare projectName: string;
    declare unitLocation: string;
    declare area: number;
    declare bathrooms: number;
    declare bedrooms: number;
    declare floorNumber: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Apartment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    unitName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'unit_name',
    },
    unitNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'unit_number',
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    projectName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'project_name',
    },
    unitLocation: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'unit_location',
    },
    area: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    floorNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'floor_number',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: DataTypes.NOW,
    },
}, { 
    sequelize, 
    modelName: 'Apartment',
    tableName: 'apartments',
    timestamps: true,
    underscored: false,
    indexes: [
        {
            name: 'idx_apartments_project_name',
            fields: ['project_name'],
        },
        {
            name: 'idx_apartments_name',
            fields: ['unit_name'],
        },
        {
            name: 'idx_apartments_unit_number',
            fields: ['unit_number'],
        },
    ],
});

export default Apartment;
