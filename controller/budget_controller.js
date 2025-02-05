const Budget = require("../models/budget_model");

// Ajouter un budget
exports.createBudgets = async (req, res) => {
  try {

    const { userId, budget_amount, budget_date } = req.body;

    // Obtenir l'année et le mois actuels
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Vérifier si un budget existe déjà pour ce mois
    const existingBudget = await Budget.findOne({
        userId: userId,
        $expr: {
            $and: [
                { $eq: [{ $year: "$budget_date" }, currentYear] },
                { $eq: [{ $month: "$budget_date" }, currentMonth] }
            ]
        }
    });

    if (existingBudget) {
        return res.status(400).json({
            status: false,
            message: "Un budget pour ce mois existe déjà !"
        });
    }

    // Créer le budget
    const newBudget = new Budget({
        userId: userId,
        budget_amount: budget_amount,
        budget_date: budget_date || new Date()
    });

    await newBudget.save();

    return res.status(200).json({
        status: true,
        budgets: newBudget,
        message: "Budget ajouté"
    });

} catch (err) {
    return res.status(500).json({
        status: false,
        error: err.message
    });
}
};

//Récupérer le budget actuel d'un utilisateur
exports.getCurrentBudget = async (req, res) => {
  try {
    const { userId } = req.params;

    // Obtenir l'année et le mois actuels
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Récupérer le budget pour le mois en cours
    const budget = await Budget.findOne({
        userId: userId,
        $expr: {
            $and: [
                { $eq: [{ $year: "$budget_date" }, currentYear] },
                { $eq: [{ $month: "$budget_date" }, currentMonth] }
            ]
        }
    });

    if (budget) {
        return res.status(200).json({
            status: true,
            budget: budget
        });
    } else {
        return res.status(404).json({
            status: false,
            message: "Aucun budget trouvé pour le mois en cours"
        });
    }

} catch (err) {
    return res.status(500).json({
        status: false,
        error: err.message
    });
}
};

// Récupérer les rapports du budget actuel
exports.getRapportsCurrentBudget = async (req, res) => {
  try {
    const { userId } = req.params;

    // Obtenir l'année et le mois actuels
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Récupérer le budget pour le mois en cours avec les dépenses associées
    const budget = await Budget.findOne({
        userId: userId,
        $expr: {
            $and: [
                { $eq: [{ $year: "$budget_date" }, currentYear] },
                { $eq: [{ $month: "$budget_date" }, currentMonth] }
            ]
        }
    }).populate('depense'); // Assurez-vous que 'expenses' est la référence correcte

    if (budget) {
        // Calculer la somme des dépenses
        const totalExpenses = budget.depense.reduce((sum, expense) => sum + expense.amount, 0);

        // Calculer le pourcentage et l'épargne
        const percentage = (totalExpenses * 100) / budget.budget_amount;
        const epargne = budget.budget_amount - totalExpenses;

        // Préparer le résultat
        const result = {
            id: budget._id,
            userId: budget.userId,
            budget_amount: budget.budget_amount,
            budget_date: budget.budget_date,
            totalExpenses: totalExpenses,
            epargnes: epargne,
            percent: percentage.toFixed(1)
        };

        return res.status(200).json({
            status: true,
            resultat: result,
            expensesLieTobudget: budget.expenses
        });

    } else {
        return res.status(404).json({
            status: false,
            message: "Aucun budget trouvé pour le mois en cours"
        });
    }

} catch (err) {
    return res.status(500).json({
        status: false,
        error: err.message
    });
}
};

//Récupérer tous les budgets d'un utilisateur
exports.getAllBudget = async (req, res) => {
  try {
    const { userId } = req.params;

    // Récupérer tous les budgets de l'utilisateur avec les dépenses associées
    const budgets = await Budget.find({ userId: userId })
        .populate('depense') // Assurez-vous que 'expenses' est la référence correcte
        .sort({ budget_date: 1 });

    if (!budgets.length) {
        return res.status(404).json({
            status: false,
            message: "Aucun budget trouvé"
        });
    }

    return res.status(200).json({
        status: true,
        ExpensesOfBudget: budgets
    });

} catch (err) {
    return res.status(500).json({
        status: false,
        message: "Erreur de requête",
        error: err.message
    });
}
};
