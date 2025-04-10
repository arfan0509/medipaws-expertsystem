const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Gejala = db.define(
  "gejala",
  {
    id_gejala: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kode_gejala: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    nama_gejala: { type: DataTypes.STRING, allowNull: false, unique: true },
    // bobot: { type: DataTypes.DECIMAL(3, 2), allowNull: true }, // sudah dihapus dari DB
  },
  {
    tableName: "gejala",
    timestamps: false,
  }
);

// Relasi ke tabel lain jika ada
Gejala.associate = (models) => {
  Gejala.hasMany(models.RelasiPenyakitGejala, {
    foreignKey: "id_gejala",
    onDelete: "CASCADE",
  });
};

module.exports = Gejala;
