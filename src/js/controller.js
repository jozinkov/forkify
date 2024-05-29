import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import View from './views/View.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// Polyfilling libraries
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Updating results
    resultsView.update(model.loadPaginationResults());

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);

    // Updating bookmarks
    bookmarksView.update(model.state.bookmarks);
    //
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Getting search query
    const query = searchView.getQuery();
    if (!query) {
      resultsView._clear();
      paginationView._clear();
      return;
    }

    // Loading search results
    await model.loadSearchResults(query);

    // Rendering results
    resultsView.render(model.loadPaginationResults());

    // Rendering pagination
    paginationView.render(model.state.search);
    //
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Rendering new results
  resultsView.render(model.loadPaginationResults(+goToPage));
  // Rendering new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Updating servings
  model.updateServings(newServings);
  // Rendering recipe with new number of servings
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  // Add / remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlSavedBookmark = function () {
  // Initial rendering from localStorage
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Rendering loading spinner
    addRecipeView.renderSpinner();
    // Uploading new recipe
    await model.uploadRecipe(newRecipe);
    // Success message
    addRecipeView.renderMessage();
    // Rendering new recipe
    recipeView.render(model.state.recipe);
    // Updating bookmarks
    controlSavedBookmark();
    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    // Render new form
    // addRecipeView.render();
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlSavedBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmarks(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
