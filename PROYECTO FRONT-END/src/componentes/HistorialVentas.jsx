import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState('');
  
  const rolUsuario = localStorage.getItem('rolUsuario');

  useEffect(() => {
    if (rolUsuario === 'Administrador') {
      const obtenerVentas = async () => {
        try {
          const respuesta = await axios.get('http://localhost:3000/api/ventas');
          setVentas(respuesta.data);
        } catch (err) {
          setError('No se pudo cargar el historial de ventas.');
          console.error(err);
        }
      };
      obtenerVentas();
    }
  }, [rolUsuario]);

  if (rolUsuario !== 'Administrador') {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold">⛔ Acceso Denegado</h2>
        <p className="fs-5 text-muted">Solo los administradores pueden ver el historial de ventas.</p>
        <Link to="/" className="btn btn-primary mt-3">Volver al Inicio</Link>
      </div>
    );
  }

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-BO', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3" style={{ borderRadius: '15px 15px 0 0' }}>
          <h3 className="m-0">📋 Historial de Ventas</h3>
          <span className="badge bg-success fs-6">Total Registros: {ventas.length}</span>
        </div>
        
        <div className="card-body p-4">
          {error && <div className="alert alert-danger">{error}</div>}

          {ventas.length === 0 && !error ? (
            <div className="text-center text-muted py-5">
              <h5>Aún no hay ventas registradas en el sistema.</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nro. Venta</th>
                    <th>Fecha y Hora</th>
                    <th>Cliente</th>
                    <th className="text-center">Tipo</th>
                    <th className="text-center">Estado</th>
                    <th className="text-end">Total (Bs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((venta) => (
                    <tr key={venta.id_venta}>
                      <td className="fw-bold text-primary"># {venta.id_venta}</td>
                      <td>{formatearFecha(venta.fecha_hora)}</td>
                      {/* Aquí extraemos el nombre del cliente que jaló Supabase */}
                      <td className="fw-bold text-secondary">
                        {venta.cliente ? venta.cliente.nombre : 'Cliente Genérico'}
                      </td>
                      <td className="text-center">
                        <span className="badge bg-info text-dark">{venta.tipo_venta}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-success">{venta.estado_pago}</span>
                      </td>
                      <td className="text-end fw-bold text-danger fs-5">
                        Bs. {venta.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
