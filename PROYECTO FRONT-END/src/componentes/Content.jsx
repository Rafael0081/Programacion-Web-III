import { Link } from "react-router-dom";
import p1 from "../imagenes/Batalla.png";
import c1 from "../imagenes/Coca2L.png";
import l1 from "../imagenes/LecheGloria.png";
import Banner from "./Banner";

function Content() {
  return (
    <>
      <section
        className="text-white d-flex align-items-center position-relative overflow-hidden"
        style={{
          minHeight: "550px",
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%), url('https://images.unsplash.com/photo-1512389142860-9c449e58a543')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-3">
            🎄 Bienvenido a <span className="text-warning">Tienda Fam</span>
          </h1>
          <p className="lead fs-3 mb-4">
            Calidad, confianza y los mejores precios.
          </p>
          <Link
            to="/productos"
            className="btn btn-warning btn-lg rounded-pill px-5 py-3 shadow-lg fw-bold"
            style={{
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🛒 Comprar Ahora
          </Link>
        </div>
      </section>

      <Banner />

      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-danger mb-3">
            🌟 Marcas Destacadas 🌟
          </h2>
          <div className="mx-auto" style={{ width: "80px", height: "4px", background: "#ffc107", borderRadius: "2px" }}></div>
          <p className="text-muted mt-3 fs-5">
            Las marcas que prefieren nuestras familias
          </p>
        </div>

        <div className="row g-4">
          {/* Nestlé */}
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden transition-all">
              <div className="card-body text-center p-5" style={{ background: "linear-gradient(135deg, #ff4b2b, #ff416c)" }}>
                <h2 className="text-white fw-bold mb-3" style={{ fontSize: "3rem" }}>NESTLÉ</h2>
                <p className="text-white-50 fs-5 mb-4">Calidad y sabor que inspiran.</p>
                <Link to="/productos" className="btn btn-light rounded-pill px-4 py-2 fw-bold shadow">
                  Ver Productos →
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden transition-all">
              <div className="card-body text-center p-5" style={{ background: "linear-gradient(135deg, #1e3c72, #2a5298)" }}>
                <h2 className="text-white fw-bold mb-3" style={{ fontSize: "3rem" }}>GLORIA</h2>
                <p className="text-white-50 fs-5 mb-4">Nutrición que te impulsa cada día.</p>
                <Link to="/productos" className="btn btn-light rounded-pill px-4 py-2 fw-bold shadow">
                  Ver Productos →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5" style={{ backgroundColor: "#f8f9fa", borderRadius: "30px" }}>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-danger mb-3">
            ✨ Productos Más Vendidos ✨
          </h2>
          <div className="mx-auto" style={{ width: "80px", height: "4px", background: "#ffc107", borderRadius: "2px" }}></div>
          <p className="text-muted mt-3 fs-5">
            Los favoritos de esta temporada
          </p>
        </div>

        <div className="row g-4">
          {/* Tarjeta 1 - Batalla */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden transition-all">
              <div className="position-relative">
                <img
                  src={p1}
                  className="card-img-top p-4"
                  style={{
                    height: "260px",
                    objectFit: "contain",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                  alt="Batalla"
                />
                <span className="position-absolute top-0 end-0 bg-warning text-dark fw-bold px-3 py-1 m-3 rounded-pill">
                  🔥 Popular
                </span>
              </div>
              <div className="card-body text-center">
                <h4 className="text-primary fw-bold">Categoría Panes</h4>
                <h3 className="text-danger mb-3">Batalla</h3>
                <p className="text-muted">
                  Pan tradicional de Bolivia, famoso por su bajo costo, masa crujiente libre de grasas (sin manteca), y por ser un alimento de consumo masivo.
                </p>
                <Link to="/productos" className="btn btn-outline-primary rounded-pill px-4">
                  Ver Producto →
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden transition-all">
              <div className="position-relative">
                <img
                  src={c1}
                  className="card-img-top p-4"
                  style={{
                    height: "260px",
                    objectFit: "contain",
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  }}
                  alt="Coca-Cola"
                />
                <span className="position-absolute top-0 end-0 bg-danger text-white fw-bold px-3 py-1 m-3 rounded-pill">
                  🥤 Bestseller
                </span>
              </div>
              <div className="card-body text-center">
                <h4 className="text-primary fw-bold">Categoría Gaseosas</h4>
                <h3 className="text-danger mb-3">Coca-Cola</h3>
                <p className="text-muted">
                  The Coca-Cola Company es la corporación multinacional estadounidense líder en la fabricación y distribución de bebidas más reconocidas del mundo.
                </p>
                <Link to="/productos" className="btn btn-outline-primary rounded-pill px-4">
                  Ver Producto →
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden transition-all">
              <div className="position-relative">
                <img
                  src={l1}
                  className="card-img-top p-4"
                  style={{
                    height: "260px",
                    objectFit: "contain",
                    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  }}
                  alt="Leche Gloria"
                />
                <span className="position-absolute top-0 end-0 bg-info text-white fw-bold px-3 py-1 m-3 rounded-pill">
                  🥛 Nutritiva
                </span>
              </div>
              <div className="card-body text-center">
                <h4 className="text-primary fw-bold">Categoría Lácteos</h4>
                <h3 className="text-danger mb-3">Leche Evaporada Gloria</h3>
                <p className="text-muted">
                  La leche evaporada Gloria es un producto lácteo obtenido mediante la evaporación parcial del agua de la leche fresca, conservando todo su sabor.
                </p>
                <Link to="/productos" className="btn btn-outline-primary rounded-pill px-4">
                  Ver Producto →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .transition-all {
          transition: all 0.3s ease-in-out;
        }
        .transition-all:hover {
          transform: translateY(-10px);
        }
      `}</style>
    </>
  );
}

export default Content;