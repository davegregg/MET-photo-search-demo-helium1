let mainElement = document.querySelector("main")
let searchForm = document.querySelector("#search")
let searchInput = document.querySelector("#search input")

/*
    1. When the user submits the search form, we will get their search term ready.
    2. Then we will trigger the first fetch() request, which will use the user's
       search term to search the Metropolitan Museum of Art's API for museum objects
       which best match that search term.
*/

searchForm.addEventListener("submit", event => {
    event.preventDefault() // <form> normally does some stuff we don't want.

    let searchTerm = searchInput.value.toLowerCase() // Preparing user input
    fetchTopSearchResult(searchTerm) // Let's trigger our first fetch() request
})

/*
    Because the `/public/collection/v1/search` only gives us an array of IDs,
    our task is:
    1. First, fetch the ID of the top search result,
    2. and THEN, fetch more information for the object which has that ID,
        which we will do by running our fetchMuseumObjectDetails() function.

    By the end, we will have two fetch() requests. These are easier to manage when
    we put them inside their own functions.
*/

function fetchTopSearchResult (searchTerm) {    
    //             domain---------------------endpoint--------------------query parameters
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            let topResultID = data.objectIDs[0] /* By reading the API documentation and console
                                                   logging the `data` object, we learned that it
                                                   contains an `objectIDs` property, which is an
                                                   array of IDs. We have decided that we just want
                                                   the top search result, so we only need the
                                                   first ID in the array. */

            fetchMuseumObjectDetails(topResultID) /* Instead of writing the SECOND fetch() within
                                                     this first fetch(), we will write it in a
                                                     function with a readable name, and trigger
                                                     that function from here. This is a best-
                                                     practice, because it keeps our code much 
                                                     more manageable. */ 
        })    
}

function fetchMuseumObjectDetails (id) {
    /*
        Now that we have the ID for identifying which museum "object" we want to get more
        information about, we can plug that ID into another endpoint we saw in the API docs
        in order to get _details_ about it.
    */

    fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects/" + id)
        .then(response => response.json())
        .then(museumObject => {

            let imgElement = document.createElement("img")
            imgElement.src = museumObject.primaryImageSmall /* We know this is the right property
                                                               for getting the image URL, because
                                                               we spotted it in the console.log()
                                                               and we saw it in the API docs. */

            mainElement.prepend(imgElement)

        })
}