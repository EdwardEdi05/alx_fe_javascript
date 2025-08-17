// Initial array of quotes
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Life" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Wisdom" }
];

// Function: Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    "${randomQuote.text}" <div class="category">– ${randomQuote.category}</div>
  `;
}

// Function: Add a new quote from form input
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    // Add new quote to array
    quotes.push({ text: newText, category: newCategory });

    // Clear inputs
    textInput.value = "";
    categoryInput.value = "";

    alert("New quote added successfully!");
  } else {
    alert("Please fill in both the quote and the category.");
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuote").addEventListener("click", addQuote);
