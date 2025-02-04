require("dotenv").config();
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const User = require('../models/user_model');




// // Durée de blocage en millisecondes (1 heure)
// const BLOCK_DURATION = 5 * 60 * 1000;

// // Nombre maximal de tentatives
// const TENTATIVES_MAX = 3;

// // Fonction pour réinitialiser le token de l'utilisateur
// exports.reset = async (req, res) => {
//     try {
//         const { numero, email } = req.body;

//         // Vérifier l'existence de l'utilisateur
//         const user = await Users.findOne({
//             $and: [{ numero: numero }, { email: email }]
//         });

//         if (!user) {
//             return res.status(401).json({
//                 message: "Cet utilisateur n'existe pas. Veuillez fournir le numéro et l'email avec lesquels vous vous êtes inscrit."
//             });
//         }

//         // Vérifier si l'utilisateur est bloqué (a atteint le nombre maximum de tentatives)
//         if (user.tentatives >= TENTATIVES_MAX && user.tentativesExpires > Date.now()) {
//             // Convertir 'attemptExpires' en heure locale
//             const tempsDattente = new Date(user.tentativesExpires).toLocaleString();
//             return res.status(429).json({
//                 message: `Nombre maximal de tentatives atteint. Veuillez réessayer après ${tempsDattente.split(" ")[1]}.`
//             });
//         }

//         // Générer un nombre aléatoire de 4 chiffres
//         const newToken = parseInt(Math.random() * 10000).toString().padStart(4, "0");

//         // Mettre à jour le token de l'utilisateur
//         user.remember_token = newToken;
//         user.tentatives += 1;  // Incrémenter les tentatives
//         if (user.tentatives >= TENTATIVES_MAX) {
//             user.tentativesExpires = Date.now() + BLOCK_DURATION;  // Définir l'expiration si les tentatives maximales sont atteintes
//         }
//         await user.save();
//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: "465",
//             auth: {
//               user: process.env.MAIL_FROM_ADDRESS,
//               pass: process.env.MAIL_PASSWORD,
//             },
//           });
      
//           const mailOption = {
//             from: "SalesPulse",
//             to: user.email,
//             subject: "Code de reinitialisation de mot de passe",
//             text: `Merci de cliquez sur ce lien pour réinitialiser votre mot de passe : ${newToken}`,
//           };
       
//           transporter.sendMail(mailOption); 
//         return res.status(200).json({
//             message: `Veuillez entrer ce code `
//         });
//     } catch (err) {
//         return res.status(500).json({
//             err: err.message || 'Erreur serveur'
//         });
//     }
// };

// // Fonction pour valider le nouveau mot de passe
// exports.valide = async (req, res) => {
//     try {
//         const { reset_token, new_password, confirm_password } = req.body;

//         // Trouver l'utilisateur par token de réinitialisation
//         const user = await Users.findOne({ remember_token: reset_token });

//         if (!user) {
//             return res.status(401).json({
//                 message: "Ce token a expiré"
//             });
//         }

//         // Vérifier si les mots de passe correspondent
//         if (new_password !== confirm_password) {
//             return res.status(401).json({
//                 message: "Les deux mots de passe ne sont pas identiques"
//             });
//         }

//         // Hacher un mot de passe
//         const salt = bcrypt.genSaltSync(10);
//         // Hasher le nouveau mot de passe
//         const hashedNewPassword = bcrypt.hashSync(new_password, salt);

//         // Mettre à jour le mot de passe de l'utilisateur et réinitialiser le token
//         user.password = hashedNewPassword;
//         user.remember_token = null;
//         user.tentatives = 0;  // Réinitialiser les tentatives en cas de succès
//         user.tentativesExpires = Date.now();  // Réinitialiser l'expiration
//         await user.save();

//         return res.status(200).json({
//             message: "Votre mot de passe a été modifié avec succès"
//         });
//     } catch (err) {
//         return res.status(500).json({
//             err: err.message || 'Erreur serveur'
//         });
//     }
// };


// Récupération de mot de passe
exports.resetPassword = async (req, res) => {
    const { numero, email } = req.body;

    try {
       
        // Recherche de l'utilisateur par numéro et email
        const user = await User.findOne({ phone_number: numero, email: email });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Cet utilisateur n\'existe pas'
            });
        }

        // Génération du code de réinitialisation
        const token = String(Math.floor(1000 + Math.random() * 9000)); // 4 chiffres
        user.remember_token = token;
        await user.save();

        // Envoi par email avec Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.MAIL_FROM_ADDRESS,
              pass: process.env.MAIL_PASSWORD,
            }
        });

        const mailOptions = {
            from: "Analyse depenses",
            to: user.email,
            subject: 'Récupération de mot de passe',
            html: `<b>Votre code de récupération est ${token}</b>`
        };

        await transporter.sendMail(mailOptions);

        // Envoi par SMS avec Twilio
        // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        // await client.messages.create({
        //     body: `Le code de validation est ${token}`,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: user.phone_number
        // });

        return res.status(200).json({
            status: true,
            message: 'Un code a été envoyé sur votre email et numéro de téléphone pour validation.',
            token
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Validation du mot de passe
exports.validatePasswordReset = async (req, res) => {
    const { resetToken, new_password, confirm_password } = req.body;

    try {

        // Recherche de l'utilisateur par le token de réinitialisation
        const user = await User.findOne({ remember_token: resetToken });
        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'Ce code a été expiré'
            });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({
                status: false,
                message: 'Les mots de passe ne correspondent pas'
            });
        }

        const salt = bcrypt.genSaltSync(10);
        // Hasher le nouveau mot de passe
        const hashedNewPassword = bcrypt.hashSync(new_password, salt);
        // Mise à jour du mot de passe
        user.password = hashedNewPassword;  // Utiliser bcrypt pour crypter le mot de passe si nécessaire
        user.remember_token = null;
        await user.save();

        return res.status(200).json({
            status: true,
            message: 'Votre mot de passe a été réinitialisé avec succès'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};





