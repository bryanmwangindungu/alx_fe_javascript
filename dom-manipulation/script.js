const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "success" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const categorySelect = document.getElementById('categorySelect');

const quoteInput = document.getElementById('newQuoteText');
const categoryInput = document.getElementById('newQuoteCategory');

// Populate categories in the dropdown
function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));
  categorySelect.innerHTML = `<option value="all">All</option>`;
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categorySelect.appendChild(option);
  });
}

// Show a random quote (filtered by selected category)
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.textContent = `"${quote.text}" — (${quote.category})`;
}

// Add a new quote dynamically
function addQuote() {
  const text = quoteInput.value.trim();
  const category = categoryInput.value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });

  quoteInput.value = '';
  categoryInput.value = '';

  populateCategories();
  alert("New quote added successfully!");
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Initial setup
populateCategories();