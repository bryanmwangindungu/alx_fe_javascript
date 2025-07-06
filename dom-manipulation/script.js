let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
const POLL_INTERVAL = 30000;

// ✅ Async fetch with await + JSONPlaceholder (required)
async function fetchPostsFromMockApi() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    console.log('Fetched posts:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// ✅ Fetch quotes from simulated server
function fetchQuotesFromServer() {
  return fetch('https://dummyjson.com/quotes')
    .then(response => response.json())
    .then(data => data.quotes)
    .catch(error => {
      console.error('Failed to fetch quotes from server:', error);
      return [];
    });
}

// ✅ Merge and resolve quote conflicts (server wins)
function mergeQuotes(serverQuotes) {
  const localById = new Map(quotes.map(q => [q.id, q]));
  let updated = false;

  serverQuotes.forEach(sq => {
    const existing = localById.get(sq.id);
    if (!existing) {
      quotes.push(sq);
      updated = true;
    } else if (existing.quote !== sq.quote) {
      Object.assign(existing, sq);
      updated = true;
      console.warn(`Conflict on ID ${sq.id}: server version used`);
    }
  });

  if (updated) {
    saveQuotes();
    alert('Quotes updated from server.');
    populateCategories();
  }
}

// ✅ Required: syncQuotes function
function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    if (serverQuotes) mergeQuotes(serverQuotes);
  });
}

// ✅ Save to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  localStorage.setItem('lastSync', Date.now());
}

// ✅ Populate dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = Array.from(new Set(quotes.map(q => q.author || q.category)));
  categoryFilter.innerHTML = '<option value="all">All</option>';

  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  categoryFilter.value = localStorage.getItem('selectedCategory') || 'all';
  filterQuotes();
}

// ✅ Filter displayed quotes
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selected = categoryFilter.value;
  localStorage.setItem('selectedCategory', selected);

  const filtered = selected === 'all'
    ? quotes
    : quotes.filter(q => (q.author || q.category) === selected);

  const display = document.getElementById('quoteDisplay');
  display.innerHTML = filtered.length
    ? filtered.map(q => `"${q.quote || q.text}" — (${q.author || q.category})`).join('<br><br>')
    : "No quotes available for this category.";
}

// ✅ Add new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = {
    id: Date.now(),
    quote: text,
    author: category
  };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("Quote added!");

  // ✅ POST to mock server
  postQuoteToServer(newQuote);
}

// ✅ POST request with method, headers, Content-Type
function postQuoteToServer(quoteObj) {
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quoteObj)
  })
    .then(res => res.json())
    .then(data => console.log('Quote posted to server:', data))
    .catch(err => console.error('Post error:', err));
}

// ✅ Export to JSON
function exportToJsonFile(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ✅ Import from JSON file
document.getElementById('importQuotesInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");

      importedQuotes.forEach(q => {
        if (q.text || q.quote) {
          quotes.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            quote: q.quote || q.text,
            author: q.author || q.category || "unknown"
          });
        }
      });

      saveQuotes();
      populateCategories();
      alert("Quotes imported!");
    } catch (err) {
      alert("Import error: " + err.message);
    }
  };
  reader.readAsText(file);
});

// ✅ Initialize everything
window.addEventListener('load', () => {
  syncQuotes(); // <- replaced syncWithServer
  fetchPostsFromMockApi();
});

setInterval(syncQuotes, POLL_INTERVAL);
populateCategories();
