const { Op } = require("sequelize");
const Gejala = require("../models/Gejala");
const Penyakit = require("../models/Penyakit");
const RelasiPenyakitGejala = require("../models/RelasiPenyakitGejala");

// ✅ Tambah Relasi Penyakit - Gejala
exports.tambahRelasi = async (req, res) => {
  try {
    const { id_penyakit, id_gejala, bobot } = req.body;

    // Validasi bobot langsung dari req.body
    if (bobot < 0 || bobot > 1 || bobot === undefined || bobot === null) {
      return res.status(400).json({ message: "Bobot harus antara 0 dan 1" });
    }

    // Pastikan gejala dan penyakit ada
    const gejala = await Gejala.findByPk(id_gejala);
    const penyakit = await Penyakit.findByPk(id_penyakit);

    if (!gejala || !penyakit) {
      return res
        .status(404)
        .json({ message: "Gejala atau penyakit tidak ditemukan" });
    }

    // Cek duplikasi relasi
    const existingRelasi = await RelasiPenyakitGejala.findOne({
      where: { id_penyakit, id_gejala },
    });

    if (existingRelasi) {
      return res
        .status(400)
        .json({ message: "Relasi penyakit dan gejala ini sudah ada" });
    }

    // Tambahkan ke database
    const relasi = await RelasiPenyakitGejala.create({
      id_penyakit,
      id_gejala,
      bobot,
    });
    res.json({ message: "Relasi berhasil ditambahkan", relasi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ambil Semua Relasi Penyakit - Gejala (Dengan Join)
exports.getRelasi = async (req, res) => {
  try {
    const relasi = await RelasiPenyakitGejala.findAll({
      include: [
        {
          model: Penyakit,
          as: "penyakit",
          attributes: ["kode_penyakit", "nama_penyakit", "deskripsi", "solusi"],
        },
        {
          model: Gejala,
          as: "gejala",
          attributes: ["kode_gejala", "nama_gejala"], // Hapus "bobot" dari sini
        },
      ],
    });

    if (!relasi.length) {
      return res
        .status(404)
        .json({ message: "Tidak ada data relasi ditemukan" });
    }

    res.json(relasi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Bobot dalam Relasi Penyakit - Gejala
exports.updateRelasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { bobot } = req.body;

    if (bobot < 0 || bobot > 1 || bobot === undefined || bobot === null) {
      return res.status(400).json({ message: "Bobot harus antara 0 dan 1" });
    }

    const relasi = await RelasiPenyakitGejala.update(
      { bobot },
      { where: { id_relasi: id } }
    );

    if (relasi[0] === 1) {
      res.json({ message: "Bobot relasi berhasil diperbarui" });
    } else {
      res.status(404).json({ message: "Relasi tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Hapus Relasi Penyakit - Gejala
exports.hapusRelasi = async (req, res) => {
  try {
    const { id } = req.params;
    const relasi = await RelasiPenyakitGejala.destroy({
      where: { id_relasi: id },
    });

    if (relasi) {
      res.json({ message: "Relasi berhasil dihapus" });
    } else {
      res.status(404).json({ message: "Relasi tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
