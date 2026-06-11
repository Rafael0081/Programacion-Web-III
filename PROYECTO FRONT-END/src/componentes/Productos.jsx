import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import autoTable from "jspdf-autotable";
import axios from "axios";
import jsPDF from "jspdf";

import a1 from "../imagenes/Coca3L.png";
import c3 from "../imagenes/GArroz50g.png";
import a2 from "../imagenes/Coca2L.png";
import b1 from "../imagenes/HUARI620ML.png";
import l1 from "../imagenes/LechePIL900mls.png";
import l2 from "../imagenes/LecheGloria.png";
import p1 from "../imagenes/Batalla.png";
import g1 from "../imagenes/Cheetos.png";
import p2 from "../imagenes/PE.png";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [cantidades, setCantidades] = useState({});

  const rolUsuario = localStorage.getItem("rolUsuario");
  const idUsuario = localStorage.getItem("idUsuario");
  const keyCarrito = `carritoFam_${idUsuario}`;

  const cambiarCantidad = (id, operacion, stockMaximo) => {
    setCantidades((prev) => {
      const actual = prev[id] || 1;
      let nueva = operacion === "sumar" ? actual + 1 : actual - 1;

      if (nueva < 1) nueva = 1;
      if (nueva > stockMaximo) nueva = stockMaximo;

      return { ...prev, [id]: nueva };
    });
  };

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await axios.get("http://localhost:3000/api/productos");
        setProductos(respuesta.data);
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
        console.error(err);
      }
    };

    obtenerProductos();
  }, []);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Inventario - Tienda Fam", 14, 20);

    const columnas = ["ID", "Producto", "Stock", "P. Compra", "P. Venta"];

    const filas = productos.map((prod) => [
      prod.id_producto,
      prod.nombre_producto,
      prod.stock,
      `Bs. ${prod.precio_compra}`,
      `Bs. ${prod.precio_venta}`,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [columnas],
      body: filas,
      theme: "grid",
      headStyles: { fillColor: [206, 18, 18] },
    });

    doc.save("Reporte_Inventario_Fam.pdf");
  };

  const agregarAlCarrito = (productoElegido) => {
    if (productoElegido.stock <= 0) {
      alert("🚫 Producto agotado");
      return;
    }

    const cantidadElegida = cantidades[productoElegido.id_producto] || 1;

    let carritoActual = JSON.parse(localStorage.getItem(keyCarrito)) || [];

    const productoExistente = carritoActual.find(
      (item) => item.id_producto === productoElegido.id_producto
    );

    const cantidadYaEnCarrito = productoExistente
      ? productoExistente.cantidad
      : 0;

    if (cantidadYaEnCarrito + cantidadElegida > productoElegido.stock) {
      alert("⚠️ No puedes superar el stock disponible");
      return;
    }

    if (productoExistente) {
      productoExistente.cantidad += cantidadElegida;
    } else {
      carritoActual.push({ ...productoElegido, cantidad: cantidadElegida });
    }

    localStorage.setItem(keyCarrito, JSON.stringify(carritoActual));

    window.dispatchEvent(new Event("carritoActualizado"));

    alert(
      `✅ Agregaste ${cantidadElegida} unidad(es) de "${productoElegido.nombre_producto}"`
    );

    setCantidades((prev) => ({ ...prev, [productoElegido.id_producto]: 1 }));
  };

  // IMÁGENES
  const obtenerImagenProducto = (nombreProducto) => {
    const nombre = nombreProducto.toLowerCase();

    if (nombre.includes("coca cola 2l") || nombre.includes("coca-cola 2l")) return a1;
    if (nombre.includes("coca cola 3l") || nombre.includes("coca-cola 3l")) return a2;
    if (nombre.includes("grageas de arroz")) return c3;
    if (nombre.includes("huari 620ml")) return b1;
    if (nombre.includes("leche gloria")) return l2;
    if (nombre.includes("leche")) return l1;
    if (nombre.includes("batalla")) return p1;
    if (nombre.includes("cheetos")) return g1;
    if (nombre.includes("pe")) return p2;
    

    return "https://cdn-icons-png.flaticon.com/512/1174/1174305.png";
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="text-danger fw-bold m-0">Nuestro Inventario</h2>

        {rolUsuario === "Administrador" && (
          <div className="d-flex gap-2">
            <Link to="/nuevo-producto" className="btn btn-success">
              ➕ Nuevo Producto
            </Link>
            <button className="btn btn-danger" onClick={generarPDF}>
              📄 PDF
            </button>
          </div>
        )}
      </div>

      {/* LISTA */}
      <div className="row g-4">
        {productos.length > 0 ? (
          productos.map((prod) => (
            <div key={prod.id_producto} className="col-lg-3 col-md-4 col-sm-6">

              <div className="card shadow-sm h-100">

                <img
                  src={obtenerImagenProducto(prod.nombre_producto)}
                  className="card-img-top"
                  alt={prod.nombre_producto}
                  style={{
                    height: "220px",
                    objectFit: "contain",
                    background: "#f8fafc",
                    padding: "20px",
                  }}
                />

                <div className="card-body text-center d-flex flex-column">

                  <h5>{prod.nombre_producto}</h5>

                  <h4 className="text-success">
                    Bs. {prod.precio_venta}
                  </h4>

                  <span className={`badge ${
                    prod.stock > 10
                      ? "bg-success"
                      : prod.stock > 0
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}>
                    Stock: {prod.stock}
                  </span>

                  {/* CANTIDAD */}
                  <div className="d-flex justify-content-center align-items-center my-3">

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        cambiarCantidad(prod.id_producto, "restar", prod.stock)
                      }
                      disabled={prod.stock <= 0}
                    >
                      -
                    </button>

                    <span className="mx-3 fw-bold">
                      {cantidades[prod.id_producto] || 1}
                    </span>

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        cambiarCantidad(prod.id_producto, "sumar", prod.stock)
                      }
                      disabled={prod.stock <= 0}
                    >
                      +
                    </button>
                  </div>

                  {/* BOTÓN */}
                  <button
                    className={`btn w-100 ${
                      prod.stock <= 0 ? "btn-secondary" : "btn-primary"
                    }`}
                    disabled={prod.stock <= 0}
                    onClick={() => agregarAlCarrito(prod)}
                  >
                    {prod.stock <= 0 ? "Agotado" : "Agregar al carrito"}
                  </button>

                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <h5>Cargando productos...</h5>
          </div>
        )}
      </div>

    </div>
  );
}

export default Productos;