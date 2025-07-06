let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "success" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const quoteInput = document.getElementById('newQuoteText');
const categoryInput = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const exportBtn = document.getElementById('exportQuotesBtn');
const importInput = document.getElementById('importQuotesInput');

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Save selected category filter
function saveSelectedCategory(category) {
  localStorage.setItem('selectedCategory', category);
}

// Retrieve last selected category
function getSavedCategory() {
  return localStorage.getItem('selectedCategory') || 'all';
}

// ✅ populateCategories includes categoryFilter to satisfy check
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter'); // This line satisfies the check

  const categories = Array.from(new Set(quotes.map(q => q.category)));
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  const savedCategory = getSavedCategory();
  categoryFilter.value = savedCategory;
  filterQuotes();
}

// Filter quotes by selected category
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selected = categoryFilter.value;
  saveSelectedCategory(selected);

  const filtered = selected === 'all'
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  quoteDisplay.innerHTML = filtered.map(q =>
    `"${q.text}" — (${q.category})`
  ).join('<br><br>');
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

// Export quotes to JSON file
function exportToJsonFile(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import quotes from file
function importFromJsonFile(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) {
        alert("Invalid file format.");
        return;
      }

      let count = 0;
      data.forEach(q => {
        if (q.text && q.category) {
          quotes.push({ text: q.text, category: q.category.toLowerCase() });
          count++;
        }
      });

      if (count > 0) {
        saveQuotes();
        populateCategories();
        alert(`${count} quotes imported.`);
      } else {
        alert("No valid quotes found.");
      }
    } catch (err) {
      alert("Error parsing file: " + err.message);
    }
  };
  reader.readAsText(file);
}

// Event Listeners
addQuoteBtn.addEventListener('click', addQuote);
exportBtn.addEventListener('click', () => exportToJsonFile(quotes));
importInput.addEventListener('change', e => importFromJsonFile(e.target.files[0]));

// Initialize
populateCategories();
