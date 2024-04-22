const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Project NodeJS',
      description: '',
      contact: {
        name: "Antonia Oancea",
      },
      version: '1.0.0',
      servers: [{ url: "http://localhost:5000" }],
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            id: { type: 'string', description: 'The auto-generated id of the user.' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
          },
        },
        Post: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            id: { type: 'string', description: 'The auto-generated id of the post.' },
            title: { type: 'string', description: 'The title of the post.' },
            content: { type: 'string', description: 'The content of the post.' },
            authorId: { type: 'string', description: 'The user ID of the post author.' }
          },
        },
        Comment: {
          type: 'object',
          required: ['text', 'postId'],
          properties: {
            id: { type: 'string', description: 'The auto-generated id of the comment.' },
            text: { type: 'string', description: 'The text of the comment.' },
            postId: { type: 'string', description: 'The ID of the post this comment belongs to.' }
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
