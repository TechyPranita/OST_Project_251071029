
let clothes = JSON.parse(localStorage.getItem("outfitlyClothes")) || [];

const form = document.getElementById("clothesForm");
const clothesList = document.getElementById("clothesList");
const filter = document.getElementById("filter");

// Save wardrobe items in browser storage
function saveClothes() {
  localStorage.setItem("outfitlyClothes", JSON.stringify(clothes));
}

// Display clothes on the website
function displayClothes() {
  clothesList.innerHTML = "";

  const selectedCategory = filter.value;

  const filteredClothes = clothes.filter(item =>
    selectedCategory === "All" || item.category === selectedCategory
  );

  if (filteredClothes.length === 0) {
    clothesList.innerHTML =
      '<p class="empty-message">No clothes added yet. Add your first item!</p>';
  }

  filteredClothes.forEach(item => {
    const card = document.createElement("div");
    card.className = "clothing-card";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const category = document.createElement("p");
    category.textContent = "Category: " + item.category;

    const colour = document.createElement("p");
    colour.textContent = "Colour: " + item.color;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.className = "delete-btn";

    deleteButton.addEventListener("click", () => {
      clothes = clothes.filter(clothing => clothing.id !== item.id);
      saveClothes();
      displayClothes();
      updateOutfitOptions();
    });

    card.append(name, category, colour, deleteButton);
    clothesList.appendChild(card);
  });

  updateOutfitOptions();
}

// Add a new clothing item
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("itemName").value.trim();
  const category = document.getElementById("category").value;
  const color = document.getElementById("color").value.trim();

  if (!name || !category || !color) return;

  clothes.push({
    id: Date.now(),
    name: name,
    category: category,
    color: color
  });

  saveClothes();
  form.reset();
  displayClothes();
});

// Filter clothes by category
filter.addEventListener("change", displayClothes);

// Update outfit dropdown options
function updateOutfitOptions() {
  const choices = [
    { id: "topChoice", category: "Tops" },
    { id: "bottomChoice", category: "Bottoms" },
    { id: "shoeChoice", category: "Shoes" }
  ];

  choices.forEach(choice => {
    const select = document.getElementById(choice.id);
    const previousValue = select.value;

    select.innerHTML = '<option value="">Choose an item</option>';

    clothes
      .filter(item => item.category === choice.category)
      .forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name + " (" + item.color + ")";
        select.appendChild(option);
      });

    if ([...select.options].some(option => option.value === previousValue)) {
      select.value = previousValue;
    }
  });
}

// Create an outfit
document.getElementById("createOutfit").addEventListener("click", function() {
  const top = document.getElementById("topChoice");
  const bottom = document.getElementById("bottomChoice");
  const shoes = document.getElementById("shoeChoice");
  const result = document.getElementById("outfitResult");

  if (!top.value || !bottom.value || !shoes.value) {
    result.textContent = "Please choose a top, bottom and shoes first.";
    return;
  }

  const selectedItems = [top, bottom, shoes].map(select =>
    clothes.find(item => item.id === Number(select.value))
  );

  result.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = "Your outfit is ready! ✨";

  const details = document.createElement("p");
  details.textContent = selectedItems
    .map(item => item.name + " - " + item.color)
    .join(" | ");

  result.append(heading, details);
});

// Show saved wardrobe when the page opens
displayClothes();
