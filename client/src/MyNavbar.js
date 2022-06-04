import { React } from "react";
import { InputGroup } from "react-bootstrap";
import { Navbar, FormControl} from "react-bootstrap";

function MyNavbar() {

    return  <Navbar variant="dark" bg="primary" fixed="top" className="padding">
            <MyLogo/>
            <h2 className="text-light italic"> Film library</h2>
            <Search/>
            <Profile/>
            </Navbar>;
    }

function MyLogo(){
    return  (<>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-film m-2" viewBox="0 0 16 16">
            <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
            </svg>
            </>
    )
}

function Search(){
    return  <div className="mx-auto">   
            <InputGroup>
            <FormControl className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
            <InputGroup.Text id="searchIcon" className="mousepoint"><SearchIcon/></InputGroup.Text>
            </InputGroup>
            </div>

}

function Profile(){
    
    return <div className="navbar-nav me-3">
            <a className="nav-item nav-link" href="/errorPage" >
            <svg className="bi bi-people-circle" width="30" height="30" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z"/>
            <path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z" clipRule="evenodd"/>
            </svg>
            </a>
            </div>
}

function SearchIcon(){
    return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>)
}

export default MyNavbar;