import { React, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyBigLab2.css";
import { Button ,Form, Alert,Spinner } from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const { validate } = require('email-validator');

function Login(props){    
  // eslint-disable-next-line
  const [username,setUsername]=useState('john.doe@polito.it');
  const [password, setPassword] = useState("password");
  const [errorMsg, setErrorMsg] = useState(""); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async(event) => {
    event.preventDefault();

    const credentials={username: username,password: password};

    if(username.length===0 || password.length===0){
      setErrorMsg("Riempi entrambi i campi!");
    }
    else if(!validate(username)){
      setErrorMsg('Inserire una mail valida')
    }
    else {
      setLoading(true);
      await props.login(credentials);
      setLoading(false);
      
      navigate("/All");
    }
  };

    return(
      <>
      <div className="bgimage">

      <div className="put-down">
      <div className="bg-secondary opacity-80 p-2 bg-opacity-50 bordi-rounded col-xl-3 rightForm">
        
      <h1 className="filter mt-3 formtext text-light text-opacity-75">Welcome!</h1>
      {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
      {props.appError ? <Alert variant='danger' onClose={() => props.removeError()} dismissible>{props.appError}</Alert> : false}
       <h1>{props.appError}</h1>
        <Form className="mx-auto">
          <Form.Group className="col-lg-7 formtext centerForm">
            <Form.Control
              className="text-center round-login"
              placeholder="Email"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mt-4 col-lg-7 formtext centerForm">
            <Form.Control
              className="text-center round-login"
              placeholder="Password"
              type="Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </Form.Group>
          
        </Form>
        <div className="mt-4 formtext ">
        {loading ? <Spinner animation="border" style={{ width: '2rem', height: '2rem',color:'white' }}/> : false }
          </div>
          
        <div className="mt-4 formtext ">
          <Button variant="outline-light" className="me-2 round-login" onClick={handleSubmit}  size="lg">
            Login
          </Button>
        </div>
      </div>
      </div>
      </div>
      </>
    )
}
export default Login;