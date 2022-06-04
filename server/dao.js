/* Data Access Object (DAO) module for accessing film library */

const sqlite = require("sqlite3");
const dayjs = require("dayjs");

const db = new sqlite.Database("films.db", (err) => {
  if (err) throw err;
});

const listFilms = (IdUser) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM films WHERE user=?";
    db.all(sql, [IdUser], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const films = rows.map((f) => ({
        id: f.id,
        title: f.title,
        favorite: f.favorite,
        watchdate: f.watchdate,
        rating: f.rating,
      }));
      resolve(films);
    });
  });
};

const getFilm = (idFilm,IdUser) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM films WHERE id=? AND user=?";
    db.get(sql, [idFilm,IdUser], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: "Film not found." });
      } else {
        const film = {
          id: row.id,
          title: row.title,
          favorite: row.favorite,
          watchdate: row.watchdate,
          rating: row.rating,
        };
        resolve(film);
      }
    });
  });
};

const favoriteFilms = (IdUser) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM films WHERE films.favorite=1 AND user=?";
    db.all(sql, [IdUser], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const films = rows.map((f) => ({
        id: f.id,
        title: f.title,
        favorite: f.favorite,
        watchdate: f.watchdate,
        rating: f.rating,
      }));
      resolve(films);
    });
  });
};

const bestRatedFilms = (IdUser) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM films WHERE films.rating=5 AND user=?";
    db.all(sql, [IdUser], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const films = rows.map((f) => ({
        id: f.id,
        title: f.title,
        favorite: f.favorite,
        watchdate: f.watchdate,
        rating: f.rating,
      }));
      resolve(films);
    });
  });
};

const seenLastMonthFilms = (IdUser) => {
  function compareDate(d) {
    date1 = dayjs(d);
    date2 = dayjs().subtract(30, "days");
    return date2.isBefore(date1);
  }
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM films WHERE user=?";
    db.all(sql, [IdUser], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const films = rows
        .map((f) => ({
          id: f.id,
          title: f.title,
          favorite: f.favorite,
          watchdate: f.watchdate,
          rating: f.rating,
        }))
        .filter((f) => compareDate(f.watchdate));
      resolve(films);
    });
  });
};

const unseenFilms = (IdUser) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM films WHERE user=?";
    db.all(sql, [IdUser], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const films = rows
        .map((f) => ({
          id: f.id,
          title: f.title,
          favorite: f.favorite,
          watchdate: f.watchdate,
          rating: f.rating,
        }))
        .filter((f) => f.watchdate == undefined);
      resolve(films);
    });
  });
};

const createFilm = (film,IdUser) => {
  return new Promise((resolve, reject) => {
    //Unseen
    if (film.watchdate === "1970-01-01") {
      sql =
        "INSERT INTO films(id,title,favorite,watchdate,rating,user) VALUES(NULL,?,?,NULL,?,?)";
      db.run(sql, [film.title, film.favorite, film.rating, IdUser], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    }
    //Watched
    else {
      sql =
        "INSERT INTO films(id,title,favorite,watchdate,rating,user) VALUES(NULL,?,?,?,?,?)";
      db.run(
        sql,
        [film.title, film.favorite, film.watchdate, film.rating, IdUser],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    }
  });
};

const updateFilm = (film,IdUser) => {
  return new Promise((resolve, reject) => {
    if (film.watchdate === "1970-01-01") {
      const sql =
        "UPDATE films SET title=?,favorite=?,watchdate=NULL,rating=? WHERE id=? AND user=?";
      db.run(
        sql,
        [film.title, film.favorite, film.rating, film.id, IdUser],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    }
    //Watched
    else {
      const sql ="UPDATE films SET title=?,favorite=?,watchdate=?,rating=? WHERE id=? AND user=?";
      db.run(
        sql,
        [film.title, film.favorite, film.watchdate, film.rating, film.id,IdUser],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    }
  });
};

const updateFavFilm = (film,IdUser) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE films SET favorite=? WHERE id=? AND user=?";
    db.run(sql, [film.favorite, film.id,IdUser], (err, row) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

const deleteFilm = (id,IdUser) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM films WHERE id=? AND user=?";
    db.run(sql, [id,IdUser], (err, row) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  listFilms,
  getFilm,
  favoriteFilms,
  bestRatedFilms,
  seenLastMonthFilms,
  unseenFilms,
  createFilm,
  updateFilm,
  updateFavFilm,
  deleteFilm,
};
