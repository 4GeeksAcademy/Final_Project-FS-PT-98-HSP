import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const history = useNavigate();
  const handleNavigatePropietarioIndex = () => history("/propietarioindex");
  const handleNavigateAcceso=()=>history("/acceso")
  const accessToPropietarioIndex=()=>{
    
    if (store.token.length>0){
        handleNavigatePropietarioIndex()
    }else {handleNavigateAcceso()}
  }


    return (
        <nav
            className="navbar navbar-expand-lg sticky-top shadow"
            data-bs-theme="dark"
            style={{
                backgroundColor: "rgba(138, 223, 251, 0.8)",
                boxShadow: "0 3px 25px rgba(0, 0, 0, 0.3)",
                borderRadius: "13px",
            }}
        >
            <div className="container-fluid">
                <Link to="/" className="navbar-brand ms-3">
                    <img
                        src="src/front/assets/img/LogoTrabajoFinal.png"
                        alt="Logo"
                        style={{ width: "70px", height: "70px" }}
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex gap-2 me-3">
                        <li className="nav-item">
                            <Link to="/" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>
                                Inicio
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Contact" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>
                                Contacto
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Servicios" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>
                                Servicios
                            </Link>
                        </li>
                        <li className="nav-item">
                           <button className="btn btn-light btn-sm w-100 me-5" style={{ minWidth: "120px" }} onClick={accessToPropietarioIndex}>Acceso</button>
                        
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
