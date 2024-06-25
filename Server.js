// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Create a new SQLite database
const db = new sqlite3.Database('recipe.db');

// Create tables for users and recipes
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    title TEXT,
    ingredients TEXT,
    instructions TEXT,
    category TEXT,
    image BLOB,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

// API endpoints for user authentication
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, username, password, (err) => {
    if (err) {
      res.status(500).send({ message: 'Error creating user' });
    } else {
      res.send({ message: 'User created successfully' });
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, username, password, (err, row) => {
    if (err || !row) {
      res.status(401).send({ message: 'Invalid credentials' });
    } else {
      res.send({ message: 'Logged in successfully' });
    }
  });
});

// API endpoints for recipe management
app.get('/recipes', (req, res) => {
  const userId = req.query.userId;
  db.all(`SELECT * FROM recipes WHERE user_id = ?`, userId, (err, rows) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching recipes' });
    } else {
      res.send(rows);
    }
  });
});

app.post('/recipes', (req, res) => {
  const { title, ingredients, instructions, category, image } = req.body;
  const userId = req.query.userId;
  db.run(`INSERT INTO recipes (title, ingredients, instructions, category, image, user_id) VALUES (?, ?, ?, ?, ?, ?)`, title, ingredients, instructions, category, image, userId, (err) => {
    if (err) {
      res.status(500).send({ message: 'Error creating recipe' });
    } else {
      res.send({ message: 'Recipe created successfully' });
    }
  });
});

app.put('/recipes/:id', (req, res) => {
  const id = req.params.id;
  const { title, ingredients, instructions, category, image } = req.body;
  db.run(`UPDATE recipes SET title = ?, ingredients = ?, instructions = ?, category = ?, image = ? WHERE id = ?`, title, ingredients, instructions, category, image, id, (err) => {
    if (err) {
      res.status(500).send({ message: 'Error updating recipe' });
    } else {
      res.send({ message: 'Recipe updated successfully' });
    }
  });
});

app.delete('/recipes/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM recipes WHERE id = ?`, id, (err) => {
    if (err) {
      res.status(500).send({ message: 'Error deleting recipe' });
    } else {
      res.send({ message: 'Recipe deleted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

