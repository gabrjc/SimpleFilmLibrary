
import { Spinner} from "react-bootstrap";

import "./MyBigLab1.css";

function Loader(){
return(
<main className="col-sm-9 mt-2 below-nav">
<div className='text-center mt-5'>
<Spinner animation="border mt-5" style={{ width: '10rem', height: '10rem',color:'grey' }} /> 
</div>
</main>)}

export default Loader;