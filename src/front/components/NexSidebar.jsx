import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const SidebarMenu = ({ setActiveOption }) => {
const location = useLocation();
const navigate = useNavigate();

const navItems = [
{ name: "Inicio", path: "/PropietarioIndex", icon: "gauge-high", internalOption: null },
{ name: "Viviendas", path: "/Viviendas", icon: "house-chimney", internalOption: "viviendas" },
{ name: "Contratos", path: "/Contrato", icon: "file-signature", internalOption: "contrato" },
{ name: "Inquilinos", path: "/Inquilinos", icon: "people-roof", internalOption: "inquilinos" },
{ name: "Incidencias", path: "/Incidencias", icon: "triangle-exclamation", internalOption: "incidencias" },
{ name: "Perfil", path: "/Perfil", icon: "user", internalOption: "perfil" },
{ name: "Salir", path: "/acceso", icon: "right-from-bracket", internalOption: "salir" },
];

return (
<div
className="sidebar-private d-flex flex-column"
style={{
width: '250px',
minHeight: '100vh',
backgroundColor: 'rgba(138, 223, 251, 0.8)',
padding: '1.5rem 1rem',
boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
position: 'fixed',
top: 0,
left: 0,
zIndex: 1000,
overflowY: 'auto',
paddingTop: 'calc(1.5rem + 70px)',
}}
>
<div className="sidebar-header text-center mb-4">
<img
src="src/front/assets/img/LogoTrabajoFinal.png"
alt="Logo"
style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
className="mb-2"
/>
<h5 className="text-white fw-bold mb-0">Panel de Propietario</h5>
<small className="text-white-50">Gestion Inmuebles</small>
</div>

<ul className="nav flex-column flex-grow-1">
{navItems.map((item) => (
<li className="nav-item mb-2" key={item.name}>
<Link
to={item.path}
className={`nav-link d-flex align-items-center rounded py-2 px-3
${location.pathname === item.path ? 'active-sidebar-link' : 'text-white'}`}
onClick={(e) => {
if (item.path === location.pathname && item.path !== "/acceso") {
e.preventDefault();
}

setActiveOption(item.internalOption);

if (item.path !== location.pathname || item.name === "Salir") {
navigate(item.path);
}

if (item.name === "Salir") {
localStorage.removeItem("jwt-token");
}
}}
style={{
transition: 'background-color 0.2s, color 0.2s',
fontSize: '1.1rem',
'--bs-link-color-rgb': '255, 255, 255',
'--bs-link-hover-color-rgb': '255, 255, 255',
backgroundColor: 'transparent',
}}
>
<FontAwesomeIcon icon={item.icon} className="me-3" style={{ width: '20px' }} />
{item.name}
</Link>
</li>
))}
</ul>
</div>
);
};

export default SidebarMenu;