module.exports = (sequelize, DataTypes) =>
    sequelize.define(
        'WidgetBackends',

        {
            widgetId: { type: DataTypes.STRING, allowNull: false },
            serviceName: { type: DataTypes.STRING, allowNull: false },
            method: { type: DataTypes.STRING, allowNull: false },
            script: { type: DataTypes.JSONB, allowNull: true }
        },
        { indexes: [{ unique: true, fields: ['widgetId', 'serviceName', 'method'] }] }
    );
