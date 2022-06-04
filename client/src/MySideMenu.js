import { React} from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MySideMenu(props) {
  const navigate= useNavigate();

  return (
    <aside className="col-3 bg-light below-nav ">
      <ListGroup className="mt-3 mousepoint">
        <ListGroup.Item
          onClick={() => {
            
            if(props.displayFilter !== "All" && props.displayFilter !== undefined ) props.setWaiting(true); 
            navigate(`/All`);
          }}
          active={props.displayFilter === "All" || props.displayFilter === undefined }
        >
          All
        </ListGroup.Item>
        <ListGroup.Item
          onClick={() => {
            
            if(props.displayFilter !== "Favorites") props.setWaiting(true);
            navigate(`/Favorites`);
          }}
          active={props.displayFilter === "Favorites" }
        >
          Favorites
        </ListGroup.Item>
        <ListGroup.Item
          onClick={() => {
            
            if(props.displayFilter !== "BestRated") props.setWaiting(true);
            navigate(`/BestRated`);
          }}
          active={props.displayFilter === "BestRated" }
        >
          Best rated
        </ListGroup.Item>
        <ListGroup.Item
          onClick={() => {
            
            if(props.displayFilter !== "SeenLastMonth") props.setWaiting(true);
            
            navigate(`/SeenLastMonth`);
          }}
          active={props.displayFilter === "SeenLastMonth" }
        >
          Seen last month
        </ListGroup.Item>
        <ListGroup.Item
          onClick={() => {
            if(props.displayFilter !== "Unseen") props.setWaiting(true);
          navigate(`/Unseen`);
          }}
          active={props.displayFilter === "Unseen" }
        >
          Unseen
        </ListGroup.Item>
      </ListGroup>
    </aside>
  );
}

export default MySideMenu;
