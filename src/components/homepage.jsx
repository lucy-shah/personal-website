import { Link } from "react-router-dom";
function homepage(){
    return ( 
        <div>
            <h1> Hi, I'm Lucy</h1>
            <p> Welcome to my website</p>
            <Link to="/main">
                <p> click here to begin</p>
            </Link>
        </div>
    )
}
export default homepage