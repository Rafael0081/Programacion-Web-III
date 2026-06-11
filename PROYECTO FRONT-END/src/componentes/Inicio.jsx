import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

import Mision from './Mision';
import Content from './Content';
import Banner from './Banner';
import Footer from './Footer';

function Inicio() {
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [error, setError] = useState('');
  const rolUsuario = localStorage.getItem('rolUsuario');

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3000/api/productos');
        
        const datosFormateados = respuesta.data.map(prod => ({
          nombre: prod.nombre_producto,
          Stock: prod.stock,
          Precio: prod.precio_venta
        }));
        
        setDatosGrafico(datosFormateados);
      } catch (err) {
        setError('No se pudo cargar la información para el gráfico.');
        console.error(err);
      }
    };
    obtenerDatos();
  }, []);

  return (
    <div className="container mt-3">
      
      {rolUsuario === 'Administrador' && (
        <div className="card shadow-lg my-5 animate__animated animate__fadeInUp" style={{ borderRadius: '15px' }}>
          <div className="card-header bg-danger text-white text-center" style={{ borderRadius: '15px 15px 0 0' }}>
            <h4 className="m-0 py-2">📊 Estadísticas de Inventario</h4>
          </div>
          
          <div className="card-body p-4">
            {error && <div className="alert alert-danger text-center">{error}</div>}
            
            {datosGrafico.length > 0 ? (
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={datosGrafico}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Stock" fill="#ce1212" radius={[5, 5, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <h5>Cargando estadísticas...</h5>
              </div>
            )}
          </div>
        </div>
      )}
      <Content />
      <Footer />
    </div>
  );
}

export default Inicio;