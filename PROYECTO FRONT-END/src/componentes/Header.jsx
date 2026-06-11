import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios"; // ← AGREGA ESTA IMPORTACIÓN
import A from "../imagenes/LogoTienda.png";

export default function Header() {
  const navigate = useNavigate();
  const rolUsuario = localStorage.getItem("rolUsuario");
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  // Función para cerrar sesión 
  const cerrarSesion = async () => {  // ← AGREGA "async"
    const idUsuario = localStorage.getItem("idUsuario");
    
    // Registrar el evento de salida en el backend
    try {
      await axios.post('http://localhost:3000/api/logout', { 
        id_usuario: idUsuario 
      });
    } catch (error) {
      console.error("Error al registrar salida:", error);
    }
    localStorage.removeItem('rolUsuario');
    localStorage.removeItem('idUsuario');

    window.dispatchEvent(new Event('carritoActualizado'));
    
    navigate('/login');
  };

  const actualizarContador = () => {
    const idUsuario = localStorage.getItem("idUsuario"); 
    if (!idUsuario) {
      setCantidadCarrito(0);
      return;
    }
    const carrito = JSON.parse(localStorage.getItem(`carritoFam_${idUsuario}`)) || [];
    const total = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    
    setCantidadCarrito(total);
  };

  useEffect(() => {
    actualizarContador();
    window.addEventListener("carritoActualizado", actualizarContador);
    return () =>
      window.removeEventListener("carritoActualizado", actualizarContador);
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-lg py-3"
      style={{
        background: "linear-gradient(90deg,#1e3a8a,#2563eb)",
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold text-white d-flex align-items-center"
          to="/"
        >
          <img
            src={A}
            alt="Logo de Tienda Fam"
            width="120"
            height="60"
            className="me-3"
          />

          <div>
            <div className="fs-3 fw-bold">Tienda Fam</div>

            <small className="text-light">Tu tienda de confianza</small>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/">
                Inicio
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/productos">
                Inventario
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/acercade">
                Acerca de
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/contactenos">
                Contacto
              </Link>
            </li>

            {rolUsuario ? (
              <li className="nav-item ms-lg-4 mt-2 mt-lg-0 d-flex align-items-center gap-3">
                {rolUsuario === "Administrador" ? (
                  <>
                    <Link
                      to="/gestion-pedidos"
                      className="btn btn-secondary rounded-pill px-3 fw-bold shadow-sm"
                    >
                      🚚 Proveedores
                    </Link>
                    <Link
                      to="/historial"
                      className="btn btn-info rounded-pill px-3 fw-bold shadow-sm"
                    >
                      📋 Historial
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/carrito"
                    className="btn btn-warning rounded-pill px-3 fw-bold shadow-sm position-relative"
                  >
                    🛒 Mi Carrito
                    {cantidadCarrito > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cantidadCarrito}
                      </span>
                    )}
                  </Link>
                )}

                <span className="text-white fw-bold">👤 {rolUsuario}</span>

                <button
                  onClick={cerrarSesion}
                  className="btn btn-danger rounded-pill px-4"
                >
                  Salir
                </button>
              </li>
            ) : (
              <li className="nav-item ms-lg-4">
                <Link
                  className="btn btn-outline-light rounded-pill px-4"
                  to="/login"
                >
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}