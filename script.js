// Function to retrieve player data from the REST API endpoint
function getPlayerData(playerName) {
    var endpoint = `https://bluecheese-e63f.restdb.io/rest/players?q={"name":"${playerName}"}`;
    var apiKey = '64a529e886d8c5398ced8f95'; // Replace with your API key

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": endpoint,
        "method": 'GET',
        "headers": {
            'Content-Type': 'application/json',
            'x-apikey': apiKey,
            'Cache-Control': 'no-cache'
        }
    };

    return $.ajax(settings);
}

// Function to update the player's score in the REST API endpoint
function updatePlayerScore(playerId, newScore) {
    var endpoint = `https://bluecheese-e63f.restdb.io/rest/players/${playerId}`;
    var apiKey = '64a529e886d8c5398ced8f95'; // Replace with your API key
    var dataToUpdate = { score: newScore };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": endpoint,
      "method": "PUT",
      "headers": {
        "content-type": "application/json",
        "x-apikey": apiKey,
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(dataToUpdate)
    }

    return $.ajax(settings);
}

// Event listener for form submission
document.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    var players = document.querySelectorAll('h2');
    var promises = [];

    // Iterate through each player in the form
    players.forEach(function(player) {
        var playerName = player.textContent;
        var ratingInput = document.getElementById(playerName.split(' ')[0].toLowerCase().replace(/ /g, '-') + '-rating');
        var rating = ratingInput.value;

        // Retrieve player data and update score
        var playerPromise = getPlayerData(playerName)
            .then(function(response) {
              console.log(response);
                var playerId = response[0]._id;
                var currentScore = parseInt(response[0].score);
                var newScore = currentScore + parseInt(rating);
                
                if(!Number.isNaN(newScore)) {
                  return updatePlayerScore(playerId, newScore);
                }
                
            });

        promises.push(playerPromise);
    });

    // Handle all promises once they are resolved
    Promise.all(promises)
        .then(function() {
            alert('Ratings submitted successfully');
        })
        .catch(function(error) {
            alert('Error submitting ratings:', error);
        });

    // Reset the form after submission
});
