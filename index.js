const dbGeneratorBtn = document.getElementById("db-generator");
const searchField = document.getElementById("search-field");
const resultsEl = document.getElementById("results");
const apiKey = "a66f0a26&s";
const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}`;

async function getMovieData(imdbID) {
  const url = `${apiUrl}&i=${imdbID}`;
  const dataID = await fetchData(url);

  if (!dataID || !dataID.imdbID) {
    console.error(`IMDb ID not found for movie with ID: ${imdbID}`);
    return null;
  }

  const movie = {
    savedTitle: dataID.Title || "Unknown Title",
    savedImdbID: dataID.imdbID || "Unknown IMDb ID",
    savedPoster: dataID.Poster || "Unknown Poster",
    savedRuntime: dataID.Runtime || "Unknown Runtime",
    savedYear: dataID.Year || "Unknown Year",
    savedGenre: dataID.Genre || "Unknown Genre",
    savedPlot: dataID.Plot || "Unknown Plot",
    savedRating: dataID.imdbRating || "Unknown Rating",
  };
  return movie;
}

dbGeneratorBtn.addEventListener("click", handleClick);
searchField.addEventListener("keypress", function (e) {
  if (e.key === "Enter" || e.key === "Return") {
    e.preventDefault();
    handleClick();
  }
});

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

async function fetchMovieDetails(movie) {
  const url = `${apiUrl}&i=${movie.imdbID}`;
  const dataID = await fetchData(url);

  if (dataID === null) {
    return null;
  }

  // Update properties on the `movie` object, similar to `getMovieData`
  movie.Title = dataID.Title || "Unknown Title";
  movie.imdbID = dataID.imdbID || "Unknown IMDb ID";
  movie.Poster = dataID.Poster || "Unknown Poster";
  movie.Runtime = dataID.Runtime || "Unknown Runtime";
  movie.Year = dataID.Year || "Unknown Year";
  movie.Genre = dataID.Genre || "Unknown Genre";
  movie.Plot = dataID.Plot || "Unknown Plot";
  movie.imdbRating = dataID.imdbRating || "Unknown Rating";
}

async function handleClick() {
  if (searchField.value) {
    const searchUrl = `${apiUrl}&s=${searchField.value}`;
    const searchData = await fetchData(searchUrl);
    const results = searchData.Search;

    searchField.value = "";

    const moviePromises = results.map(fetchMovieDetails);
    await Promise.all(moviePromises);
    resultsEl.classList.remove("hidden");

    resultsEl.innerHTML = results
      .map(
        (movie) => `
        <div class="movie-card-holder">
          <img
            class="poster"
            src="${movie.Poster}"
            alt="${movie.Title}"
          />
          <div class="search-data">
            <div id="search-result-data" class="inline">
              <h3 class="movie-title">${movie.Title} (${movie.Year})</h3>
              <p>
                <i class="fa-solid fa-star" style="color: #e6c20f"></i>
                ${movie.imdbRating}
              </p>
              
            </div>
            <div class="small-font inline">
              <p>${movie.Runtime}</p>
              <p>${movie.Genre}</p>
              <button class="add-to-watchlist-btn" data-imdbid="${movie.imdbID}">
                <i class="fa-solid fa-circle-plus" style="color: #000000"></i>
                Watchlist
              </button>
            </div>
            <p class="plot">
              ${movie.Plot}
            </p>
          </div>
        </div>
      `
      )
      .join("");
  } else {
    document.getElementById("before-search").innerHTML = `
      <h2 id="before-search-text">Unable to find what you are looking for. Please try again.</h2>`;
  }

  // Event listener for the "Add to Watchlist" button using event delegation
  resultsEl.addEventListener("click", async function (e) {
    if (e.target.classList.contains("add-to-watchlist-btn")) {
      const imdbID = e.target.getAttribute("data-imdbid");
      if (imdbID) {
        const movieData = await getMovieData(imdbID);

        if (movieData) {
          addToWatchlist(movieData);
        } else {
          console.log("movieData is null");
        }
      } else {
        console.log("IMDb ID not found.");
      }
    }
  });
}

function setWatchlist(watchlist) {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}
function getWatchlist() {
  const watchlistData = localStorage.getItem("watchlist");
  return JSON.parse(watchlistData) || [];
}

async function addToWatchlist(movieData) {
  if (!movieData) {
    console.log("movieData is null. Unable to add to the watchlist.");
    return;
  }

  if (
    !movieData.savedTitle ||
    !movieData.savedImdbID ||
    !movieData.savedPoster
  ) {
    alert("Invalid movie data. Unable to add to the watchlist.");
    return;
  }

  if (isDuplicate(movieData)) {
    alert("This movie is already in your watchlist.");
  } else {
    // Proceed to add the movie to the watchlist
    const existingWatchlist = getWatchlist();
    existingWatchlist.push(movieData);
    setWatchlist(existingWatchlist);
    alert("Movie added to your watchlist!");

    console.log("logs out", existingWatchlist);
  }
}

function isDuplicate(movie) {
  const existingWatchlist = getWatchlist();
  return existingWatchlist.some(
    (existingMovie) => existingMovie.savedImdbID === movie.savedImdbID
  );
}
