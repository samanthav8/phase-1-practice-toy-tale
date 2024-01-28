let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();
  newToys();
});


function fetchToys(){
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(toys => {
    renderToys(toys);
  })
  .catch(error => {console.log('Error fetching toys:', error);
  });
}

function newToys(){
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      "name": "Jessie",
      "image": "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
      "likes": 0
    })
  })
  .then(response => response.json())
  .then(toy => console.log(toy))
}

function renderToys(toys) {
  const toyCollection = document.getElementById('toy-collection');

  toys.forEach(toy => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes}Likes</p>
    <button class="like-btn">Like ❤️</button>
    `;
    toyCollection.appendChild(card);

    const likeButton = card.querySelector('.like-btn');
    likeButton.addEventListener('click', () => {
      handleLikeClick(toy, card);
    })
  });
}

function handleLikeClick(toy,card){
  const toyId = toy.id
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-type' : 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
  .then(response => response.json())
  .then(updatedToy => {
    const likesElement = card.querySelector('p');
    likesElement.innerText = `${updatedToy.likes} Likes`;
  })
  .catch(error => {
    console.log('Error updating toy: ', error);
  });
}