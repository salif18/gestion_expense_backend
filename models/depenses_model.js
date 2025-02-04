const mongoose = require("mongoose");

// Schéma pour la collection `expenses`
const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à la collection `users`
        required: false // Peut être null
    },
    categorie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie', // Référence à la collection `categories`
        required: false // Peut être null
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget', // Référence à la collection `budgets`
        required: false // Peut être null
    },
    amount: {
        type: Number,
        required: false // Peut être null
    },
    description: {
        type: String,
        required: false // Peut être null
    },
    date_expenses: {
        type: Date,
        default: Date.now // Valeur par défaut : date actuelle
    }
}, { timestamps: true }); // Ajoute automatiquement `createdAt` et `updatedAt`

// Créer le modèle `Expense`
module.exports =  mongoose.model('Expense', expenseSchema);


