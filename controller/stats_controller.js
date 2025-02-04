const Expense = require('../models/depenses_model');
const moment = require('moment');
const mongoose = require('mongoose');

// Statistiques par semaine
// exports.getExpensesByWeek = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const start = moment().startOf('week').toDate(); // Début de la semaine (lundi)
//         const end = moment().endOf('week').toDate(); // Fin de la semaine (dimanche)

//         const pipeline = [
//             {
//                 $match: {
//                     userId: new mongoose.Types.ObjectId(userId),
//                     date_expenses: { $gte: start, $lte: end }
//                 }
//             },
//             {
//                 $group: {
//                     _id: { $dateToString: { format: "%Y-%m-%d", date: "$date_expenses" } },
//                     total: { $sum: "$amount" }
//                 }
//             },
//             {
//                 $project: {
//                     date: "$_id",
//                     total: 1,
//                     _id: 0
//                 }
//             },
//             { $sort: { date: 1 } }
//         ];

//         const dailyStats = await Expense.aggregate(pipeline);
//          // Vérifiez si le tableau est vide
//          if (!dailyStats || dailyStats.length === 0) {
//             return res.status(200).json({
//                 status: true,
//                 stats: [],
//                 totalExpenses: 0
//             });
//         }
//         const weekTotal = dailyStats.reduce((sum, day) => sum + day.total, 0);

//         res.status(200).json({
//             status: true,
//             stats: dailyStats,
//             weekTotal: weekTotal
//         });

//     } catch (err) {
//         res.status(500).json({
//             status: false,
//             message: "Erreur",
//             error: err.message
//         });
//     }
// };

exports.getExpensesByWeek = async (req, res) => {
    try {
        const { userId } = req.params; // Récupère l'userId depuis les paramètres de l'URL

        const startOfWeek = moment().startOf("isoWeek"); // Début de la semaine (lundi)
        const endOfWeek = moment().endOf("isoWeek"); // Fin de la semaine (dimanche)

        let currentDate = startOfWeek.clone();
        let data = [];

        while (currentDate.isSameOrBefore(endOfWeek, "day")) {
            const expenses = await Expense.find({
                date_expenses: { $gte: currentDate.startOf("day").toDate(), $lte: currentDate.endOf("day").toDate() },
                userId: userId,
            });

            const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

            data.push({
                date: currentDate.format("YYYY-MM-DD"),
                total: totalExpenses,
            });

            currentDate.add(1, "day"); // Passe au jour suivant
        }

        // Calcul du total des dépenses de la semaine
        const weekTotalSum = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date_expenses: { $gte: startOfWeek.toDate(), $lte: endOfWeek.toDate() }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        res.status(200).json({
            status: true,
            stats: data,
            weekTotal: weekTotalSum.length > 0 ? weekTotalSum[0].totalAmount : 0
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Erreur",
            errors: error.message
        });
    }
};

// Statistiques mensuelles détaillées
exports.getExpensesAllDayByMonth = async (req, res) => {
    try {
        const userId = req.params.userId;
        const start = moment().startOf('month').toDate(); // Début du mois
        const end = moment().endOf('month').toDate(); // Fin du mois

        const pipeline = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date_expenses: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date_expenses" } },
                    total: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    date: "$_id",
                    total: 1,
                    _id: 0
                }
            },
            { $sort: { date: 1 } }
        ];

        const result = await Expense.aggregate(pipeline);

        res.status(200).json({
            status: true,
            data: result
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Erreur de requête",
            error: err.message
        });
    }
};

// Statistiques par mois
exports.getExpensesByMonth = async (req, res) => {
    try {
        const userId = req.params.userId;
        const start = moment().startOf('year').toDate(); // Début de l'année
        const end = moment().endOf('year').toDate(); // Fin de l'année

        const pipeline = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date_expenses: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $month: "$date_expenses" },
                    total: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    month: { $toString: "$_id" },
                    total: 1,
                    _id: 0
                }
            },
            { $sort: { month: 1 } }
        ];

        

        const monthlyStats = await Expense.aggregate(pipeline);

         // Vérifiez si le tableau est vide
         if (!monthlyStats || monthlyStats.length === 0) {
            return res.status(200).json({
                status: true,
                stats: [],
                totalExpenses: 0
            });
        }
        const yearTotal = monthlyStats.reduce((sum, month) => sum + month.total, 0);

        res.status(200).json({
            status: true,
            stats: monthlyStats,
            monthTotal: yearTotal
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Erreur de récupération",
            error: err.message
        });
    }
};

// Catégorie la plus dépensée
exports.mostCategoriExpenses = async (req, res) => {
    try {
        const userId = req.params.userId;
        const start = moment().startOf('month').toDate(); // Début du mois
        const end = moment().endOf('month').toDate(); // Fin du mois

        const pipeline = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date_expenses: { $gte: start, $lte: end }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categorie_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $group: {
                    _id: "$categorie_id",
                    total_amount: { $sum: "$amount" },
                    category: { $first: "$category" }
                }
            },
            { $sort: { total_amount: -1 } },
            { $limit: 1 }
        ];

        const result = await Expense.aggregate(pipeline);

        res.status(200).json({
            status: true,
            expenses: result[0] || null
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Erreur",
            error: err.message
        });
    }
};

// Toutes les dépenses par année
exports.getAllExpensesForYear = async (req, res) => {
    try {
        const userId = req.params.userId;

        const pipeline = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId) // Filtre par utilisateur
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date_expenses" }, // Groupe par année
                        month: { $month: "$date_expenses" } // Groupe par mois
                    },
                    total: { $sum: "$amount" } // Somme des dépenses
                }
            },
            {
                $project: {
                    month: {
                        $dateToString: {
                            format: "%Y-%m", // Format 'YYYY-MM'
                            date: {
                                $dateFromParts: {
                                    year: "$_id.year",
                                    month: "$_id.month",
                                    day: 1
                                }
                            }
                        }
                    },
                    total: 1,
                    _id: 0
                }
            },
            { $sort: { month: 1 } } // Trie par mois
        ];

        const monthlyStats = await Expense.aggregate(pipeline);
        const totalExpenses = monthlyStats.reduce((sum, month) => sum + month.total, 0);

        res.status(200).json({
            status: true,
            stats: monthlyStats,
            totalExpenses: totalExpenses
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Une erreur s'est produite lors de la récupération des dépenses.",
            error: err.message
        });
    }
};