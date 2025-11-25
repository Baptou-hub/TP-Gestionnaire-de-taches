// server/models/Task.js
const mongoose = require('mongoose');

const AuteurSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SousTacheSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true, trim: true },
    statut: {
      type: String,
      enum: ['à faire', 'en cours', 'terminée', 'annulée'],
      default: 'à faire',
    },
  },
  { _id: false }
);

const CommentaireSchema = new mongoose.Schema(
  {
    auteur: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const TaskSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    echeance: { type: Date, required: true },

    statut: {
      type: String,
      enum: ['à faire', 'en cours', 'terminée', 'annulée'],
      default: 'à faire',
    },

    priorite: {
      type: String,
      enum: ['basse', 'moyenne', 'haute', 'critique'],
      default: 'moyenne',
    },

    categorie: {
      type: String,
      enum: ['perso', 'travail', 'projet', 'autre'],
      default: 'autre',
    },

    etiquettes: [{ type: String, trim: true }],

    auteur: {
      type: AuteurSchema,
      required: true,
    },

    sousTaches: [SousTacheSchema],
    commentaires: [CommentaireSchema],
  },
  {
    timestamps: { createdAt: 'creeLe', updatedAt: 'misAJourLe' },
  }
);

module.exports = mongoose.model('Task', TaskSchema);
