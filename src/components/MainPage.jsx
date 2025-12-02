import { Link} from "react-router-dom";

function MainPage(){
    return (
        <div>
            <h1> Main Page</h1>
            <p> Cool stuff here!</p>
            <Link to = "/"> 
                <button> Back to home!</button>
            </Link>
        </div>
    )
}

export default MainPage