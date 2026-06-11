import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="text-white pt-5 pb-4 mt-5"
      style={{
        background: "#111827"
      }}
    >
      <div className="container">

        <div className="row">

          <div className="col-lg-4 mb-4">

            <h4 className="fw-bold mb-3">
              🏪 Tienda Fam
            </h4>

            <p className="text-light">
              Tu tienda de confianza con la mejor
              variedad de productos. Calidad,
              buenos precios y excelente servicio
              para toda la familia.
            </p>

          </div>

          <div className="col-lg-4 mb-4">

            <h5 className="fw-bold mb-3">
              Enlaces Rápidos
            </h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                <Link
                  to="/"
                  className="text-light text-decoration-none"
                >
                  🏠 Inicio
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/productos"
                  className="text-light text-decoration-none"
                >
                  📦 Inventario
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/contactenos"
                  className="text-light text-decoration-none"
                >
                  📞 Contáctenos
                </Link>
              </li>

            </ul>

          </div>

          <div className="col-lg-4 mb-4">

            <h5 className="fw-bold mb-3">
              Contacto
            </h5>

            <p>
              📍 El Alto, La Paz - Bolivia
            </p>

            <p>
              📱 +591 71901889
            </p>

            <p>
              ✉️ info@tiendafam.com
            </p>

          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center">

          <small className="text-light">
            © {new Date().getFullYear()} Tienda Fam.
            Todos los derechos reservados.
          </small>

        </div>

      </div>
    </footer>
  );
}

export default Footer;