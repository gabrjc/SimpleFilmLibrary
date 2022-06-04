import { React,useEffect } from "react";
import MyNavbar from "./MyNavbar.js";
import MySideMenu from "./MySideMenu.js";
import MyFilmTable from "./MyFilmTable.js";
import "./MyBigLab1.css";
import { useNavigate,useParams} from "react-router-dom";
// eslint-disable-next-line 
import Loader from "./Loader.js";

const allowed=["All","Favorites","BestRated","SeenLastMonth","Unseen"];

function HomePage(props) {
  
  const setFilter=props.setFilter;
  const navigate= useNavigate();

  let { FilterUrl } = useParams();
  
  useEffect(()=>{
  if(!allowed.includes(FilterUrl)) navigate('/errorPage', { replace: true });
  setFilter(FilterUrl);
  // eslint-disable-next-line 
  },[FilterUrl])



  return (
    <div className="FilmLibrary">
      <div></div>
      <MyNavbar />
      <div className="container-fluid ">
        <div className="row vheight-100">
          <MySideMenu displayFilter={FilterUrl} 
                setWaiting={props.setWaiting}/>
{props.waiting ? <Loader/>: 
          <MyFilmTable
            filmStart={props.filmStart}
            displayFilter={FilterUrl}
            deleteFilm={props.deleteFilm}
            addFilm={props.addFilm}
            changeFav={props.changeFav}
            changeStars={props.changeStars}
            utente={props.utente}
            logout={props.logout}
          />}
        </div>
      </div>
    </div>
  );
}


export default HomePage;
