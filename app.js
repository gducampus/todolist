const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'votre_secret_jwt';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Liste de Tâches (Learning campus)',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            },
            schemas: {
                Todo: {
                    type: 'object',
                    required: ['id', 'text', 'created_at', 'Tags', 'is_complete'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID auto-généré de la tâche.',
                        },
                        userId: {
                            type: 'integer',
                            description: "ID de l'utilisateur à qui appartient la tâche.",
                        },
                        text: {
                            type: 'string',
                            description: 'La description de la tâche.',
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date de création de la tâche.',
                        },
                        Tags: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Les tags associés à la tâche.',
                        },
                        is_complete: {
                            type: 'boolean',
                            description: 'Statut de la tâche.',
                        }
                    },
                    example: {
                        id: 1,
                        userId: 1,
                        text: "Apprendre Polymer",
                        created_at: "Mon Apr 26 06:01:55 +0000 2015",
                        Tags: ["Développement Web", "Composants Web"],
                        is_complete: true
                    }
                },
                User: {
                    type: 'object',
                    required: ['id', 'username', 'password', 'role'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID auto-généré de l’utilisateur.',
                        },
                        username: {
                            type: 'string',
                            description: "Nom d'utilisateur.",
                        },
                        password: {
                            type: 'string',
                            description: 'Mot de passe de l’utilisateur.',
                        },
                        role: {
                            type: 'string',
                            description: "Rôle de l'utilisateur.",
                        }
                    },
                    example: {
                        id: 1,
                        username: "admin",
                        password: "hashed_password",
                        role: "admin"
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./app.js'],
};

const openapiSpecification = swaggerJsdoc(options);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [
    {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('adminpass', 10),
        role: 'admin'
    },
    {
        id: 2,
        username: 'user',
        password: bcrypt.hashSync('userpass', 10),
        role: 'user'
    }
];

const todos = [
    {
        "todolist": [
            {
                "id": 1,
                "userId": 1,
                "text": "Apprendre Polymer",
                "created_at": "Lundi 26 Avril 2015 06:01:55",
                "Tags": ["Développement Web", "Composants Web"],
                "is_complete": true
            },
            {
                "id": 2,
                "userId": 1,
                "text": "Suivre un cours sur Docker",
                "created_at": "Mardi 2 Mars 2015 07:01:55",
                "Tags": ["DevOps", "Docker"],
                "is_complete": true
            },
            {
                "id": 3,
                "userId": 1,
                "text": "Préparer la présentation Aurelia",
                "created_at": "Mercredi 5 Mars 2015 10:01:55",
                "Tags": ["Présentation", "Aurelia"],
                "is_complete": false
            },
            {
                "id": 4,
                "userId": 1,
                "text": "Déployer le site web",
                "created_at": "Vendredi 30 Juin 2015 13:00:00",
                "Tags": ["DevOps", "Site Web"],
                "is_complete": false
            },
            {
                "id": 5,
                "userId": 1,
                "text": "Apprendre ES6",
                "created_at": "Lundi 1 Août 2015 10:00:00",
                "Tags": ["JavaScript", "ES6"],
                "is_complete": false
            },
            {
                "id": 6,
                "userId": 2,
                "text": "Préparer la présentation DevOps",
                "created_at": "Mardi 15 Janvier 2021 09:45:00",
                "Tags": ["DevOps", "Présentation"],
                "is_complete": true
            },
            {
                "id": 7,
                "userId": 2,
                "text": "Mettre en place une stratégie de tests",
                "created_at": "Mercredi 20 Février 2021 14:30:00",
                "Tags": ["Tests", "Développement"],
                "is_complete": false
            },
            {
                "id": 8,
                "userId": 2,
                "text": "Rédiger la documentation du projet",
                "created_at": "Jeudi 22 Mars 2021 16:00:00",
                "Tags": ["Documentation", "Rédaction"],
                "is_complete": false
            },
            {
                "id": 9,
                "userId": 2,
                "text": "Corriger un bug en production",
                "created_at": "Mardi 24 Avril 2021 10:15:00",
                "Tags": ["Bug", "Production"],
                "is_complete": false
            },
            {
                "id": 10,
                "userId": 2,
                "text": "Revoir les pull requests",
                "created_at": "Lundi 28 Mai 2021 11:25:00",
                "Tags": ["Revue", "Code"],
                "is_complete": false
            }
        ]
    }
];

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentifie un utilisateur et retourne un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "admin"
 *               password: "adminpass"
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Authentification échouée
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
});

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Retourne la liste de toutes les tâches
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: La liste des tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

/**
 * @swagger
 * /users/{userId}/todos:
 *   get:
 *     summary: Récupère les tâches de l'utilisateur spécifié
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur dont on veut récupérer les tâches
 *     responses:
 *       200:
 *         description: Liste des tâches de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
app.get('/users/:userId/todos', (req, res) => {
    const userId = req.params.userId;
    const userTodos = todos[0].todolist.filter(todo => todo.userId === parseInt(userId));
    res.status(200).json(userTodos);
});

/**
 * @swagger
 * /users/{userId}/todos:
 *   post:
 *     summary: Crée une nouvelle tâche pour l'utilisateur spécifié
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur pour lequel on crée la tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
app.post('/users/:userId/todos', (req, res) => {
    const userId = req.params.userId;
    const newTodo = {
        id: todos[0].todolist.length + 1,
        userId: parseInt(userId),
        text: req.body.text,
        created_at: new Date().toISOString(),
        Tags: req.body.Tags,
        is_complete: req.body.is_complete || false
    };

    todos[0].todolist.push(newTodo);
    res.status(201).json(newTodo);
});

/**
 * @swagger
 * /users/{userId}/todos/{id}:
 *   get:
 *     summary: Récupère une tâche spécifique de l'utilisateur spécifié
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur dont on veut récupérer la tâche
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tâche à récupérer
 *     responses:
 *       200:
 *         description: Tâche récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Tâche non trouvée
 */
app.get('/users/:userId/todos/:id', (req, res) => {
    const { userId, id } = req.params;
    const todo = todos[0].todolist.find(t => t.id === parseInt(id) && t.userId === parseInt(userId));
    if (!todo) {
        return res.status(404).send('Tâche non trouvée');
    }
    res.status(200).json(todo);
});

/**
 * @swagger
 * /users/{userId}/todos/{id}:
 *   put:
 *     summary: Met à jour une tâche spécifique de l'utilisateur spécifié
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur dont on veut mettre à jour la tâche
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tâche à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: Tâche mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Tâche non trouvée
 */
app.put('/users/:userId/todos/:id', (req, res) => {
    const { userId, id } = req.params;
    const index = todos[0].todolist.findIndex(t => t.id === parseInt(id) && t.userId === parseInt(userId));
    if (index >= 0) {
        todos[0].todolist[index] = {
            ...todos[0].todolist[index],
            ...req.body
        };
        res.status(200).json(todos[0].todolist[index]);
    } else {
        res.status(404).send("Tâche non trouvée");
    }
});

/**
 * @swagger
 * /users/{userId}/todos/{id}:
 *   delete:
 *     summary: Supprime une tâche spécifique de l'utilisateur spécifié
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur dont on veut supprimer la tâche
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tâche à supprimer
 *     responses:
 *       200:
 *         description: Tâche supprimée avec succès
 *       404:
 *         description: Tâche non trouvée
 */
app.delete('/users/:userId/todos/:id', (req, res) => {
    const { userId, id } = req.params;
    const index = todos[0].todolist.findIndex(t => t.id === parseInt(id) && t.userId === parseInt(userId));
    if (index >= 0) {
        todos[0].todolist.splice(index, 1);
        res.status(200).send("Tâche supprimée avec succès");
    } else {
        res.status(404).send("Tâche non trouvée");
    }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(3001, () => {
    console.log('Le serveur fonctionne sur http://localhost:3001');
});
