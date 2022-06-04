'use strict';

const express = require('express');
const {check, validationResult} = require('express-validator');
const dao = require('./dao');
const cors = require('cors');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB


const app = express();
const PORT = 3001;


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'not authenticated'});
}


/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());




/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {

    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});
});



/*** APIs ***/

// GET /api/films

app.get('/api/films', isLoggedIn, async(req, res) => {
  try{
  const films= await dao.listFilms(req.user.id);
  res.status(200).json(films)
  }
    catch{
      res.status(500).end();
    };
});
  
  app.get('/api/film/:id', isLoggedIn, async (req, res) => {
    try {
      const result = await dao.getFilm(req.params.id, req.user.id);
      if(result.error)
      //Film not Found
        res.status(404).json(result);
      else
        res.status(200).json(result);
    } catch(err) {
        //Internal server error
      res.status(500).end();
    }
  });

  app.get('/api/films/filter/all',isLoggedIn,async(req, res) => {
    try{
    const films= await dao.listFilms(req.user.id);
    res.status(200).json(films)
    }
      catch{
        res.status(500).end();
      };
  });

  app.get('/api/films/filter/favorite',isLoggedIn, async(req, res) => {
    try{
    const films= await dao.favoriteFilms(req.user.id);
    res.status(200).json(films)
    }
      catch{
        res.status(500).end();
      };
  });
  
  app.get('/api/films/filter/bestRated',isLoggedIn,async(req, res) => {
    try{
    const films= await dao.bestRatedFilms(req.user.id);
    res.status(200).json(films)
    }
      catch{
        res.status(500).end();
      };
  });
  
  app.get('/api/films/filter/seenLastMonth',isLoggedIn,async(req, res) => {
    try{
    const films= await dao.seenLastMonthFilms(req.user.id);
    res.status(200).json(films)
    }
      catch{
        res.status(500).end();
      };
  });
  
  app.get('/api/films/filter/unseen', isLoggedIn, async(req, res) => {
    try{
    const films= await dao.unseenFilms(req.user.id);
    res.status(200).json(films)
    }
      catch{
        res.status(500).end();
      };
  });

  app.post('/api/films',isLoggedIn, [
    
    check('title').notEmpty(),
    check('favorite').isInt({min: 0, max: 1}),
    check('watchdate').isDate({format: 'YYYY-MM-DD', strictMode: true}),
    check('rating').isInt({min: 0, max: 5}) 

  ], async (req, res) => {
    
    const film={
      title: req.body.title,
      favorite: req.body.favorite,
      watchdate: req.body.watchdate,
      rating: req.body.rating,
    };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
    }
    try {
        await dao.createFilm(film,req.user.id);
        res.status(201).end();
      } catch(err) {
        res.status(503).json({error: `Database error during the creation of film : ${film.title}.`});
      }
    }
    );


    app.put('/api/film/:id', isLoggedIn, [
      check('title').notEmpty(),
      check('favorite').isInt({min: 0, max: 1}),
      check('watchdate').isDate({format: 'YYYY-MM-DD', strictMode: true}),
      check('rating').isInt({min: 0, max: 5}) 
    ], async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
      }
      
      const film={
        id: req.params.id,
        title: req.body.title,
        favorite: req.body.favorite,
        watchdate: req.body.watchdate,
        rating: req.body.rating
      };

      try {
          await dao.updateFilm(film,req.user.id);
          res.status(200).end();
        } catch(err) {
          res.status(503).json({error: `Database error during the udate of film : ${film.title}.`});
        }
      });


      app.put('/api/film/:id/fav', isLoggedIn, [
        check('favorite').isInt({min: 0, max: 1}), 
      ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({errors: errors.array()});
        }
        
        const film={
          id: req.params.id,
          favorite: req.body.favorite,
        };
  
        try {
            await dao.updateFavFilm(film,req.user.id);
            res.status(200).end();
          } catch(err) {
            res.status(503).json({error: `Database error during changing favorite status of film : ${film.id}.`});
          }
        });

        app.delete('/api/film/:id', isLoggedIn, [], async (req, res) => {
          try {
            const result = await dao.deleteFilm(req.params.id,req.user.id);
            if(result)
              res.status(404).json(result);
            else 
              res.status(204).end();
            } 
            catch(err) {
              console.log(err);
              res.status(503).json({error: `Database error during deleting film : ${req.params.id}.`});
            }
          });


app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));


