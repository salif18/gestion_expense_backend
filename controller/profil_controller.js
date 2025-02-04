const User = require('../models/user_model');


// Mise à jour du profil utilisateur
exports.updateProfil = async (req, res) => {
    const { userId } = req.params;
    const { name, phone_number, email } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Mise à jour des informations de l'utilisateur
        if (name) user.name = name;
        if (phone_number) user.phone_number = phone_number;
        if (email) user.email = email;

        await user.save();

        return res.status(200).json({
            status: true,
            message: 'Modification apportée avec succès !!',
            profil: {
                name: user.name,
                phone_number: user.phone_number,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
