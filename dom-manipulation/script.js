// Initial array of quotes
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Life" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Wisdom" }
];

// Function: Show a random quote
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;

  if (category !== "all") {
    filteredQuotes = quotes.filter(q => q.category === category);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = `
    "${randomQuote.text}" <div class="category">– ${randomQuote.category}</div>
  `;
}

// Function: Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });

    // Clear inputs
    textInput.value = "";
    categoryInput.value = "";

    alert("New quote added successfully!");

    // Update dropdown if new category is added
    populateCategories();
  } else {
    alert("Please fill in both the quote and the category.");
  }
}

// Function: Dynamically create Add Quote form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  formContainer.innerHTML = `
    <h2>Add a New Quote</h2>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuote">Add Quote</button>
  `;

  document.body.appendChild(formContainer);

  document.getElementById("addQuote").addEventListener("click", addQuote);
}

// Function: Populate categories dynamically
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const currentValue = dropdown.value; // Preserve current selection

  // Clear existing options (except "All Categories")
  dropdown.innerHTML = `<option value="all">All Categories</option>`;

  // Extract unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Add categories to dropdown
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  // Restore selection from localStorage if available
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory && (savedCategory === "all" || categories.includes(savedCategory))) {
    dropdown.value = savedCategory;
  } else {
    dropdown.value = currentValue; // fallback to previously selected
  }
}

// Function: Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory); // Save preference
  showRandomQuote(); // Update display
}

// Initialize
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
createAddQuoteForm();
populateCategories();
filterQuotes(); // Show quotes immediately on load
