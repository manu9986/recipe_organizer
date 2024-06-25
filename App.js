// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeList from './RecipeList';
import RecipeForm from './RecipeForm';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios.get('/recipes', {
      params: {
        userId: 1, // Replace with actual user ID
      },
    })
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [query]);

  const handleSearch = event => {
    setSearch(event.target.value);
  };

  const handleQuery = event => {
    setQuery(event.target.value);
  };

  const handleAddRecipe = recipe => {
    axios.post('/recipes', recipe)
      .then(response => {
        setRecipes([...recipes, response.data]);
