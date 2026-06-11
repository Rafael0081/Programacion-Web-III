import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function GestionPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const rolUsuario = localStorage.getItem("rolUsuario");

  if (rolUsuario !== "Administrador") {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold">🚫 Acceso Denegado</h2>
        <p>Solo el Administrador puede gestionar los pedidos a proveedores.</p>
        <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
      </div>
    );
  }

  const cargarPedidos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pedidos");
      setPedidos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const marcarLlegada = async (idPedido) => {
    if(!window.confirm("¿Confirmas que el camión ya llegó y deseas sumar este stock al inventario?")) return;

    try {
      const res = await axios.put(`http://localhost:3000/api/pedidos/recibir/${idPedido}`);
      setMensaje(`✅ ${res.data.mensaje}`);
      cargarPedidos(); // Recargar la tabla para ver el cambio a "Recibido"
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al confirmar la llegada.");
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold m-0">🚚 Control de Pedidos (Proveedores)</h2>
        <Link to="/pedidos" className="btn btn-success fw-bold shadow">
          ➕ Registrar Nuevo Pedido
        </Link>
      </div>

      {mensaje && <div className="alert alert-success fw-bold text-center">{mensaje}</div>}

      <div className="card shadow border-0" style={{ borderRadius: "15px" }}>
        <div className="card-body p-4 table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID Pedido</th>
                <th>Fecha Pedido</th>
                <th>Fecha Recepción</th>
                <th className="text-center">Estado</th>
                <th className="text-end">Total Pagado</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((ped) => (
                <tr key={ped.id_pedido}>
                  <td className="fw-bold">#{ped.id_pedido}</td>
                  <td>{new Date(ped.fecha_pedido).toLocaleDateString()}</td>
                  <td>{ped.fecha_recepcion ? new Date(ped.fecha_recepcion).toLocaleDateString() : <span className="text-muted">Aún no llega</span>}</td>
                  <td className="text-center">
                    {ped.estado_pedido === "Pendiente" ? (
                      <span className="badge bg-warning text-dark px-3 py-2">⏳ Pendiente</span>
                    ) : (
                      <span className="badge bg-success px-3 py-2">✅ Recibido</span>
                    )}
                  </td>
                  <td className="text-end fw-bold text-danger">Bs. {ped.total_pedido}</td>
                  <td className="text-center">
                    {ped.estado_pedido === "Pendiente" && (
                      <button 
                        className="btn btn-sm btn-primary fw-bold shadow-sm"
                        onClick={() => marcarLlegada(ped.id_pedido)}
                      >
                        📦 Marcar Llegada
                      </button>
                    )}
                    {ped.estado_pedido === "Recibido" && (
                      <span className="text-muted fst-italic">Completado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}