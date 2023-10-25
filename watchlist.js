// Function to set the watchlist in Local Storage
function setWatchlist(watchlist) {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

// Function to get the watchlist from Local Storage
function getWatchlist() {
  const watchlistData = JSON.parse(localStorage.getItem("watchlist"));
  return watchlistData || [];
}

// Function to render the watchlist
function renderWatchlist() {
  const watchlist = getWatchlist();
  let html = "";

  watchlist.forEach((movie) => {
    html += `
      <div class="movie-card-holder">
        <img
          class="poster"
          src="${movie.savedPoster}"
          alt="${movie.savedTitle}"
        />
        <div class="search-data">
          <div id="search-result-data" class="inline">
            <h3 class="movie-title">${movie.savedTitle} (${movie.savedYear})</h3>
            <p>
              <i class="fa-solid fa-star" style="color: #e6c20f"></i>
              ${movie.savedRating}
            </p>
          </div>
          <div class="small-font inline">
            <p>${movie.savedRuntime}</p>
            <p>${movie.savedGenre}</p>
            <button class="remove-from-watchlist-btn" data-imdbid="${movie.savedImdbID}">
              <i class="fa-solid fa-circle-minus" style="color: #000000"></i>
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("list-results").innerHTML = html;
  document.getElementById("list-results").style.color = "#444444";
  document.getElementById("list-results").classList.add("no-margin");

  // Add event listeners to the "Remove" buttons
  const removeButtons = document.querySelectorAll(".remove-from-watchlist-btn");

  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const imdbID = button.getAttribute("data-imdbid");
      removeFromWatchlist(imdbID);
    });
  });
}

// Function to remove a movie from the watchlist
function removeFromWatchlist(imdbID) {
  const watchlist = getWatchlist();

  const updatedWatchlist = watchlist.filter(
    (movie) => movie.savedImdbID !== imdbID
  );

  setWatchlist(updatedWatchlist);

  // Re-render the watchlist after removal
  renderWatchlist();
}

// Wait for the DOM to be fully loaded

document.addEventListener("DOMContentLoaded", function () {
  renderWatchlist(); // Render the watchlist when the page loads
});
