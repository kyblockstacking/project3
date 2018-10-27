import React from "react";
import { Link } from "react-router-dom";

let style = {
    navBar: {
        marginBottom: "1em"
    },
    homeButton: {
        color: "yellow"
    }
}

class Navbar extends React.Component {

    state = {};

    render() {
        return (
            <nav style={style.navBar} className="navbar navbar-expand-lg navbar-light bg-primary">
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <Link style={style.homeButton} className="homeButton" to={"/"}>CFB Home</Link>
                        <li className="nav-item dropdown">
                            <div className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                List of Forums
                            </div>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <Link className="dropdown-item" to={"/forum/Javascript"}>Javascript Forum</Link>
                                <Link className="dropdown-item" to={"/forum/PHP"}>PHP Forum</Link>
                                <Link className="dropdown-item" to={"/forum/Python"}>Python Forum</Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    };
};

export default Navbar;