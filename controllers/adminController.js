import bcrypt from "bcryptjs";
import { Message } from "../models/messageModel.js";
import { Sector } from "../models/sectorModel.js";
import { Subscription } from "../models/subscriptionModel.js";
import { Tender } from "../models/tenderModel.js";
import { User } from "../models/userModel.js";

//****************************************************************
// ************* Tenders controllers *****************************
//****************************************************************
// ajouter un nouveau tender
// export const addTender = async (req, res) => {
//   try {
//     // Assurez-vous que req.file existe et contient l'URL de l'image téléchargée
//     const imageUrl = req.file ? req.file.path : null;
//     if (
//       !req.body.title ||
//       !req.body.entreprise ||
//       !req.body.type ||
//       !req.body.dateDebut ||
//       !req.body.dateEchehance ||
//       !req.body.wilaya ||
//       !req.body.sectors
//     ) {
//       if (imageUrl) {
//         //suppréssion de l'image dans cloudinary
//         const publicId = req.file.path.split("/").pop().split(".")[0];
//         await cloudinary.v2.uploader.destroy(publicId);
//       }
//       return res.status(500).send({
//         message: "champs manquants",
//       });
//     }
//     const {
//       title,
//       entreprise,
//       anep,
//       journal,
//       type,
//       dateDebut,
//       dateEchehance,
//       tel,
//       wilaya,
//       sectors,
//     } = req.body;

//     // Convertir les dates en objets moment pour faciliter la comparaison
//     const dateDebutMoment = moment(dateDebut);
//     const dateEcheanceMoment = moment(dateEcheance);
//     const todayMoment = moment().startOf("day"); // Début de la journée actuelle

//     // Vérifier que dateEcheance n'est pas inférieure à aujourd'hui
//     if (dateEcheanceMoment.isBefore(todayMoment)) {
//       //suppréssion de l'image dans cloudinary
//       if (imageUrl) {
//         const publicId = req.file.path.split("/").pop().split(".")[0];
//         await cloudinary.v2.uploader.destroy(publicId);
//       }
//       return res.status(400).json({
//         status: "fail",
//         message:
//           "La date d'échéance ne peut pas être inférieure à aujourd'hui.",
//       });
//     }

//     // Vérifier que dateEcheance n'est pas inférieure à dateDebut
//     if (dateEcheanceMoment.isBefore(dateDebutMoment)) {
//       //suppréssion de l'image dans cloudinary
//       if (imageUrl) {
//         const publicId = req.file.path.split("/").pop().split(".")[0];
//         await cloudinary.v2.uploader.destroy(publicId);
//       }
//       return res.status(400).json({
//         status: "fail",
//         message:
//           "La date d'échéance ne peut pas être inférieure à la date de début.",
//       });
//     }

//     // Vérifiez que tous les ID de secteurs sont valides
//     const validSectors = await Sector.find({ _id: { $in: sectors } });
//     if (validSectors.length !== sectors.length) {
//       //suppréssion de l'image dans cloudinary
//       if (imageUrl) {
//         const publicId = req.file.path.split("/").pop().split(".")[0];
//         await cloudinary.v2.uploader.destroy(publicId);
//       }
//       return res.status(400).send({
//         status: "fail",
//         message: "Certains IDs de secteurs sont invalides.",
//       });
//     }

//     // Créez un nouveau tender avec les informations fournies
//     const newTender = await Tender.create({
//       title: title,
//       entreprise: entreprise,
//       anep: anep,
//       journal: journal,
//       type: type,
//       dateDebut: dateDebut,
//       dateEchehance: dateEchehance,
//       imageUrl: imageUrl, // Associez l'image avec le tender
//       tel: tel,
//       wilaya: wilaya,
//       sectors: sectors,
//     });
//     console.log('test');
//     console.log(imageUrl);

//     if(!newTender){
//       return res.status(400).json({
//         status: "fail",
//         message:
//           "Pas de creation.",
//       });
//     }

//     res.status(201).json({
//       status: "success",
//       data: {
//         tender: newTender,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: req.body,
//     });
//   }
// };
export const addTender = async (req, res) => {
  try {
    // Récupération des données envoyées dans le corps de la requête
    const {
      title,
      entreprise,
      anep,
      journal,
      type,
      dateDebut,
      dateEchehance,
      wilaya,
      sectors,
    } = req.body;

    // Vérification de l'upload de l'image
    const imageUrl = req.file ? req.file.path : null;

    // Validation des champs requis
    if (
      !title ||
      !entreprise ||
      !type ||
      !dateDebut ||
      !dateEchehance ||
      !wilaya ||
      !sectors
    ) {
      return res.status(400).json({
        status: "fail",
        message: req.body,
      });
    }

    // Création du nouveau tender
    const newTender = new Tender({
      title,
      entreprise,
      anep,
      journal,
      type,
      dateDebut,
      dateEchehance,
      imageUrl,
      wilaya,
      sectors,
    });

    // Sauvegarde dans la base de données
    const savedTender = await newTender.save();

    // Réponse de succès
    res.status(201).json({
      status: "success",
      data: savedTender,
    });
  } catch (error) {
    // Gestion des erreurs
    console.error("Error adding tender:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de l'ajout du tender",
      error: error.message, // Ajout du message d'erreur pour le débogage
    });
  }
};

// Récupérer tous les tenders
export const getTenders = async (req, res) => {
  try {
    const tenders = await Tender.find().populate("sectors");
    res.status(200).json({ tenders: tenders });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getSingleTender = async (req, res) => {
  try {
    // Récupérer l'appel d'offres par son ID
    const tender = await Tender.findById(req.params.id).populate("sectors");

    if (!tender || !req.params.id) {
      return res.status(404).json({
        status: "fail",
        message: "Appel d'offres non trouvé",
      });
    }

    // Renvoyer l'appel d'offres avec les informations pertinentes
    return res.status(200).json({
      status: "success",
      message : req.params.id,
      tender: tender,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

// Mettre à jour un tender
export const updateTender = async (req, res) => {
  try {
    // Vérifiez que tous les ID de secteurs sont valides
    if (req.body.sectors) {
      const validSectors = await Sector.find({
        _id: { $in: req.body.sectors },
      });
      if (validSectors.length !== req.body.sectors.length) {
        return res.status(400).send({
          message: "Certains IDs de secteurs sont invalides.",
        });
      }
    }

    // Si une nouvelle image est téléchargée, ajoutez son URL
    if (req.file) {
      req.body.imageUrl = req.file.path;
    }

    const tender = await Tender.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tender) {
      return res.status(404).send({
        message: "Appel d'offre non trouvé",
      });
    }
    res.status(200).send(tender);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Supprimer un tender
export const deleteTender = async (req, res) => {
  try {
    const tender = await Tender.findByIdAndDelete(req.params.id);
    if (!tender) {
      return res.status(404).send({
        message: "Appel d'offre non trouvé",
      });
    }
    res.status(200).send({
      message: "Appel d'offre supprimé avec succès",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//****************************************************************
// *************  Sectors controllers ****************************
//****************************************************************
// Ajouter un nouveau secteur
export const addSector = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).send({
        message: "Champ manquant !",
      });
    }

    const newSector = {
      title: req.body.title,
    };

    const sector = await Sector.create(newSector);
    return res.status(201).send(sector);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

// Récupérer tous les secteurs
export const getSectors = async (req, res) => {
  try {
    const sectors = await Sector.find();
    res.status(200).json(sectors);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Mettre à jour un secteur
export const updateSector = async (req, res) => {
  try {
    const sector = await Sector.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!sector) {
      return res.status(404).send({
        message: "Secteur non trouvé",
      });
    }

    res.status(200).send(sector);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Supprimer un secteur
export const deleteSector = async (req, res) => {
  try {
    const sector = await Sector.findByIdAndDelete(req.params.id);

    if (!sector) {
      return res.status(404).send({
        message: "Secteur non trouvé",
      });
    }

    res.status(200).send({
      message: "Secteur supprimé avec succès",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//****************************************************************
// ************* Admin controllers *******************************
//****************************************************************
// ajouter un nouveau Admin
export const addAdmin = async (req, res) => {
  try {
    if (
      !req.body.nom ||
      !req.body.prenom ||
      !req.body.tel ||
      !req.body.wilaya ||
      !req.body.email ||
      !req.body.password ||
      !req.body.passwordConfirm
    ) {
      return res.status(400).send({
        message: "Champ manquant !",
      });
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Vérifiez le mot de passe de confirmation",
      });
    }
    const newAdmin = await User.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      tel: req.body.tel,
      wilaya: req.body.wilaya,
      email: req.body.email,
      password: req.body.password,
      role: "admin",
      nbrTenders: 0,
    });

    res.status(201).json({
      status: "success",
      data: {
        user: newAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//Récupérer les admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({
      status: "success",
      data: {
        users: admins,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//modifier un admin
// export const updateAdmin = async (req, res) => { //Je vois pas à quoi elle sert
//     try {
//         const { nom, prenom, tel, wilaya, email, password, passwordConfirm } = req.body;

//         // Vérifier si l'administrateur existe
//         const admin = await User.findById(req.params.id);
//         if (!admin || admin.role !== 'admin') {
//             return res.status(404).send({
//                 message: 'Administrateur non trouvé'
//             });
//         }

//         // Mettre à jour les informations de l'administrateur
//         if (nom) admin.nom = nom;
//         if (prenom) admin.prenom = prenom;
//         if (tel) admin.tel = tel;
//         if (wilaya) admin.wilaya = wilaya;
//         if (email) admin.email = email;

//         // Mettre à jour le mot de passe si fourni
//         if (password && passwordConfirm) {
//             if (password !== passwordConfirm) {
//                 return res.status(400).json({
//                     status: 'fail',
//                     message: 'Vérifiez le mot de passe de confirmation'
//                 });
//             }
//             admin.password = password;
//         }

//         await admin.save();
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 user: admin
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'fail',
//             message: error.message
//         });
//     }
// };

//supprimer un admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).send({
        message: "Administrateur non trouvé",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Administrateur supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//****************************************************************
//*********** USER (clients) & ABONNEMENT Controllers ************
//****************************************************************
// Récupérer tous les Users
export const getUsersInfos = async (req, res) => {
  try {
    // req.user est défini par protect
    const user = req.user;
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json({
      status: "success",
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("user")
      .populate("sectors");
    res.status(200).json({
      status: "success",

      subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getSingleSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findById(req.params.id)
      .populate("user")
      .populate("sectors");

    res.status(200).json({
      status: "success",
      subscriptions : subscriptions,

    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//************* Créer un abonnement ***********************
export const assignSubscription = async (req, res) => {
  try {
    const { userId, type, sectors, dateDeb, dateFin } = req.body;

    // Vérification de l'existence de l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        status: "fail",
        message: "Utilisateur non trouvé.",
      });
    }

    const AlreaySubscribed = await Subscription.findOne({ user: userId });
    if (AlreaySubscribed) {
      return res.status(400).send({
        status: "fail",
        message: `L'utilisateur ${user.nom} ${user.prenom} possède déjà un abonnement ${AlreaySubscribed.type} en cours.`,
      });
    }
    if (new Date(dateDeb) > new Date(dateFin)) {
      // Vérification des dates
      return res.status(400).send({
        status: "fail",
        message: "La date de début ne peut pas être après la date de fin.",
      });
    }

    // Vérification des secteurs
    const validSectors = await Sector.find({ _id: { $in: sectors } });
    if (validSectors.length !== sectors.length) {
      return res.status(400).send({
        status: "fail",
        message: "Certains ID de secteurs sont invalides.",
      });
    }

    // Création de l'abonnement
    const newSubscription = await Subscription.create({
      user: userId,
      type,
      sectors,
      dateDeb,
      dateFin,
    });

    res.status(201).json({
      status: "success",
      data: {
        subscription: newSubscription,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//************* Modifier un abonnement ***********************
export const updateSubscription = async (req, res) => {
  try {
    const { userId, type, sectors, dateDeb, dateFin } = req.body;

    // Vérification des dates
    if (new Date(dateDeb) > new Date(dateFin)) {
      return res.status(400).send({
        status: "fail",
        message: "La date de début ne peut pas être après la date de fin.",
      });
    }

    // Vérification de l'existence de l'abonnement
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).send({
        status: "fail",
        message: "Abonnement non trouvé.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        status: "fail",
        message: "Utilisateur non trouvé.",
      });
    }

    // Vérification des secteurs
    const validSectors = await Sector.find({ _id: { $in: sectors } });
    if (validSectors.length !== sectors.length) {
      return res.status(400).send({
        status: "fail",
        message: "Certains ID de secteurs sont invalides.",
      });
    }

    // Mise à jour de l'abonnement

    subscription.user = userId;
    subscription.type = type;
    subscription.sectors = sectors;
    subscription.dateDeb = dateDeb;
    subscription.dateFin = dateFin;
    subscription.status = "updated";

    await subscription.save();

    res.status(200).json({
      status: "success",
      data: {
        subscription : subscription,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//***************Supprimer un abonnement (mais le garder dans l'historique) ************
export const deleteSubscription = async (req, res) => {
  try {
    // Vérification de l'existence de l'abonnement
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).send({
        status: "fail",
        message: "Abonnement non trouvé.",
      });
    }

    subscription.status = "deleted";
    subscription.save();

    res.status(200).json({
      status: "success",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//****************************************************************
//***************  Profile & Password Controllers ****************
//****************************************************************
// Changer le mot de passe
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
    const { nom, prenom, email, wilaya, tel } = req.body;

    if (!nom || !prenom || !email || !wilaya || !tel) {
      return res.status(400).json({
        status: "fail",
        message: "Veuillez fournir tous les champs nécessaires",
      });
    }

    // Mettre à jour les informations personnelles
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { nom, prenom, email, wilaya, tel },
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
      message: error,
      data: {
        user: req.user,
      },
    });
  }
};

//****************************************************************
//************************  Messages  ************************
//****************************************************************
export const addMessage = async (req, res) => {
  try {
    const { nom, tel, email, body } = req.body;

    if (!nom || !tel || !email || !body) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const newMessage = {
      nom,
      tel,
      email,
      body,
      seen: false, // Défini par défaut à false dans le modèle, donc cette ligne peut même être omise
    };

    const message = await Message.create(newMessage);
    return res.status(201).json(message);
  } catch (error) {
    console.error("Erreur lors de la création du message :", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

//Récupérer tous les messages :
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json({
      status: "success",
      messages,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//Marquer comme VU
export const markAsSeenMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Met à jour le champ 'seen' du message
    const message = await Message.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        status: "fail",
        message: "Message non trouvé",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        message,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Erreur lors de la mise à jour du message",
      error: error.message,
    });
  }
};

// Supprimer un message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Supprime le message de la base de données
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        status: "fail",
        message: "Message non trouvé",
      });
    }

    res.status(204).json({
      status: "success",
      message: "Message supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Erreur lors de la suppression du message",
      error: error.message,
    });
  }
};

//Récupérer toutes les entreprises :
export const getEntreprises = async (req, res) => {
  try {
    const entrepriseNames = await Tender.aggregate([
      {
        $group: {
          _id: "$entreprise",
        },
      },
      {
        $project: {
          _id: 0,
          entreprise: "$_id",
        },
      },
    ]);

    const entreprises = entrepriseNames.map((e) => e.entreprise);

    res.status(200).json({
      status: "success",
      entreprises: entreprises,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//Récupérer les journaux
export const getJournals = async (req, res) => {
  try {
    const journalNames = await Tender.aggregate([
      {
        $group: {
          _id: "$journal",
        },
      },
      {
        $project: {
          _id: 0,
          journal: "$_id",
        },
      },
    ]);

    const journals = journalNames.map((e) => e.journal);

    res.status(200).json({
      status: "success",
      journals : journals,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
