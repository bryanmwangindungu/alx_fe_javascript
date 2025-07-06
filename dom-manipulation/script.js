// Load existing quotes or use defaults
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
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
const exportBtn = document.getElementById('exportQuotesBtn');

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate categories in dropdown
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

// Show a random quote
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

// Add a new quote
function addQuote() {
  const text = quoteInput.value.trim();
  const category = categoryInput.value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  quoteInput.value = '';
  categoryInput.value = '';
  alert("Quote added successfully!");
}

// ✅ Export quotes using Blob and application/json
function exportToJsonFile(jsonData) {
  const dataStr = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = url;
  downloadAnchor.download = "quotes.json";
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);

  URL.revokeObjectURL(url);
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
exportBtn.addEventListener('click', () => {
  exportToJsonFile(quotes);
});

// Initial setup
populateCategories();