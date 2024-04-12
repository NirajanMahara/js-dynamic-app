/* Developer: Nirajan Mahara
   Date: April 10, 2024
   C-Number: C0921977 */

$(document).ready(function() {
  // Get DOM elements for weather
  const errorMsg = document.getElementById("error-msg");
  const weatherContainer = document.getElementById("weather-container");
  const citiesList = document.getElementById("cities-list");
  const loadingContainer = document.getElementById("loading-container");


  // API key for OpenWeatherMap
  const apiKey = "181bbc820d661f8a5720f0e61677053b";

  // Function to convert Celsius to Fahrenheit
  function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }

  // Display weather data on the webpage
  function displayWeather(data) {
    const {
      main,
      name,
      sys,
      weather
    } = data;
    const icon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

    const li = document.createElement("li");
    li.classList.add("city");

    // Convert Celsius to Fahrenheit
    const fahrenheit = celsiusToFahrenheit(main.temp);

    li.innerHTML = `
            <h2 class="city-name">${name}, ${sys.country}</h2>
            <div class="city-temp">${Math.round(
              main.temp
            )}<sup>°C</sup> / ${Math.round(fahrenheit)}<sup>°F</sup></div>
            <img class="city-icon" src="${icon}" alt="${
      weather[0].description
    }">
            <p>${weather[0].description}</p>
        `;
    citiesList.appendChild(li);
    // errorMsg.textContent = ""; // Clear error message
    weatherContainer.style.display = "block"; // Show weather container after displaying data
  }

  // Display error message
  function showError(message) {
    errorMsg.textContent = message;
  }

  // Show loading indicator
  function showLoading() {
    loadingContainer.style.display = "block";
  }

  // Hide loading indicator
  function hideLoading() {
    loadingContainer.style.display = "none";
  }

  // Configure particles.js
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#000"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          nb_sides: 5
        },
        image: {
          src: "img/github.svg",
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#000",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  });

  // Function to save search query to localStorage
  function saveToHistory(query) {
    let history = localStorage.getItem("searchHistory");
    history = history ? JSON.parse(history) : [];
    if (!history.includes(query)) {
      history.push(query);
      localStorage.setItem("searchHistory", JSON.stringify(history));
      displayHistory();
    }
  }

  // Function to display search history
  function displayHistory() {
    let history = localStorage.getItem("searchHistory");
    history = history ? JSON.parse(history) : [];
    const historyList = $("#historyList");
    historyList.empty();
    history.forEach(function(query) {
      const listItem = $(`<li>${query}</li>`);
      const removeButton = $("<button>").text("X").addClass("remove-btn");
      listItem.append(removeButton);
      historyList.append(listItem);
    });
  }

  // Display search history on page load
  displayHistory();


  // Function to fetch pictures from Unsplash API
  function fetchPictures(query) {
    // API Key for Unsplash
    const accessKey = "PnDE2v5xMlFGoNR0J_KMnMFYrRqRd21sbtdXvT2pou0";
    // API URL for fetching pictures based on query
    const apiUrl = `https://api.unsplash.com/photos/random?query=${query}&count=20&client_id=${accessKey}`;

    // AJAX request to fetch pictures
    $.ajax({
      url: apiUrl,
      method: "GET",
      success: function(data) {
        // Clear existing pictures
        $("#pictureGallery").empty();

        // Display fetched pictures
        data.forEach(function(photo) {
          const img = $("<img>").attr("src", photo.urls.small);
          $("#pictureGallery").append(img);
        });

        // Start updating the displayed image with similar ones
        updatePicture(query);
      },
      error: function(xhr, status, error) {
        displayErrorMessage("Error fetching pictures: " + error);
      }
    });
  }

  // Function to periodically update the displayed picture with a similar one
  function updatePicture(query) {
    setInterval(function() {
      fetchPictures(query);
    }, 20000); // Update every 20 seconds
  }

  // Event listener for picture search input
  $("#pictureSearch").on("keyup", function(e) {
    if (e.keyCode === 13) {
      const query = $(this).val().trim();
      if (query !== "") {
        // Save search query to history
        saveToHistory(query);
        // Perform search operation
        // Your code to fetch pictures based on the search query goes here
        console.log("Search query:", query);
        // Clear the input field after search
        $(this).val("");
        // Fetch pictures based on the search query
        fetchPictures(query);
      }
    }
  });

  // Event listener for clicking on search history items
  $("#historyList").on("click", "li", function() {
    const query = $(this).text();
    $("#pictureSearch").val(query);
    console.log("Search query:", query);
    // Fetch pictures based on the selected search query
    fetchPictures(query);
  });

  // Event listener for clicking on remove buttons
  $("#historyList").on("click", ".remove-btn", function(e) {
      e.preventDefault(); // Prevent the default action (e.g., form submission)
      const queryToRemove = $(this).parent().text().trim().replace("X", "");
      removeQueryFromHistory(queryToRemove);
      $(this).parent().remove();
  });

  // Function to remove search query from localStorage
  function removeQueryFromHistory(query) {
    let history = localStorage.getItem("searchHistory");
    history = history ? JSON.parse(history) : [];
    const updatedHistory = history.filter(item => item !== query);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  }

  // Function to fetch weather from OpenWeatherMap API
  function fetchWeather(city) {
    // API URL for fetching weather based on city
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // AJAX request to fetch weather
    $.ajax({
      url: apiUrl,
      method: "GET",
      success: function(data) {
        // Display weather information
        displayWeather(data);
      },
      error: function(xhr, status, error) {
        displayErrorMessage("Error fetching weather: " + error);
      },
      complete: function() {
        hideLoading(); // Hide loading indicator after request completion
      }
    });
  }

  // Function to save city to the list
  function saveCityToList(city) {
    const li = document.createElement("li");
    li.classList.add("city");
    li.textContent = city;
    citiesList.appendChild(li);
  }

  // Function to update date and time
  function updateDateTime() {
    const now = new Date();
    const dateTimeStr =
      now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }) +
      " " +
      now.toLocaleTimeString("en-US");
    $("#dateTime").html(dateTimeStr);
  }

  function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const {
              latitude,
              longitude
            } = position.coords;
            resolve({
              latitude,
              longitude
            });
          },
          (error) => {
            console.error("Error getting current location:", error);
            reject(error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }

  function displayCurrentLocationMap({
    latitude,
    longitude
  }) {
    const mapOptions = {
      center: {
        lat: latitude,
        lng: longitude
      },
      zoom: 8
    };
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    const marker = new google.maps.Marker({
      position: {
        lat: latitude,
        lng: longitude
      },
      map: map,
      title: "Current Location"
    });
  }

  function getCurrentAddress() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async function(position) {
            const {
              latitude,
              longitude
            } = position.coords;
            const reverseGeocodingUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

            try {
              const response = await fetch(reverseGeocodingUrl);
              const data = await response.json();
              const address = data.localityInfo.administrative[2].name;
              displayCurrentAddress(address);
            } catch (error) {
              console.error("Error fetching current address:", error);
              displayCurrentAddress("Unknown");
            }
          },
          function(error) {
            console.error("Error getting current location:", error);
            displayCurrentAddress("Unknown");
          }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      displayCurrentAddress("Unknown");
    }
  }

  function displayCurrentAddress(address) {
    $("#currentAddress").text(address);
  }

  // Function to update date, time, and weather
  function updateDateTimeAndWeather() {
    // Update date and time every second
    setInterval(updateDateTime, 1000);

    getCurrentAddress();

    // Fetch initial weather for a default city
    fetchWeather("New York");
    // Fetch initial pictures for a default pictures
    fetchPictures("Climate Change");

    // Fetch weather for the selected city every minute
    setInterval(function() {
      const city = $("#cityInput").val();
      fetchWeather(city);
    }, 60000); // 1 minute in milliseconds
  }

  // Fetch pictures based on user input
  $("#pictureSearch").on("input", function() {
    const query = $(this).val();
    // Perform search operation
    fetchPictures(query);
  });

  // Fetch weather based on user input
  $("#cityInput").on("change", function() {
    const city = $(this).val();
    fetchWeather(city);
    $(this).val(""); // Reset the input field
  });

  // Toggle Light/Dark Mode
  $(".toggle").on("change", function() {
    $("body").toggleClass("dark-mode");
  });

  // Call the updateDateTimeAndWeather function to initialize date, time, and weather
  updateDateTimeAndWeather();

  // Get current location and display on the map
  getCurrentLocation()
    .then((position) => {
      displayCurrentLocationMap(position);
    })
    .catch((error) => {
      console.error("Error getting current location:", error);
    });

  // Function to display error message
  function displayErrorMessage(message) {
    $("#errorMsgContent").text(message);
    $("#errorMessage").fadeIn().delay(3000).fadeOut();
  }
});
