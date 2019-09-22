/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('locations', {
    idlocation: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'idlocation'
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'description'
    }
  }, {
    tableName: 'locations'
  });
};
