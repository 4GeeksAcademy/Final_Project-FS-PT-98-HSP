import { Outlet } from "react-router-dom";
import NavbarPrivate from "../components/NavbarPrivate";
import Navbar from "../components/Navbar";
import NavbarSecondary from "../components/NavbarSecondary";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

export const Layout = () => {
    const location = useLocation();
    const path = location.pathname;

    const privateRoutes = ["/admin", "/Contrato", "/Viviendas", "/Inquilinos", "/Incidencias", "/propietarioindex"];
    const secondaryRoutes = ["/inquilinoindex"];
    const publicRoutes = ["/contact", "/acceso", "/servicios"];

    const showPrivateNavbar = privateRoutes.some(route => path.startsWith(route));
    const showSecondaryNavbar = secondaryRoutes.some(route => path.startsWith(route));
    const showPublicNavbar = !showPrivateNavbar && !showSecondaryNavbar && publicRoutes.every(route => !path.startsWith(route));

    return (
        <ScrollToTop>
            {showPublicNavbar && <Navbar />}
            
            {showSecondaryNavbar && <NavbarSecondary />}
            <Outlet />
            <Footer />
        </ScrollToTop>
    );
};
