const ResourceTypes = require('../types/ResourceTypes');

module.exports = (sequelize, DataTypes) =>
    sequelize.define(
        'Resources',
        {
            resourceId: { type: DataTypes.STRING, allowNull: false },
            type: { type: DataTypes.ENUM, values: ResourceTypes.values, allowNull: false },
            creator: { type: DataTypes.STRING, allowNull: true },
            data: { type: DataTypes.JSONB, allowNull: true }
        },
        { indexes: [{ unique: true, fields: ['resourceId'] }] }
    );
