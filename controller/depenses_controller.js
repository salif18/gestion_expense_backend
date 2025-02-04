const Expense = require('../models/depenses_model');
const moment = require('moment');
const mongoose = require('mongoose')
// Créer une dépense
exports.createExpenses = async (req, res) => {
        try {

            const newExpense = new Expense({
                userId: req.body.userId,
                categorie_id: req.body.categorie_id,
                budgetId: req.body.budgetId,
                amount: req.body.amount,
                description: req.body.description,
                date_expenses: req.body.date_expenses || new Date()
            });

            const savedExpense = await newExpense.save();

            res.status(201).json({
                status: true,
                message: "Dépense ajoutée avec succès !",
                expense: savedExpense
            });

        } catch (error) {
            res.status(500).json({
                status: false,
                message: "Erreur lors de l'ajout",
                error: error.message
            });
        }
    }

// Récupérer les dépenses mensuelles
exports.getExpensesByUserMonth = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentMonth = new Date().getMonth() + 1;

        const expenses = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    $expr: { $eq: [{ $month: "$date_expenses" }, currentMonth] }
                }
            },
            { $sort: { date_expenses: -1 } },
            {
                $lookup: {
                    from: "categories",
                    localField: "categorie_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" }
        ]);

        const totalMonth = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        res.status(200).json({
            status: true,
            month: new Date().toLocaleString('fr-FR', { month: 'long' }),
            expenses: expenses,
            totalMonth: totalMonth
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Erreur lors de la récupération",
            error: error.message
        });
    }
};

exports.getExpensesByUserDay = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentDate = new Date().toISOString().split('T')[0];
        const startOfDay = new Date(currentDate);
        const endOfDay = new Date(currentDate + 'T23:59:59.999Z');

        const aggregationPipeline = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date_expenses: {
                        $gte: startOfDay,
                        $lt: endOfDay
                    }
                }
            },
            {
                $lookup: {
                    from: "categories", // Nom de la collection
                    localField: "categorie_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" }, // Déstructure le tableau
            { $sort: { date_expenses: -1 } }, // Tri décroissant
            {
                $group: {
                    _id: null,
                    expenses: { $push: "$$ROOT" }, // Garde tous les documents
                    totalDay: { $sum: "$amount" } // Calcule le total
                }
            },
            {
                $project: {
                    _id: 0,
                    expenses: 1,
                    totalDay: 1
                }
            }
        ];

        const result = await Expense.aggregate(aggregationPipeline);
        const response = result[0] || { expenses: [], totalDay: 0 };

        res.status(200).json({
            status: true,
            day: new Date().toLocaleDateString('fr-FR', { weekday: 'long' }),
            expenses: response.expenses,
            totalDay: response.totalDay
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Erreur lors de la récupération",
            error: error.message
        });
    }
};

// Supprimer une dépense
exports.deleteExpenses = async (req, res) => {
    try {
        const deleted = await Expense.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                status: false,
                message: "Dépense non trouvée"
            });
        }

        res.status(200).json({
            status: true,
            message: "Dépense supprimée avec succès"
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Erreur lors de la suppression",
            error: error.message
        });
    }
};

