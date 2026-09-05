import axios from "axios";
import Material from "../models/Material.js";
import cloudinary from "../config/cloudinary.js";

export const getStudentMaterials = async (req, res) => {
  const materials = await Material.find({
    students: req.user._id,
  }).populate("faculty", "fullName");

  res.json(materials);
};

export const downloadStudentMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const allowed = material.students.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!allowed) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Fetch file from Cloudinary
    const fileResponse = await axios.get(material.filePath, {
      responseType: "stream",
    });

    // Set correct filename header manually
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${material.fileName}"`
    );

    res.setHeader("Content-Type", material.fileType);

    fileResponse.data.pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Download failed" });
  }
};
