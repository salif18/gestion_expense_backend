require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require("../models/user_model");


// Inscription
exports.register = async (req, res) => {
  try {

    const { name, phone_number, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] });
    if (existingUser) {
      return res.status(400).json({ status: false, message: "Email ou téléphone déjà utilisé" });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = new User({
      name,
      phone_number,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

    res.status(201).json({
      status: true,
      message: "Compte créé avec succès !!",
      profil: { name, phone_number, email },
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { contacts, password } = req.body;

    const user = await User.findOne({ $or: [{ email: contacts }, { phone_number: contacts }] });
    if (!user) {
      return res.status(401).json({ status: false, message: "Email ou téléphone incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

    res.status(200).json({
      status: true,
      message: "Connecté avec succès !!",
      userId: user._id,
      token,
      profil: user,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Mise à jour du mot de passe
exports.updatePassword = async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Mot de passe actuel incorrect" });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ status: false, message: "Les mots de passe ne correspondent pas" });
    }

    user.password = await bcrypt.hash(new_password, 10);
    await user.save();

    res.status(200).json({ status: true, message: "Mot de passe modifié avec succès" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Déconnexion (suppression du token côté client)
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ status: true, message: "Déconnecté avec succès !!" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Suppression de compte
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    await User.findByIdAndDelete(userId);

    res.status(200).json({ status: true, message: "Compte supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
