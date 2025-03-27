// let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
//   const addBtn = document.querySelector("#new-toy-btn");
//   const toyFormContainer = document.querySelector(".container");
//   addBtn.addEventListener("click", () => {
//     // hide & seek with the form
//     addToy = !addToy;
//     if (addToy) {
//       toyFormContainer.style.display = "block";
//     } else {
//       toyFormContainer.style.display = "none";
//     }
//   });
// });

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const API_URL = "http://localhost:3000/toys";

  // Toggle the display of the toy form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Create a toy card element
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    // Toy Name
    const h2 = document.createElement("h2");
    h2.textContent = toy.name;
    card.appendChild(h2);

    // Toy Image
    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";
    card.appendChild(img);

    // Toy Likes
    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;
    card.appendChild(p);

    // Like Button
    const likeButton = document.createElement("button");
    likeButton.className = "like-btn";
    likeButton.id = toy.id;
    likeButton.textContent = "Like ❤️";
    card.appendChild(likeButton);

    // Event listener to handle like button click
    likeButton.addEventListener("click", () => {
      const newLikes = toy.likes + 1;
      fetch(`${API_URL}/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      })
        .then((response) => response.json())
        .then((updatedToy) => {
          toy.likes = updatedToy.likes;
          p.textContent = `${updatedToy.likes} Likes`;
        })
        .catch((error) => console.error("Error updating likes:", error));
    });

    return card;
  }

  // Fetch toys from the API and render them in the DOM
  function fetchToys() {
    fetch(API_URL)
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => {
          const toyCard = createToyCard(toy);
          toyCollection.appendChild(toyCard);
        });
      })
      .catch((error) => console.error("Error fetching toys:", error));
  }

  // Event listener to handle new toy form submissions
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(toyForm);
    const toyData = {
      name: formData.get("name"),
      image: formData.get("image"),
      likes: 0,
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toyData),
    })
      .then((response) => response.json())
      .then((newToy) => {
        const newToyCard = createToyCard(newToy);
        toyCollection.appendChild(newToyCard);
        toyForm.reset();
      })
      .catch((error) => console.error("Error adding new toy:", error));
  });

  // Initial fetch of toys when the page loads
  fetchToys();
});
