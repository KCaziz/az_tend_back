import { Message } from "../models/messageModel.js";
import { Sector } from "../models/sectorModel.js";
import { Subscription } from "../models/subscriptionModel.js";
import { Tender } from "../models/tenderModel.js";
import { User } from "../models/userModel.js";
//import { Sector } from "../models/sectorModel.js";
import bcrypt from "bcryptjs";

//compléter les champs manquant de user après la connexion avec google
export const updateProfile = async (req, res) => {
  try {
    const { tel, wilaya } = req.body;

    if (!tel || !wilaya) {
      return res
        .status(400)
        .json({ status: "fail", message: "Champ manquant !" });
    }

    req.user.tel = tel;
    req.user.wilaya = wilaya;

    await req.user.save();

    res.status(200).json({ status: "success", data: { user: req.user } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

//Changer le mot de passe
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Veuillez fournir tous les champs nécessaires",
      });
    }

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Les nouveaux mots de passe ne correspondent pas",
      });
    }

    // Trouver l'utilisateur par son ID (assurez-vous que l'utilisateur est authentifié)
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Utilisateur non trouvé",
      });
    }

    // Vérifiez le mot de passe actuel
    const isCorrectPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCorrectPassword) {
      return res.status(401).json({
        status: "fail",
        message: "Mot de passe actuel incorrect",
      });
    }

    // Mettre à jour le mot de passe
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Fonction pour mettre à jour les informations personnelles
export const updatePersonalInfo = async (req, res) => {
  try {
    const { nom, prenom, wilaya, tel } = req.body;

    if (!nom || !prenom || !wilaya || !tel) {
      return res.status(400).json({
        status: "fail",
        message: "Veuillez fournir tous les champs nécessaires",
      });
    }

    // Mettre à jour les informations personnelles
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { nom, prenom, wilaya, tel },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Informations personnelles mises à jour avec succès",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//Demander un abonnement
export const askForSubscription = async (req, res) => {
  try {
    const { type, dateDeb, dateFin, sectors } = req.body;
    userId = req.user._id;

    if (new Date(dateDeb) > new Date(dateFin)) {
      // Vérification des dates
      return res.status(400).send({
        status: "fail",
        message: "La date de début ne peut pas être après la date de fin.",
      });
    }

    //validation des secteurs
    const validSectors = await Sector.find({ _id: { $in: sectors } });
    if (validSectors.length !== sectors.length) {
      return res.status(400).send({
        status: "fail",
        message: "Certains ID de secteurs sont invalides.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        status: "fail",
        message: "Utilisateur non trouvé.",
      });
    }

    const newSubscription = new Subscription({
      user: userId,
      type,
      dateDeb,
      dateFin,
      sectors,
      status: "asked", // Par défaut, le statut sera 'asked'
    });

    await newSubscription.save();

    res.status(201).json({
      status: "success",
      data: {
        subscription: newSubscription,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Erreur lors de la demande d'abonnement",
      error: error.message,
    });
  }
};

//vérification de l'abonnement d'un utilisateur
export const checkSubscription = async (req, res) => {
  try {
    const userId = req.user._id; // Assurez-vous que l'utilisateur est authentifié et que son ID est dans req.user

    // Rechercher les abonnements de l'utilisateur
    const subscriptions = await Subscription.find({
      user: userId,
      status: "updated",
    }).populate("sectors");

    if (subscriptions.length > 0) {
      // Extraire les secteurs des abonnements
      const sectors = subscriptions
        .flatMap((subscription) => subscription.sectors)
        .filter((sector) => sector); // Filtrer les secteurs non définis

      res.status(200).json({
        status: "success",
        sectors,
      });
    } else {
      res.status(200).json({
        status: "success",
        sectors: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Erreur lors de la vérification de l'abonnement",
      error: error.message,
    });
  }
};

//Envoyer un message dans la rubrique Contact
export const addMessage = async (req, res) => {
  try {
    const { nom, tel, email, body } = req.body;

    // Crée un nouveau message
    const newMessage = new Message({
      nom,
      tel,
      email,
      body,
    });

    // Sauvegarde le message dans la base de données
    await newMessage.save();

    res.status(201).json({
      status: "success",
      data: {
        message: newMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Erreur lors de l'ajout du message",
      error: error.message,
    });
  }
};

// Détail d'un tender
export const getSingleTender = async (req, res) => {
  try {
    // Récupérer l'appel d'offres par son ID
    const tender = await Tender.findById(req.params.id).populate("sectors");

    if (!tender) {
      return res.status(404).json({
        status: "fail",
        message: "Appel d'offres non trouvé",
      });
    }

    // Récupérer les abonnements de l'utilisateur
    const subscriptions = await Subscription.find({
      user: req.user._id,
      status: "updated",
    }).populate("sectors");

    if (subscriptions.length === 0 && req.user.role ==="user") {
      return res.status(403).json({
        status: "fail",
        message: "Accès refusé. Vous n'êtes abonné à aucun secteur.",
      });
    }

    // Vérifier si l'utilisateur est abonné à au moins un des secteurs de l'appel d'offres
    const userSectors = subscriptions.flatMap((subscription) =>
      subscription.sectors.map((sector) => sector._id.toString())
    );
    const tenderSectors = tender.sectors.map((sector) => sector._id.toString());

    const isSubscribedToTender = tenderSectors.some((sector) =>
      userSectors.includes(sector)
    );

    if (!isSubscribedToTender) {
      return res.status(403).json({
        status: "fail",
        message:
          "Accès refusé. Vous n'êtes abonné à aucun secteur de cet appel d'offres.",
      });
    }

    // Renvoyer l'appel d'offres avec les informations pertinentes
    return res.status(200).json({
      status: "success",
      tender: tender,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: req.params.id,
    });
  }
};
