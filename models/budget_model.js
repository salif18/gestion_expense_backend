const mongoose = require("mongoose");

// Schéma pour la collection Budgets
const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à la collection Users
        required: false // Peut être null
    },
    budget_amount: {
        type: Number,
        required: false // Peut être null
    },
    budget_date: {
        type: Date,
        default: Date.now // Date actuelle par défaut
    }
}, { 
    timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Méthodes pour les relations
budgetSchema.virtual('depense', {
    ref: 'Expense', // Modèle à lier
    localField: '_id', // Champ dans Budget
    foreignField: 'budgetId', // Champ dans Expense
    justOne: false // Relation hasMany
});

// Activation des virtuels pour les requêtes
budgetSchema.set('toObject', { virtuals: true });
budgetSchema.set('toJSON', { virtuals: true });

// Création du modèle
 module.exports = mongoose.model('Budget', budgetSchema);

