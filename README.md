# BigLab 2 - Class: 2022 AW1


## Registered Users

Here you can find a list of the users already registered inside the provided database. This information will be used during the fourth week, when you will have to deal with authentication.
If you decide to add additional users, please remember to add them to this table (with **plain-text password**)!

| email                 | password | name  |
|-----------------------|----------|-------|
| john.doe@polito.it    | password | John  |
| mario.rossi@polito.it | password | Mario |

## List of APIs offered by the server

### __Film List__

URL: `/api/films`

Method: GET

Description: Get all the films in database

Request body: _None_

Response: -`200 OK` (success)
          -`500 Internal Server Error` (generic error)

Response body: An array of film object.
```
[{
    "id":1,
    "title":"Pulp Fiction",
    "favorite":1,
    "watchdate":"2022-03-11",
    "rating":5
},{
    "id":2,
    "title":"21 Grams",
    "favorite":1,
    "watchdate":"2022-03-17",
    "rating":4
}...]
```

### __Get a Film (By Id)__

URL: `/api/courses/<Id>`

Method: GET

Description: Get the film identified by the code `<id>`.

Request body: _None_

Response: -`200 OK` (success)
          -`404 Not Found` (wrong id)
          -`500 Internal Server Error` (generic error)

Response body: A film object with the provided id.
```
{
    "id":4,
    "title":"Matrix",
    "favorite":0,
    "watchdate":null
    ,"rating":null
}
```



### __Add a New Film__

URL: `/api/films`

Method: POST

Description: Add a new watched to the list of films.

Request body: An object representing a film.

(Content-Type: `application/json`)
```
{
    "title": "Interstellar",
    "favorite" : 1,
    "watchdate": "2022-05-13",
    "rating": 5,
}

```

Response: -`201 Created` (success) 
          -`503 Service Unavailable` (generic error in database actions)
          -`422 Unprocessable Entity` (The request body is not valid)

Response body: _None_

### __Update an Exam__

URL: `/api/films/<id>`

Method: PUT

Description: Update entirely a watched film, identified by its Id.

Request body: An object representing the entire exam 

(Content-Type: `application/json`).
```
{
    "title": "Kung Fu PANDA",
    "favorite" : 0,
    "watchdate": "2022-04-19",
    "rating": 2,
}
```

Response: -`200 OK` (success)
          -`503 Service Unavailable` (generic error e.g Id not found). 
          -`422 Unprocessable Entity` (Invalid request body).

Response body: _None_

### __Delete a film__

URL: `/api/films/<id>`

Method: DELETE

Description: Delete a watched film, identified by its id.

Request body: _None_

Response: -`204 No Content` (success) 
          -`503 Service Unavailable` (generic error).

Response body: _None_


### Mark an existing film as favorite/unfavorite.


URL: `/api/films/<id>/fav`

Method: PUT

Description: Change favorite status of a watched film through its id.

Request body: An object representing the new status of favorite field. 

(Content-Type: `application/json`).
```
{
    "favorite" : 0,
}
```
Response: -`200 OK` (success) 
          -`422 Unprocessable Entity` (Invalid request body).
          -`503 Service Unavailable` (generic error in database).

Response body: _None_




### Retrieve a list of all the films that fulfill a given filter 

URL: `/api/films/filter/{typeFilter}` 

    where {typeFilter} 
    could be [all,favorite,bestRated,seenLastMonth,unseen]


Method: GET

Description: Get all the films that match with the given filter 

Request body: _None_

Response: -`200 OK` (success)
          -`500 Internal Server Error` (generic error)

Response body: An array of film object.
```
[{
    "id":1,
    "title":"Pulp Fiction",
    "favorite":1,
    "watchdate":"2022-03-11",
    "rating":5
},{
    "id":2,
    "title":"21 Grams",
    "favorite":1,
    "watchdate":"2022-03-17",
    "rating":4
}...]
```
