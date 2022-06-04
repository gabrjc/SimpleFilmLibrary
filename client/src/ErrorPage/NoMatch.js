import {Button} from "react-bootstrap";
import "./error.css";
import { useNavigate } from "react-router-dom";


function NoMatch(){
    
  const navigate= useNavigate();
    return(
        <div className="bg vheight-100">
        <div className="text-center bottoncino">
        <Button variant="danger" size="lg" onClick={()=>navigate(`/All`)}>Torna alla Homepage
        </Button>
        </div>
        </div>)
}
export default NoMatch;