const mongoose = require("mongoose");

// const CategorySchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     name_categories: {
//       type: String,
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Categories", CategorySchema);
// Schéma pour les catégories
const categorieSchema = new mongoose.Schema({
    userId: {
        type: String,
        // mongoose.Schema.Types.ObjectId,
        // ref: 'User', // Relation avec User
        required: false // nullable
    },
    name_categories: {
        type: String,
        required: false // nullable
    }
}, { 
    timestamps: true // created_at et updated_at
});

// Relation hasMany avec Expense
categorieSchema.virtual('expenses', {
    ref: 'Expense', // Modèle cible
    localField: '_id', // Clé locale
    foreignField: 'categorie_id', // Clé étrangère dans Expense
    justOne: false // Relation 1-n
});

// Activation des virtuels pour les requêtes
categorieSchema.set('toObject', { virtuals: true });
categorieSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Categorie', categorieSchema);


