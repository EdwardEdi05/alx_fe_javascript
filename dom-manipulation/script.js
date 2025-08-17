// =======================
// Initial Quotes
// =======================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", author: "Will Rogers", category: "Wisdom" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", author: "Vince Lombardi", category: "Perseverance" },
];

let currentQuoteIndex = -1;

// =======================
// DOM Elements
// =======================
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// =======================
// Populate Categories
// =======================
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = savedCategory;
}

// =======================
// Filter Quotes
// =======================
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayQuotes();
}

// =======================
// Display Quotes
// =======================
function displayQuotes() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  currentQuoteIndex = randomIndex;
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.author}`;
}

// =======================
// Add New Quote
// =======================
function addQuote(text, author, category) {
  const newQuote = { text, author, category };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  displayQuotes();
  postQuoteToServer(newQuote);
}

// =======================
// Server Simulation
// =======================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    return serverData.slice(0, 10).map(post => ({
      text: post.title,
      author: "Server Author",
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  const mergedQuotes = [
    ...serverQuotes,
    ...localQuotes.filter(lq => !serverQuotes.some(sq => sq.text === lq.text))
  ];

  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;

  displayQuotes();
  notifyUser("Quotes synced with server!");
}

// =======================
// Notifications
// =======================
function notifyUser(message) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.innerText = message;
    notification.style.display = "block";
    setTimeout(() => { notification.style.display = "none"; }, 4000);
  } else {
    alert(message); // fallback
  }
}

// =======================
// On Page Load
// =======================
window.onload = function () {
  populateCategories();
  filterQuotes();
  syncQuotes();
  setInterval(syncQuotes, 60000); // sync every 60 sec
};
