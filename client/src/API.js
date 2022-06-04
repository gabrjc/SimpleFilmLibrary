import Film from "./film.js"
const dayjs = require("dayjs");
const URL = 'http://localhost:3001/api'


async function getAllFilms() {
  // call  /api/exams
  const response = await fetch(URL+'/films/filter/All',{credentials: 'include'});
  const filmsJson = await response.json();
  if (response.ok) {
    return filmsJson.map((f) => (new Film(f.id, f.title,f.favorite, dayjs(f.watchdate),f.rating)) )
  } else {
    throw filmsJson;  // errore
  }
}

async function getFavorite() {
    // call  /api/exams
    const response = await fetch(URL+'/films/filter/favorite',{credentials: 'include'});
    const filmsJson = await response.json();
    if (response.ok) {
      return filmsJson.map((f) => (new Film(f.id, f.title,f.favorite, dayjs(f.watchdate),f.rating)) )
    } else {
      throw filmsJson;  // errore
    }
  }
  

  async function getBestRated() {
    // call  /api/exams
    const response = await fetch(URL+'/films/filter/bestRated',{credentials: 'include'});
    const filmsJson = await response.json();
    if (response.ok) {
      return filmsJson.map((f) => (new Film(f.id, f.title,f.favorite, dayjs(f.watchdate),f.rating)) )
    } else {
      throw filmsJson;  // errore
    }
  }
  async function getSeenLastMonth() {
      // call  /api/exams
      const response = await fetch(URL+'/films/filter/seenLastMonth',{credentials: 'include'});
      const filmsJson = await response.json();
      if (response.ok) {
         return filmsJson.map((f) => (new Film(f.id, f.title,f.favorite, dayjs(f.watchdate),f.rating)) )
      } else {
        throw filmsJson;  // errore
      }
    }
    async function getUnseen() {
        // call  /api/exams
        const response = await fetch(URL+'/films/filter/unseen',{credentials: 'include'});
        const filmsJson = await response.json();
        if (response.ok) {
          return filmsJson.map((f) => (new Film(f.id, f.title,f.favorite, dayjs(f.watchdate),f.rating)) )
        } else {
          throw filmsJson;  // errore
        }
      }

      
function deleteFilm(Id) {
  // call: DELETE /api/film/:id

  return new Promise((resolve, reject) => {
    fetch(URL+"/film/" + Id,
    {method: 'DELETE', credentials: 'include'})
      .then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}


function addFilm(film) {
  // call: POST /api/films
  return new Promise((resolve, reject) => {
    fetch(URL+"/films", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: film.Title,
        favorite: film.Favorite ? 1:0,
        watchdate: film.Watch_date.format("YYYY-MM-DD"),
        rating: film.Score
      })
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function updateFilm(film) {
  // call: PUT /api/films/:Id
  return new Promise((resolve, reject) => {
    fetch(URL+"/film/"+film.Id, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: film.Title,
        favorite: film.Favorite ? 1:0,
        watchdate: film.Watch_date.format("YYYY-MM-DD"),
        rating: film.Score
      }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}


function updateFavorite(id,value) {
  // call: PUT /api/films/:Id/fav
  return new Promise((resolve, reject) => {
    fetch(URL+"/film/"+id+"/fav", {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        favorite: value ? 1:0
      }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

async function logIn(credentials) {
  let response = await fetch(URL+'/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL+'/sessions/current', { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
  const response = await fetch(URL+'/sessions/current', {credentials: 'include'});
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

const API = {getAllFilms,getBestRated,getFavorite,getSeenLastMonth,getUnseen,deleteFilm,addFilm,updateFilm,updateFavorite,logIn,logOut,getUserInfo};
export default API;