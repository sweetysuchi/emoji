const emojiContainer = document.getElementById("emojiContainer");
const categoryFilter = document.getElementById("categoryFilter");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const apiUrl = "https://emojihub.yurace.pro/api/all";
let emojisData = [];
const itemsPerPage = 10;
let currentPage = 1;

// Fetch data from the API
async function fetchEmojis() {
  try {
    const storedEmojis = localStorage.getItem("emojisData");
    if (storedEmojis) {
      emojisData = JSON.parse(storedEmojis);
    } else {
      const response = await fetch(apiUrl);
      emojisData = await response.json();
      localStorage.setItem("emojisData", JSON.stringify(emojisData));
    }

    updateCategoryFilter();
    paginateEmojis(currentPage, itemsPerPage, emojisData); // Pass emojisData here
  } catch (error) {
    console.error("Error fetching emojis:", error);
  }
}

function updateCategoryFilter() {
  const categories = [...new Set(emojisData.map((emoji) => emoji.category))];
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All";
  categoryFilter.innerHTML = "";
  categoryFilter.appendChild(allOption);
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function displayEmojis(emojis) {
  emojiContainer.innerHTML = "";
  emojis.forEach((emoji) => {
    const { name, category, group, htmlCode } = emoji;
    const emojiCard = document.createElement("div");
    emojiCard.classList.add("emoji-card");
    emojiCard.innerHTML = `
      <span>${htmlCode}</span>
      <p>Name: ${name}</p>
      <p>Category: ${category}</p>
      <p>Group: ${group}</p>
    `;
    emojiContainer.appendChild(emojiCard);
  });
}

function filterByCategory() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "") {
    paginateEmojis(currentPage, itemsPerPage, emojisData);
  } else {
    const filteredEmojis = emojisData.filter(
      (emoji) => emoji.category === selectedCategory
    );
    paginateEmojis(1, itemsPerPage, filteredEmojis);
  }
  currentPage = 1;
  updatePaginationButtons();
}

function paginateEmojis(pageNumber, itemsPerPage, emojis) {
  if (!emojis) {
    console.error("Emojis data is missing or undefined");
    return;
  }

  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmojis = emojis.slice(startIndex, endIndex);
  displayEmojis(paginatedEmojis);
  updatePaginationButtons();
}
function nextPage() {
  currentPage++;
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "") {
    paginateEmojis(currentPage, itemsPerPage, emojisData);
  } else {
    const filteredEmojis = getFilteredEmojis();
    paginateEmojis(currentPage, itemsPerPage, filteredEmojis);
  }
}

function prevPage() {
  currentPage--;
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "") {
    paginateEmojis(currentPage, itemsPerPage, emojisData);
  } else {
    const filteredEmojis = getFilteredEmojis();
    paginateEmojis(currentPage, itemsPerPage, filteredEmojis);
  }
}

function getFilteredEmojis() {
  const selectedCategory = categoryFilter.value;
  return emojisData.filter((emoji) => emoji.category === selectedCategory);
}

function updatePaginationButtons() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "") {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage * itemsPerPage >= emojisData.length;
  } else {
    const filteredEmojis = getFilteredEmojis();
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled =
      currentPage * itemsPerPage >= filteredEmojis.length;
  }
}

prevPageButton.addEventListener("click", prevPage);
nextPageButton.addEventListener("click", nextPage);

categoryFilter.addEventListener("change", filterByCategory);

fetchEmojis();
