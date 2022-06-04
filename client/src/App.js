import { React, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Alert} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyBigLab1.css";
import HomePage from "./homepage.js";
import Film from "./film.js";
import NoMatch from "./ErrorPage/NoMatch.js";
import FilmFormMaker from "./FilmForm";
import API from "./API.js";
import Login from "./Login.js";

const dayjs = require("dayjs");

function App() {
  return (
    <Router>
      <AppInside />
    </Router>
  );
}

function AppInside() {
  // eslint-disable-next-line
  const navigate = useNavigate();

  const [waiting, setWaiting] = useState(true);
  const [filmStart, setFilmStart] = useState([]);

  const [filter, setFilter] = useState([]);
  /*Dati da aggiornare*/
  const [dirty, setDirty] = useState(false);
  /*Sessione user */
  const [loggedIn, setLoggedIn] = useState(false); // no user is logged in when app loads
  const [user, setUser] = useState({});

  const [message, setMessage] = useState("");

  useEffect(() => {
    const ChooseFilter = async () => {
      switch (filter) {
        case "All":
          API.getAllFilms()
            .then((films) => setFilmStart(films))
            .catch((err) => handleError(err));
          break;
        case "Favorites":
          API.getFavorite()
            .then((films) => setFilmStart(films))
            .catch((err) => {
              handleError(err);
            });
          break;
        case "BestRated":
          API.getBestRated()
            .then((films) => setFilmStart(films))
            .catch((err) => handleError(err));
          break;
        case "SeenLastMonth":
          API.getSeenLastMonth()
            .then((films) => setFilmStart(films))
            .catch((err) => handleError(err));
          break;
        case "Unseen":
          API.getUnseen()
            .then((films) => setFilmStart(films))
            .catch((err) => handleError(err));
          break;
        default:
          /*
          API.getAllFilms()
            .then((films) => setFilmStart(films))
            .catch((err) => console.log(err));
     */ break;
      }
      setWaiting(false);
      setDirty(false);
    };
    setWaiting(true);
    ChooseFilter();
  }, [filter, dirty]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        handleError(err);
      }
    };
    checkAuth();
  }, [filter]);

  
  useEffect(() => {
    if (loggedIn)
      API.getAllFilms()
        .then( (films) => { setFilmStart(films); setDirty(true); } )
        .catch( err => handleError(err))
  }, [loggedIn])


  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setFilmStart([]);
  };

  const doLogIn = async (credentials) => {
    await API.logIn(credentials)
      .then((user) => {
        setLoggedIn(true);
        setUser(user);
        setMessage("");
      })
      .catch((err) => {
        setMessage("Username e/o password errate");
      });
  };

  function handleError(err) {
    if (
      err.error === "Unauthenticated user!" ||
      err.error === "not authenticated"
    )
      setLoggedIn(false);
  }

  function deleteFilm(Id) {
    setFilmStart((filmStart) =>
      filmStart.map((f) => (f.Id === Id ? { ...f, status: "deleted" } : f))
    );

    API.deleteFilm(Id)
      .then(() => setDirty(true))
      .catch((err) => console.log(err));
  }

  function addFilm(F) {
    const newFilm = new Film(999, F.Title, F.Favorite, F.Watch_date, F.Score);
    newFilm.status = "added";
    setFilmStart((filmStart) => [...filmStart, newFilm]);
    API.addFilm(newFilm)
      .then(() => setDirty(true))
      .catch((err) => console.log(err));
  }

  function updateFilm(Film) {
    setFilmStart((films) =>
      films.map((f) =>
        f.Id === Film.Id ? Object.assign({}, Film, { status: "updated" }) : f
      )
    );
    API.updateFilm(Film)
      .then(() => setDirty(true))
      .catch((err) => console.log(err));
  }
  function changeFav(myFilm) {
    let newFilm = myFilm.copy();
    newFilm.Favorite = !myFilm.Favorite;
    setFilmStart((films) =>
      films.map((f) =>
        f.Id === myFilm.Id
          ? Object.assign({}, newFilm, { status: "updated" })
          : f
      )
    );
    API.updateFavorite(newFilm.Id, newFilm.Favorite)
      .then(() => setDirty(true))
      .catch((err) => console.log(err));
  }

  function changeStars(myFilm, n) {
    let newFilm = myFilm.copy();
    newFilm.Score = n;
    //Gestione unseen
    if (!newFilm.Watch_date.isValid()) newFilm.Watch_date = dayjs("1970-01-01");
    //Temporary
    setFilmStart((films) =>
      films.map((f) =>
        f.Id === myFilm.Id
          ? Object.assign({}, newFilm, { status: "updated" })
          : f
      )
    );
    //Persistent
    API.updateFilm(newFilm)
      .then(() => setDirty(true))
      .catch((err) => console.log(err));
  }

  function getFilm(id) {
    return filmStart.filter((f) => f.Id === parseInt(id));
  }

  return (
    <>
      {message ? (
        <Alert
          className="alert-fix"
          variant="danger"
          onClose={() => setMessage("")}
          dismissible
        >
          {message}
        </Alert>
      ) : (
        false
      )}
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/All" /> : <Login login={doLogIn}/>}
        />
        <Route
          path="/Login"
          element={
            loggedIn ? <Navigate to="/All" /> : <Login login={doLogIn} />
          }
        />
        <Route
          path="/:FilterUrl"
          element={
            loggedIn ? 
              <HomePage
                filmStart={filmStart}
                deleteFilm={deleteFilm}
                addFilm={addFilm}
                changeFav={changeFav}
                changeStars={changeStars}
                setFilter={setFilter}
                waiting={waiting}
                setWaiting={setWaiting}
                utente={user}
                logout={doLogOut}
              />
            : 
              <Navigate to="/Login" />
            
          }
        />

        <Route
          path="/editFilm"
          element={
            loggedIn ? (
              <FilmFormMaker
                addFilm={addFilm}
                updateFilm={updateFilm}
                getFilm={getFilm}
              />
            ) : (
              <Login login={doLogIn} />
            )
          }
        />

        <Route path="/errorPage" element={<NoMatch />} />
      </Routes>
    </>
  );
}

export default App;
