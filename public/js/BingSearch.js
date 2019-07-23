// cookie names for data we store
// YOUR API KEY DOES NOT GO IN THIS CODE; don't paste it in.
API_KEY_COOKIE   = "bing-search-api-key";
CLIENT_ID_COOKIE = "bing-search-client-id";

// Bing Search API endpoint
BING_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/images/search";
key = '9af2bcdf1dfc4e10964a70ee19db0c10'

// Various browsers differ in their support for persistent storage by local
// HTML files (IE won't use localStorage, but Chrome won't use cookies). So
// use localStorage if we can, otherwise use cookies.

// try {
//     localStorage.getItem;   // try localStorage

//     window.retrieveValue = function (name) {
//         return localStorage.getItem(name) || "";
//     }
//     window.storeValue = function(name, value) {
//         localStorage.setItem(name, value);
//     }
// } catch (e) {
//     window.retrieveValue = function (name) {
//         var cookies = document.cookie.split(";");
//         for (var i = 0; i < cookies.length; i++) {
//             var keyvalue = cookies[i].split("=");
//             if (keyvalue[0].trim() === name) return keyvalue[1];
//         }
//         return "";
//     }
//     window.storeValue = function (name, value) {
//         var expiry = new Date();
//         expiry.setFullYear(expiry.getFullYear() + 1);
//         document.cookie = name + "=" + value.trim() + "; expires=" + expiry.toUTCString();
//     }
// }

// // get stored API subscription key, or prompt if it's not found
// function getSubscriptionKey() {
//     var key = retrieveValue(API_KEY_COOKIE);
//     while (key.length !== 32) {
//         key = prompt("Enter Bing Search API subscription key:", "").trim();
//     }
//     // always set the cookie in order to update the expiration date
//     storeValue(API_KEY_COOKIE, key);
//     return key;
// }

// escape text for use in HTML
function escape(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").
        replace(/'/g, "&apos;").replace(/"/g, "&quot;");
}

// get the host portion of a URL, strpping out search result formatting and www too
function getHost(url) {
    return url.replace(/<\/?b>/g, "").replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
}

// format plain text for display as an HTML <pre> element
function preFormat(text) {
    text = "" + text;
    return "<pre>" + text.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</pre>"
}


// render functions for various types of search results
searchItemRenderers = { 
    images: function (item, index, count) {
        var height = 120;
        var width = Math.max(Math.round(height * item.thumbnail.width / item.thumbnail.height), 120);
        var html = [];
        if (index === 0) html.push("<p class='images'>");
        var title = escape(item.name) + "\n" + getHost(item.hostPageDisplayUrl);
        html.push("<p class='images' style='max-width: " + width + "px'>");
        html.push("<img src='"+ item.thumbnailUrl + "&h=" + height + "&w=" + width + 
            "' height=" + height + " width=" + width + "'>");
        html.push("<br>");
        html.push("<nobr><a href='" + item.contentUrl + "'>Image</a> - ");
        html.push("<a href='" + item.hostPageUrl + "'>Page</a></nobr><br>");
        html.push(title.replace("\n", " (").replace(/([a-z0-9])\.([a-z0-9])/g, "$1.<wbr>$2") + ")</p>");
        return html.join("");
    }
}


// render image search results
function renderImageResults(items) {
    var len = items.length;
    var html = [];
    if (!len) {
        showDiv("noresults", "No results.");
        hideDivs("paging1", "paging2");
        return "";
    }
    for (var i = 0; i < len; i++) {
        html.push(searchItemRenderers.images(items[i], i, len));
    }
    return html.join("\n\n");
}

// render related items
function renderRelatedItems(items) {
    var len = items.length;
    var html = [];
    for (var i = 0; i < len; i++) {
        html.push(searchItemRenderers.relatedSearches(items[i], i, len));
    }
    return html.join("\n\n");
}

// render the search results given the parsed JSON response
function renderSearchResults(results) {

    // add Prev / Next links with result count
    var pagingLinks = renderPagingLinks(results);
    showDiv("paging1", pagingLinks);
    showDiv("paging2", pagingLinks);
    
    showDiv("results", renderImageResults(results.value));
    if (results.relatedSearches)
        showDiv("sidebar", renderRelatedItems(results.relatedSearches));
}


// handle Bing search request results
function handleBingResponse() {
    //hideDivs("noresults");
    //console.log(id);
    var json = this.responseText.trim();
    var jsobj = {};

    // try to parse JSON results
    try {
        if (json.length) jsobj = JSON.parse(json);
    } catch(e) {
        console.log("invalid json response")
    }
    // if HTTP response is 200 OK, try to render search results
    if (this.status === 200) {

        if (json.length) {
            if (jsobj._type === "Images") {
                var image = jsobj.value[0].contentUrl;
                imagePlace = document.getElementById("enlarge" + 21 + "token");
                imagePlace.style.backgroundImage = "url("+image+")";
                
                console.log(image);
            } else {
                console.log("No search results in JSON response");
            }
        } else {
            console.log("Empty response (are you sending too many requests too quickly?)");
        }
    }

    // Any other HTTP response is an error
    else {
        console.log('error');
    }
}

// perform a search given query and cell id
function bingImageSearch(query, id) {

    var request = new XMLHttpRequest();
    var searchQuery = query + ' Vancouver';
    var queryurl = BING_ENDPOINT + "?q=" + encodeURIComponent(searchQuery);

    // open the request
    try {
        request.open("GET", queryurl);
    } 
    catch (e) {
        console.log("bad request")
        return false;
    }

    // add request headers
    request.setRequestHeader("Ocp-Apim-Subscription-Key", key);
    request.setRequestHeader("Accept", "application/json");
    // var clientid = retrieveValue(CLIENT_ID_COOKIE);
    // if (clientid) request.setRequestHeader("X-MSEdge-ClientID", clientid);
    
    // event handler for successful response
    request.addEventListener("load", function(){
        var json = this.responseText.trim();
        var jsobj = {};

        // try to parse JSON results
        try {
            if (json.length) jsobj = JSON.parse(json);
        } catch(e) {
            console.log("invalid json response")
        }
        // if HTTP response is 200 OK, try to render search results
        if (this.status === 200) {

            if (json.length) {
                if (jsobj._type === "Images") {
                    var image = jsobj.value[0].contentUrl;
                    imagePlace = document.getElementById("enlarge" + id + "token");
                    imagePlace.style.backgroundImage = "url("+image+")";
                    
                    
                    // console.log(image);
                } else {
                    console.log("No search results in JSON response");
                }
            } else {
                console.log("Empty response (are you sending too many requests too quickly?)");
            }
        }

        // Any other HTTP response is an error
        else {
            console.log('error');
        }
    });

    
    // event handler for erorrs
    request.addEventListener("error", function() {
        console.log("error");
    });

    // // event handler for aborted request
    // request.addEventListener("abort", function() {
    //     renderErrorMessage("Request aborted");
    // });

    // send the request
    request.send();
    return false;
}
