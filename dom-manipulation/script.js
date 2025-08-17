// ------------------------------
// Quotes Array + Local Storage
// ------------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration", author: "Alan Kay" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity", author: "Austin Freeman" }
];

// ------------------------------
// Show Random Quote
// ------------------------------
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.author} (${quote.category})</small>`;
}

// ------------------------------
// Populate Categories
// ------------------------------
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = categories
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");

  const savedFilter = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = savedFilter;
  filterQuotes();
}

// ------------------------------
// Filter Quotes
// ------------------------------
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", category);

  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filtered
    .map(q => `<p>"${q.text}"</p><small>- ${q.author} (${q.category})</small>`)
    .join("");
}

// ------------------------------
// Add New Quote
// ------------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category, author: "User" };
    quotes.push(newQuote);

    localStorage.setItem("quotes", JSON.stringify(quotes));

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    populateCategories();

    document.getElementById("notification").innerText = "Quote added successfully!";
    setTimeout(() => {
      document.getElementById("notification").innerText = "";
    }, 3000);
  }
}

// ------------------------------
// Simulated Server Fetch
// ------------------------------
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server",
      author: "API"
    }));

    quotes = [...serverQuotes, ...quotes];
    localStorage.setItem("quotes", JSON.stringify(quotes));

    showNotification("Quotes synced with server!");
    populateCategories();
  } catch (error) {
    console.error("Error fetching from server:", error);
  }
}

// ------------------------------
// Sync Local Quotes to Server
// ------------------------------
async function syncQuotesToServer() {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotes)
    });

    showNotification("Local quotes synced to server!");
  } catch (error) {
    console.error("Error syncing to server:", error);
  }
}

// ------------------------------
// Notifications
// ------------------------------
function showNotification(message) {
  const note = document.getElementById("notification");
  note.innerText = message;
  setTimeout(() => { note.innerText = ""; }, 3000);
}

// ------------------------------
// Page Load
// ------------------------------
window.onload = () => {
  populateCategories();
  showRandomQuote();
  fetchQuotesFromServer();

  // Auto sync every 30s
  setInterval(syncQuotesToServer, 30000);
};
