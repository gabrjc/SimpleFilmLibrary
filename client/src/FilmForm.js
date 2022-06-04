import { React, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import Film from "./film.js";

function FilmFormMaker(props) {
  let [searchParams] = useSearchParams();
  let navigate= useNavigate();
  const Action = searchParams.get("Id");
  let msg = "";
  let type = 0;
  let filmToEdit = undefined;
  if (Action === "New") {
    msg = "New Film";
  } else {
    type = 1;
    filmToEdit = props.getFilm(Action)[0];
    if(filmToEdit===undefined){return setTimeout(() => {navigate('/errorPage', { replace: true })}, 0)}
    msg = 'Editing "' + filmToEdit.Title + '"';
  }
  return (
    <FilmForm
      addFilm={props.addFilm}
      msg={msg}
      type={type}
      obj={filmToEdit}
      updateFilm={props.updateFilm}
    />
  );
}

function FilmForm(props) {

  // eslint-disable-next-line
  const [Id,setId]=useState(props.type? props.obj.Id:0);
  const [title, setTitle] = useState(props.type ? props.obj.Title : "");
  const [date, setDate] = useState(
    props.type ? dayjs(props.obj.Watch_date) : dayjs(null));
  const [fav, setFav] = useState(props.type ? props.obj.Favorite : false);
  const [stars, setStars] = useState(props.type ? props.obj.Score : 0);
                          if(stars==null){setStars(0);}
  const [errorMsg, setErrorMsg] = useState(""); 

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if(title.length===0){
      setErrorMsg("Errore titolo: il campo non può essere vuoto!");
    }
    else {
      let wd = date;
      if (!date.isValid()) wd = dayjs("1970-01-01");
      const newFilm = new Film(Id, title, fav, wd, stars);
      props.type
        ? props.updateFilm(newFilm)
        : props.addFilm(newFilm);

      navigate("/All");
    }
  };

  const handleStars = (event) => {
    const val = event.target.value;
    if (val < 0 || val > 5) setStars(0);
    else setStars(parseInt(val));
  };

  return (
    <>
      <h1 className="filter mt-3 formtext">{props.msg}</h1>

      {errorMsg ? (
        <Alert
          variant="danger"
          className="bordi-rounded col-md-8 formtext centerForm"
          onClose={() => setErrorMsg("")}
          dismissible
        >
          {errorMsg}
        </Alert>
      ) : (
        <></>
      )}
      <div className="bg-primary p-2 bg-opacity-25 mt-4 bordi-rounded col-md-8 formtext centerForm">
        <Form className="mx-auto ">
          <Form.Group className="col-md-6 formtext centerForm">
            <Form.Label className="formtext">Title</Form.Label>
            <Form.Control
              className="text-center"
              placeholder="Insert Title"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mt-4 col-md-6 formtext centerForm">
            <Form.Label className="formtext">WatchDate</Form.Label>
            <Form.Control
              className="text-center"
              type="date"
              value={props.type ? date.format("YYYY-MM-DD") : date.format("YYYY-MM-DD")}
              onChange={(ev) => setDate(dayjs(ev.target.value))}
            />
          </Form.Group>

          <Form.Group className="mt-4 col-md-6 formtext centerForm">
            <Form.Label className="formtext">Stars</Form.Label>
            <Form.Control
              className="text-center"
              type="number"
              min={0}
              max={5}
              value={stars}
              onChange={(ev) => handleStars(ev)}
            />
          </Form.Group>

          <Form.Group className="mt-4 col-md-6 formtext centerForm">
            <Form.Label>Favorite</Form.Label>
            <Form.Check
              size="lg"
              type="switch"
              checked={fav}
              onChange={(ev) => setFav(!fav)}
            />
          </Form.Group>
        </Form>
        <div className="mt-5 formtext">
          <Button onClick={handleSubmit} className="me-2" size="lg">
            Save
          </Button>
          <Button onClick={() => navigate("/All")} className="ms-2" size="lg">
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}

export default FilmFormMaker;
