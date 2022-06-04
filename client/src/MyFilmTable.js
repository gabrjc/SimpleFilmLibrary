import { React, useState } from "react";
import { Table, Button, Form,Card,Container,Row,Col,Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./MyBigLab1.css";

const dayjs=require('dayjs');

const namefilter = {
  All: "All",
  undefined: "All",
  Favorites: "Favorites",
  BestRated: "Best rated",
  SeenLastMonth: "Seen last month",
  Unseen: "Unseen",
};
/**
      <h1 className="filter">{namefilter[props.displayFilter]}</h1> */

function MyFilmTable(props) {
  const navigate = useNavigate();
  function handlelogout(){
    props.logout();
  }

  return (
    <main className="col-9 mt-2 below-nav">
      
    
    <Container>
    <Row>
    <Col xs="auto">
    <h4 className="filter grey" >Welcome, {props.utente.name}</h4>
    </Col>
    <Col xs="auto" className="mt2">
    <Button type="button" className="btn btn-secondary" onClick={handlelogout}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a11.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
</svg>     
</Button>
</Col>
</Row>
  </Container>   
    
    <Card>
  <Card.Header className="filter">{namefilter[props.displayFilter]}</Card.Header>
  </Card>
      <MakeTable
        filmStart={props.filmStart}
        displayFilter={props.displayFilter}
        deleteFilm={props.deleteFilm}
        changeFav={props.changeFav}
        changeStars={props.changeStars}
      ></MakeTable>

      <Button
        onClick={() => {
          navigate("/editFilm?Id=New");
        }}
        type="button"
        variant="primary"
        className="btn btn-lg fixed-right-bottom"
      >
        &#43;
      </Button>
    </main>
  );
}

function MakeTable(props) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th scope="col">
            <Pencil></Pencil>
          </th>
          <th scope="col">Title</th>
          <th scope="col">Favorite</th>
          <th scope="col">Watchdate</th>
          <th scope="col">Stars</th>
        </tr>
      </thead>
      <RiempiTabella
        filmStart={props.filmStart}
        displayFilter={props.displayFilter}
        deleteFilm={props.deleteFilm}
        changeFav={props.changeFav}
        changeStars={props.changeStars}
      />
    </Table>
  );
}

function RiempiTabella(props) {
  return (
    <tbody>
      {props.filmStart.map((f) => (
        <FilmRow
          key={f.Id}
          Film={f}
          deleteFilm={props.deleteFilm}
          changeFav={props.changeFav}
          changeStars={props.changeStars}
        />
      ))}
    </tbody>
  );
}

function FilmRow(props) {
let myStatus=null;

switch(props.Film.status) {
  case 'added':
    myStatus = 'table-success';
    break;
  case 'deleted':
    myStatus= 'table-danger';
    break;
  case 'updated':
    myStatus = 'table-warning';
    break;
  default:
    break;
}


  return (
    <tr className={myStatus}>
      <Operation Id={props.Film.Id} deleteFilm={props.deleteFilm} />
      <FilmData
        Film={props.Film}
        changeFav={props.changeFav}
        changeStars={props.changeStars}
      />
    </tr>
  );
}

function FilmData(props) {
  return (
    <>
      <td className={props.Film.Favorite ? "text-danger" : "text-dark"}
        >  {props.Film.Title}
        
      </td>
      <MakeCheckBox
        myfilm={props.Film}
        fav={props.Film.Favorite}
        changeFav={props.changeFav}
        Id={props.Film.Id}
      />
      <MakeDate data={props.Film.Watch_date} />
      <MakeStars
        myfilm={props.Film}
        score={props.Film.Score}
        Id={props.Film.Id}
        changeStars={props.changeStars}
      />
    </>
  );
}
function MakeCheckBox(props) {
  return (
    <td>
      <Form>
        <Form.Check
          type="checkbox"
          label="favorite"
          checked={props.fav}
          onChange={() => {
            props.changeFav(props.myfilm);
          }}
        ></Form.Check>
      </Form>
    </td>
  );
}

function MakeDate(props) {
  const [data, setData] = useState(dayjs(props.data).format('DD/MM/YYYY'));

  if (data === "Invalid Date" || data===dayjs("1970-01-01").format('DD/MM/YYYY')) {
    setData("Unseen");
  }

  function showRight() {
    return <td>{data}</td>;
  }

  return showRight();
}
function MakeStars(props) {
  const [yellow, setYellow] = useState(-1);
  function stars(s) {
    const size = 5;
    const concat = [];
    // eslint-disable-next-line
    if (s == undefined) s = 0;
    
    console.log(s);
    for (let i = 0; i < size; i++) {

        if (i < s){
            if(i<=yellow){
        concat.push(
        <i className="bi bi-star-fill mousepoint text-warning" key={i}      
        onClick={() => { props.changeStars(props.myfilm, i + 1); }}
        onMouseEnter={() => {setYellow(i);}}
        onMouseLeave={() => {setYellow(-1);}}></i>
        );
                        }
          else{
          concat.push(
          <i className="bi bi-star-fill mousepoint " key={i}       
          onClick={() => { props.changeStars(props.myfilm, i + 1); }}
          onMouseEnter={() => {setYellow(i);}}
          onMouseLeave={() => {setYellow(-1);}}></i>
          )
        }
      }
        else{
          
          if(i<=yellow){
          concat.push(
            <i className="bi bi-star mousepoint text-warning" style={{color:yellow}} key={i}        
            onClick={() => { props.changeStars(props.myfilm, i + 1); }}
            onMouseEnter={() => {setYellow(i);}}
            onMouseLeave={() => {setYellow(-1);}}></i>
          );}
          else{
          concat.push(
            <i className="bi bi-star mousepoint" key={i}        
            onClick={() => { props.changeStars(props.myfilm,i + 1); }}
            onMouseEnter={() => {setYellow(i);}}
            onMouseLeave={() => {setYellow(-1);}}></i>
          );
          }
          }
        }
      console.log(concat);
      return concat;
  }
    return <td>{stars(props.score)}</td>; 
}
function Pencil() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fillRule="currentColor"
      className="bi bi-pencil-fill"
      viewBox="0 0 16 16"
    >
      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
    </svg>
  );
}

function Operation(props) {
  const navigate = useNavigate();
  return (
    <td>
      <>
        <svg
          onClick={() => props.deleteFilm(props.Id)}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fillRule="currentColor"
          className="bi bi-trash mousepoint"
          viewBox="0 0 16 16"
        >
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
          <path
            fillRule="evenodd"
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
          />
        </svg>
      </>
      <>
        <svg
          onClick={() => navigate("/editFilm?Id=" + props.Id)}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fillRule="currentColor"
          className="bi bi-pencil-square mousepoint"
          viewBox="0 0 16 16"
        >
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
          <path
            fillRule="evenodd"
            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
          />
        </svg>
      </>
    </td>
  );
}

export default MyFilmTable;
