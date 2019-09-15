// spotify auth

// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'd26e88609500431ea13263b4a5506bc4';
const redirectUri = 'https://fuego.glitch.me';
const scopes = [
  'user-top-read'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

const app = document.getElementById('root');

const logo = document.createElement('img');
logo.setAttribute('class','header');
logo.src = 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png';

const container = document.createElement('div');
container.setAttribute('class', 'container');

const description = document.createElement('p');
description.textContent = "This is a page to show you your top 20 Spotify artists and their current overall popularity value (based on the number of streamed songs and how recent those streams are).";

app.appendChild(logo);
app.appendChild(description);
app.appendChild(container);

// Make a call using the token

var ajaxCount = 1;
var selection = sessionStorage.selection || "long";
console.log(sessionStorage.selection);
var popularityCount = 0;
var avg_popularity = 0;

// set dropdown selection in sessionStorage and reload page
function setAndReload() {
    // get active selection
    var e = document.getElementById("mySelect");
    var value = e.options[e.selectedIndex].value;
    sessionStorage.selection = value;
    location.reload();
}


$.ajax({
  url: "https://api.spotify.com/v1/me/top/artists?time_range=" + selection + "_term",
  type: "GET",
  beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
  success: function(data) {
    // Do something with the returned data
    data.items.map(function(artist) {
      let item = $('<li>' + artist.name + " is that popular: " + artist.popularity + '</li>');
      
      console.log(item);
      // item.appendTo($('#top-artists'));
      
      // card
      
      const card = document.createElement('div');
      card.setAttribute('class', 'card');
      
      // Create an h1 and set the text content to the film's title
      const h1 = document.createElement('h1');
      h1.textContent = "#" + ajaxCount + ": " + artist.name;
      
      // Create a p and set the text content to the film's description
      var imageURL = artist.images[0].url;
      
      
      
      const p = document.createElement('p');
      p.setAttribute("style", "background-image: url('" + imageURL + "')");
      p.setAttribute('class', 'content');
      p.textContent = artist.popularity + "🔥";
      popularityCount = popularityCount + artist.popularity;
      console.log(popularityCount);
      
      // p.appendChild(artist.items.images[1].url)
      
      container.appendChild(card);
      
      card.appendChild(h1);
      card.appendChild(p);
      
      ajaxCount++;
    });
    
    avg_popularity = popularityCount / ajaxCount;
    
    // rounding to 2 decimal digits
    avg_popularity = Math.round(avg_popularity * 100) / 100
    
    // verdict and disclaimer
    
    const verdict = document.createElement('p');
    verdict.textContent = "Your average popularity value is: " + avg_popularity;
    
    
    // 80-100 = trend whore
    // 60-79 = basic
    // 40-59 = get with the times
    // 0-39 = you're probably living on the moon and don't care what everybody else thinks because your music is NOT POPULAR
    
    // apparently ifs are the fastest implementation
    if (avg_popularity >= 80) { verdict.textContent += " You're going with the trend." } else
    if (avg_popularity >= 60) { verdict.textContent += " You're pretty basic, kind of the average. 🤷" } else
    if (avg_popularity >= 40) { verdict.textContent += " Get with the times!" } else
      { verdict.textContent += " You're probably living on the moon and don't care what everybody else thinks because your music is NOT POPULAR!!" }
      
    
    const disclaimer = document.createElement('p');
    disclaimer.textContent = "(Currently based on your " + selection + " term Spotify history.)";
    // TODO: give explanation of how much data is used for short medium & long term (if statements)
    
    app.append(verdict);
    app.append(disclaimer);
    
    // selector
    
    var options = ["short", "medium" , "long"];

    //Create and append select list (needs div container)
    
    var selectDiv = document.createElement("div");
    selectDiv.id = "mySelectDiv"
    selectDiv.align = "center"
    var selectList = document.createElement("select");
    selectList.id = "mySelect";
    selectList.setAttribute("onchange", "setAndReload()");
    selectDiv.appendChild(selectList);
    app.appendChild(selectDiv);

    //Create and append the options
    
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.value = options[i];
        option.text = options[i];
        selectList.appendChild(option);
    }
    
    selectList.selectedIndex = options.indexOf(selection, 0);
    
    // TODO: link to artist page on Spotify
    
  }
});