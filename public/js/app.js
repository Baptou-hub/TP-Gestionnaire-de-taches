// public/js/app.js

const API_URL = '/api/tasks';
let currentTaskId = null;

// Éléments DOM
const taskModal = document.getElementById('taskModal');
const detailsModal = document.getElementById('detailsModal');
const taskForm = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');
const btnNouvelletache = document.getElementById('btnNouvelletache');
const btnAnnuler = document.getElementById('btnAnnuler');
const closeButtons = document.querySelectorAll('.close');
const btnAppliquerFiltres = document.getElementById('btnAppliquerFiltres');
const btnResetFiltres = document.getElementById('btnResetFiltres');

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    initEventListeners();
});

// Initialiser tous les événements
function initEventListeners() {
    btnNouvelletache.addEventListener('click', () => openTaskModal());
    btnAnnuler.addEventListener('click', () => closeModal(taskModal));
    taskForm.addEventListener('submit', handleSubmit);
    btnAppliquerFiltres.addEventListener('click', loadTasks);
    btnResetFiltres.addEventListener('click', resetFilters);
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(taskModal);
            closeModal(detailsModal);
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === taskModal) closeModal(taskModal);
        if (e.target === detailsModal) closeModal(detailsModal);
    });
}

// Charger toutes les tâches depuis l'API
async function loadTasks() {
    try {
        const params = buildFilterParams();
        const response = await fetch(`${API_URL}${params}`);
        const result = await response.json();
        
        if (result.success) {
            displayTasks(result.data);
            updateTaskCount(result.count);
        } else {
            showNotification('Erreur lors du chargement des tâches', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion au serveur', 'error');
    }
}

// Construire les paramètres de filtrage pour l'URL
function buildFilterParams() {
    const params = new URLSearchParams();
    
    const q = document.getElementById('searchQuery').value;
    const statut = document.getElementById('filterStatut').value;
    const priorite = document.getElementById('filterPriorite').value;
    const categorie = document.getElementById('filterCategorie').value;
    const tri = document.getElementById('sortBy').value;
    const ordre = document.getElementById('sortOrder').value;
    
    if (q) params.append('q', q);
    if (statut) params.append('statut', statut);
    if (priorite) params.append('priorite', priorite);
    if (categorie) params.append('categorie', categorie);
    if (tri) params.append('tri', tri);
    if (ordre) params.append('ordre', ordre);
    
    return params.toString() ? `?${params.toString()}` : '';
}

// Réinitialiser tous les filtres
function resetFilters() {
    document.getElementById('searchQuery').value = '';
    document.getElementById('filterStatut').value = '';
    document.getElementById('filterPriorite').value = '';
    document.getElementById('filterCategorie').value = '';
    document.getElementById('sortBy').value = 'dateCreation';
    document.getElementById('sortOrder').value = 'desc';
    loadTasks();
}

// Afficher la liste des tâches
function displayTasks(tasks) {
    if (tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>Aucune tâche trouvée</p>
                <p style="font-size: 0.9em; margin-top: 10px;">Créez votre première tâche ou modifiez les filtres</p>
            </div>
        `;
        return;
    }
    
    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-card" onclick="showTaskDetails('${task._id}')">
            <div class="task-header">
                <h3 class="task-title">${escapeHtml(task.titre)}</h3>
                <div class="task-badges">
                    <span class="badge badge-statut">${task.statut}</span>
                    <span class="badge badge-priorite-${task.priorite}">${task.priorite}</span>
                    <span class="badge badge-categorie">${task.categorie}</span>
                </div>
            </div>
            
            <p class="task-description">${escapeHtml(task.description.substring(0, 150))}${task.description.length > 150 ? '...' : ''}</p>
            
            ${task.etiquettes && task.etiquettes.length > 0 ? `
                <div class="task-etiquettes">
                    ${task.etiquettes.map(tag => `<span class="etiquette">#${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="task-meta">
                <span>Échéance: ${formatDate(task.echeance)}</span>
                <span>${escapeHtml(task.auteur.prenom)} ${escapeHtml(task.auteur.nom)}</span>
                ${task.sousTaches && task.sousTaches.length > 0 ? `<span>📋 ${task.sousTaches.length} sous-tâche${task.sousTaches.length > 1 ? 's' : ''}</span>` : ''}
                ${task.commentaires && task.commentaires.length > 0 ? `<span>💬 ${task.commentaires.length} commentaire${task.commentaires.length > 1 ? 's' : ''}</span>` : ''}
            </div>
            
            <div class="task-actions" onclick="event.stopPropagation()">
                <button class="btn btn-sm btn-secondary" onclick="editTask('${task._id}')">✏️ Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask('${task._id}')">🗑️ Supprimer</button>
            </div>
        </div>
    `).join('');
}

// Afficher les détails d'une tâche dans un modal
async function showTaskDetails(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();
        
        if (result.success) {
            const task = result.data;
            document.getElementById('taskDetails').innerHTML = `
                <h2>${escapeHtml(task.titre)}</h2>
                
                <div class="details-section">
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Statut</strong>
                            <span class="badge badge-statut">${task.statut}</span>
                        </div>
                        <div class="info-item">
                            <strong>Priorité</strong>
                            <span class="badge badge-priorite-${task.priorite}">${task.priorite}</span>
                        </div>
                        <div class="info-item">
                            <strong>Catégorie</strong>
                            ${task.categorie}
                        </div>
                        <div class="info-item">
                            <strong>Échéance</strong>
                            ${formatDate(task.echeance)}
                        </div>
                        <div class="info-item">
                            <strong>Créée le</strong>
                            ${formatDate(task.dateCreation)}
                        </div>
                    </div>
                </div>
                
                <div class="details-section">
                    <h3>Description</h3>
                    <p>${escapeHtml(task.description)}</p>
                </div>
                
                <div class="details-section">
                    <h3>Auteur</h3>
                    <p>👤 ${escapeHtml(task.auteur.prenom)} ${escapeHtml(task.auteur.nom)} (${escapeHtml(task.auteur.email)})</p>
                </div>
                
                ${task.etiquettes && task.etiquettes.length > 0 ? `
                    <div class="details-section">
                        <h3>Étiquettes</h3>
                        <div class="task-etiquettes">
                            ${task.etiquettes.map(tag => `<span class="etiquette">#${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${task.sousTaches && task.sousTaches.length > 0 ? `
                    <div class="details-section">
                        <h3>Sous-tâches (${task.sousTaches.length})</h3>
                        <ul class="subtask-list">
                            ${task.sousTaches.map(st => `
                                <li class="subtask-item">
                                    <strong>${escapeHtml(st.titre)}</strong>
                                    <span class="badge badge-statut">${st.statut}</span>
                                    ${st.echeance ? `<br>📅 ${formatDate(st.echeance)}` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${task.commentaires && task.commentaires.length > 0 ? `
                    <div class="details-section">
                        <h3>Commentaires (${task.commentaires.length})</h3>
                        <ul class="comment-list">
                            ${task.commentaires.map(c => `
                                <li class="comment-item">
                                    <div class="comment-header">
                                        <strong>${escapeHtml(c.auteur.prenom)} ${escapeHtml(c.auteur.nom)}</strong>
                                        <span>${formatDate(c.date)}</span>
                                    </div>
                                    <p>${escapeHtml(c.contenu)}</p>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            `;
            
            detailsModal.style.display = 'block';
        } else {
            showNotification('Tâche non trouvée', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des détails', 'error');
    }
}

// Ouvrir le modal de création ou d'édition
function openTaskModal(task = null) {
    currentTaskId = task ? task._id : null;
    document.getElementById('modalTitle').textContent = task ? 'Modifier la Tâche' : 'Nouvelle Tâche';
    
    if (task) {
        document.getElementById('taskId').value = task._id;
        document.getElementById('titre').value = task.titre;
        document.getElementById('description').value = task.description;
        document.getElementById('echeance').value = task.echeance.split('T')[0];
        document.getElementById('statut').value = task.statut;
        document.getElementById('priorite').value = task.priorite;
        document.getElementById('categorie').value = task.categorie;
        document.getElementById('etiquettes').value = task.etiquettes ? task.etiquettes.join(', ') : '';
        document.getElementById('auteurNom').value = task.auteur.nom;
        document.getElementById('auteurPrenom').value = task.auteur.prenom;
        document.getElementById('auteurEmail').value = task.auteur.email;
    } else {
        taskForm.reset();
        document.getElementById('taskId').value = '';
    }
    
    taskModal.style.display = 'block';
}

// Éditer une tâche existante
async function editTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();
        
        if (result.success) {
            openTaskModal(result.data);
        } else {
            showNotification('Tâche non trouvée', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement de la tâche', 'error');
    }
}

// Soumettre le formulaire (création ou modification)
async function handleSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        titre: document.getElementById('titre').value,
        description: document.getElementById('description').value,
        echeance: document.getElementById('echeance').value,
        statut: document.getElementById('statut').value,
        priorite: document.getElementById('priorite').value,
        categorie: document.getElementById('categorie').value,
        etiquettes: document.getElementById('etiquettes').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t),
        auteur: {
            nom: document.getElementById('auteurNom').value,
            prenom: document.getElementById('auteurPrenom').value,
            email: document.getElementById('auteurEmail').value
        }
    };
    
    try {
        const taskId = document.getElementById('taskId').value;
        const url = taskId ? `${API_URL}/${taskId}` : API_URL;
        const method = taskId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            closeModal(taskModal);
            loadTasks();
        } else {
            showNotification(result.message || 'Erreur lors de l\'enregistrement', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'enregistrement', 'error');
    }
}

// Supprimer une tâche
async function deleteTask(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            loadTasks();
        } else {
            showNotification('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Fermer un modal
function closeModal(modal) {
    modal.style.display = 'none';
}

// Mettre à jour le compteur de tâches
function updateTaskCount(count) {
    document.getElementById('taskCount').textContent = `(${count})`;
}

// Formater une date au format français
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Échapper le HTML pour éviter les failles XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}