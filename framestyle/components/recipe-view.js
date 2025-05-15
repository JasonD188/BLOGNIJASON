export class RecipeView extends HTMLElement {
  constructor() {
    super()
    this.recipes = []
    this.page = 1
    this.loading = false
    this.attachShadow({ mode: 'open' })
  }

  async connectedCallback() {
    await this.loadRecipes()
    this.render()
    this.addEventListeners()
  }

  async loadRecipes() {
    if (this.loading) return
    this.loading = true
    this.showLoading()

    try {
      
      const newRecipes = await this.fetchRecipes(this.page)
      this.recipes = [...this.recipes, ...newRecipes]
      this.page++
      this.render()
    } catch (error) {
      console.error('Error loading recipes:', error)
      this.showError('Failed to load recipes')
    } finally {
      this.loading = false
      this.hideLoading()
    }
  }

  async fetchRecipes(page) {
   
    return [
      {
        id: page * 3 - 2,
        title: 'Adobo',
        image: './pictureshome/MEAL.jpg',
        description: 'Classic Filipino adobo recipe',
        category: 'Meals'
      },
      {
        id: page * 3 - 1,
        title: 'Halo-Halo',
        image: './pictureshome/DESSERT.jpg',
        description: 'Traditional Filipino dessert',
        category: 'Desserts'
      },
      {
        id: page * 3,
        title: 'Lumpia',
        image: './pictureshome/SNACKS.jpg',
        description: 'Crispy Filipino spring rolls',
        category: 'Snacks'
      }
    ]
  }

  addEventListeners() {
    const container = this.shadowRoot.querySelector('.recipe-container')
    container?.addEventListener('scroll', () => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
        this.loadRecipes()
      }
    })
  }

  showLoading() {
    const loadingDiv = document.createElement('div')
    loadingDiv.className = 'loading'
    loadingDiv.innerHTML = '<div class="spinner"></div>'
    this.shadowRoot.appendChild(loadingDiv)
  }

  hideLoading() {
    const loadingDiv = this.shadowRoot.querySelector('.loading')
    if (loadingDiv) loadingDiv.remove()
  }

  showError(message) {
    const errorDiv = document.createElement('div')
    errorDiv.className = 'error-message'
    errorDiv.textContent = message
    this.shadowRoot.appendChild(errorDiv)
    setTimeout(() => errorDiv.remove(), 3000)
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('/components/recipe-view.css');
      </style>
      <div class="recipe-container">
        <div class="recipe-grid">
          ${this.recipes.map(recipe => `
            <div class="recipe-card" data-id="${recipe.id}">
              <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
              <div class="recipe-content">
                <span class="recipe-category">${recipe.category}</span>
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <button class="view-recipe-btn">View Recipe</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
    this.addEventListeners()
  }
}

customElements.define('recipe-view', RecipeView) 