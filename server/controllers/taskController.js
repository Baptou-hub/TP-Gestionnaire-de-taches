// server/controllers/taskController.js
const Task = require('../models/Task');

// GET /tasks - Récupérer toutes les tâches avec filtres et tris
exports.getAllTasks = async (req, res) => {
  try {
    const { statut, priorite, categorie, etiquette, avant, apres, q, tri, ordre } = req.query;
    
    // Construire le filtre
    let filter = {};
    
    if (statut) filter.statut = statut;
    if (priorite) filter.priorite = priorite;
    if (categorie) filter.categorie = categorie;
    if (etiquette) filter.etiquettes = etiquette;
    
    // Filtres de date
    if (avant || apres) {
      filter.echeance = {};
      if (avant) filter.echeance.$lte = new Date(avant);
      if (apres) filter.echeance.$gte = new Date(apres);
    }
    
    // Recherche textuelle
    if (q) {
      filter.$or = [
        { titre: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Construire le tri
    let sortOption = {};
    if (tri) {
      const sortOrder = ordre === 'desc' ? -1 : 1;
      sortOption[tri] = sortOrder;
    } else {
      sortOption.dateCreation = -1; // Par défaut, tri par date de création décroissante
    }
    
    const tasks = await Task.find(filter).sort(sortOption);
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tâches',
      error: error.message
    });
  }
};

// GET /tasks/:id - Récupérer une tâche par ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la tâche',
      error: error.message
    });
  }
};

// POST /tasks - Créer une nouvelle tâche
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès',
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la tâche',
      error: error.message
    });
  }
};

// PUT /tasks/:id - Modifier une tâche
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Tâche mise à jour avec succès',
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la tâche',
      error: error.message
    });
  }
};

// DELETE /tasks/:id - Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Tâche supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la tâche',
      error: error.message
    });
  }
};