# 📋 Gestionnaire de Tâches

Application web de gestion de tâches développée avec MongoDB, Node.js, Express et JavaScript vanilla.

## 👥 Équipe

- Paul Baptiste
- Degironde Antoine

## 🚀 Technologies Utilisées

- **Backend**: Node.js, Express.js
- **Base de données**: MongoDB (Mongoose ODM)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Autres**: dotenv, cors

## 📦 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <URL_VOTRE_DEPOT>
cd gestionnaire-taches
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine du projet :
```env
MONGODB_URI=mongodb://localhost:27017/gestionnaire-taches
PORT=3000
```

Pour MongoDB Atlas, utilisez :
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gestionnaire-taches
PORT=3000
```

4. **Démarrer MongoDB (si local)**
```bash
mongod
```

5. **Lancer l'application**

Mode développement (avec rechargement automatique) :
```bash
npm run dev
```

Mode production :
```bash
npm start
```

6. **Accéder à l'application**
- Interface web : `http://localhost:3000`
- API : `http://localhost:3000/api/tasks`

## 📚 Structure du Projet

```
gestionnaire-taches/
│
├── server/
│   ├── config/
│   │   └── db.js              # Configuration MongoDB
│   ├── models/
│   │   └── Task.js            # Modèle Mongoose
│   ├── routes/
│   │   └── tasks.js           # Routes API
│   ├── controllers/
│   │   └── taskController.js # Logique métier
│   └── server.js              # Serveur Express
│
├── public/
│   ├── index.html             # Interface utilisateur
│   ├── css/
│   │   └── style.css         # Styles CSS
│   └── js/
│       └── app.js             # JavaScript frontend
│
├── .env                       # Variables d'environnement
├── .gitignore                # Fichiers à ignorer
├── package.json              # Dépendances
└── README.md                 # Documentation
```

## 🔌 API REST

### Routes principales

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/tasks` | Récupérer toutes les tâches |
| GET | `/api/tasks/:id` | Récupérer une tâche par ID |
| POST | `/api/tasks` | Créer une nouvelle tâche |
| PUT | `/api/tasks/:id` | Modifier une tâche |
| DELETE | `/api/tasks/:id` | Supprimer une tâche |

### Paramètres de filtrage

| Paramètre | Type | Exemple | Description |
|-----------|------|---------|-------------|
| `statut` | String | `?statut=à faire` | Filtrer par statut |
| `priorite` | String | `?priorite=haute` | Filtrer par priorité |
| `categorie` | String | `?categorie=travail` | Filtrer par catégorie |
| `etiquette` | String | `?etiquette=urgent` | Filtrer par étiquette |
| `avant` | Date | `?avant=2025-12-31` | Tâches avant une date |
| `apres` | Date | `?apres=2025-01-01` | Tâches après une date |
| `q` | String | `?q=rapport` | Recherche textuelle |
| `tri` | String | `?tri=echeance` | Trier par champ |
| `ordre` | String | `?ordre=desc` | Ordre de tri (asc/desc) |

### Exemples d'utilisation

**Créer une tâche**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Ma tâche",
    "description": "Description détaillée",
    "echeance": "2025-12-31",
    "priorite": "haute",
    "categorie": "travail",
    "auteur": {
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@email.com"
    }
  }'
```

**Filtrer les tâches**
```bash
curl "http://localhost:3000/api/tasks?statut=en%20cours&priorite=haute&tri=echeance&ordre=desc"
```

## 🎨 Fonctionnalités

### ✅ Fonctionnalités principales

- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Filtrage par statut, priorité, catégorie, étiquettes
- ✅ Recherche textuelle dans titre et description
- ✅ Tri par date, priorité, etc.
- ✅ Gestion des sous-tâches
- ✅ Système de commentaires
- ✅ Interface responsive et moderne
- ✅ Validation des données
- ✅ Gestion des erreurs

### 🎯 Modèle de données

Chaque tâche contient :
- **Informations de base** : titre, description, dates
- **Classification** : statut, priorité, catégorie
- **Auteur** : nom, prénom, email
- **Étiquettes** : mots-clés
- **Sous-tâches** : tâches imbriquées
- **Commentaires** : discussions
- **Historique** : modifications (optionnel)

## 🧪 Tests

Pour tester l'API avec des données exemple :

```bash
# Créer quelques tâches de test
node scripts/seed.js
```

## 🐛 Dépannage

### MongoDB ne se connecte pas

- Vérifiez que MongoDB est démarré : `mongod`
- Vérifiez l'URL dans le fichier `.env`
- Pour Atlas, vérifiez les credentials et l'IP autorisée

### Port déjà utilisé

Si le port 3000 est occupé, modifiez `PORT` dans `.env`

### Erreur CORS

Si vous testez depuis un autre domaine, vérifiez la configuration CORS dans `server.js`

## 📝 TODO / Améliorations possibles

- [ ] Authentification utilisateur
- [ ] Upload de fichiers joints
- [ ] Notifications par email
- [ ] Export en PDF/CSV
- [ ] Glisser-déposer pour réorganiser
- [ ] Mode hors-ligne (PWA)
- [ ] Graphiques et statistiques
- [ ] Partage de tâches entre utilisateurs

## 📄 Licence

Projet académique - IUT / Université

## 🤝 Contribution

Projet réalisé dans le cadre du module R5.A.10 - Nouveaux paradigmes de bases de données

---

**Date** : Novembre 2025  
**Version** : 1.0.0