const Categories = require("../models/categories_model");

// Ajouter une catégorie
exports.createCategory = async (req, res) => {
  try {
   
    // Créer la catégorie
    const newCategorie = new Categories({
        userId: req.body.userId,
        name_categories: req.body.name_categories
    });

    const savedCategorie = await newCategorie.save();

    return res.status(201).json({
        status: true,
        message: "Catégorie ajoutée",
        categorie: savedCategorie
    });

} catch (error) {
    return res.status(500).json({
        status: false,
        message: "Erreur survenue lors de la requête",
        error: error.message
    });
}
}

// Récupérer les catégories
exports.getCategories = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Exécuter la requête
    const categories = await Categories.find({
        $or: [{ userId: userId }, { userId: "default" }]
    })
        .sort({ name_categories: 1 });

    return res.status(200).json({
        status: true,
        categories: categories
    });

} catch (error) {
    return res.status(500).json({
        status: false,
        message: "Erreur survenue lors de la requête",
        error: error.message
    });
}
};
