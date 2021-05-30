import {useState} from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

export default function Main(){

    const [isAuth, setIsAuth] = useState(true);

    return (

        <div>
            <div className={`d-flex `} id="wrapper">
                {isAuth && <SideBar />}
                <div id="page-content-wrapper">
                    {isAuth && <NavBar />}
                    <div id="content" style={{ padding: isAuth? "2rem": '0rem' }}>
                    </div>
                </div>
            </div>
        </div>
    );
}