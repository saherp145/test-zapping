/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cars', {
    idcar: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'idcar'
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'code'
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'description'
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'price'
    },
    km: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'km'
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'year'
    },
    url: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'url'
    },
    idlocation: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'locations',
        key: 'idlocation'
      },
      field: 'idlocation'
    }
  }, {
    tableName: 'cars'
  });
};
