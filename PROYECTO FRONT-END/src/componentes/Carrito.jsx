import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [datosPago, setDatosPago] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaExpiracion: '',
    cvv: '',
    email: '',
    telefono: ''
  });
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      setCarrito([]);
      return;
    }
    const carritoGuardado = JSON.parse(localStorage.getItem(`carritoFam_${idUsuario}`)) || [];
    setCarrito(carritoGuardado);
  }, []);

  const totalPagar = carrito.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0);

  const eliminarProducto = (id) => {
    const idUsuario = localStorage.getItem('idUsuario');
    const nuevaLista = carrito.filter(item => item.id_producto !== id);
    setCarrito(nuevaLista);
    localStorage.setItem(`carritoFam_${idUsuario}`, JSON.stringify(nuevaLista));
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  const handleInputChange = (e) => {
    setDatosPago({
      ...datosPago,
      [e.target.name]: e.target.value
    });
  };

  const validarFormularioPago = () => {
    if (metodoPago === 'tarjeta') {
      if (!datosPago.numeroTarjeta || datosPago.numeroTarjeta.replace(/\s/g, '').length < 16) {
        setMensaje('❌ Número de tarjeta inválido');
        return false;
      }
      if (!datosPago.nombreTitular) {
        setMensaje('❌ Ingrese el nombre del titular');
        return false;
      }
      if (!datosPago.fechaExpiracion || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(datosPago.fechaExpiracion)) {
        setMensaje('❌ Fecha de expiración inválida (MM/AA)');
        return false;
      }
      if (!datosPago.cvv || datosPago.cvv.length < 3) {
        setMensaje('❌ CVV inválido');
        return false;
      }
    } else if (metodoPago === 'qr') {
      if (!datosPago.email || !datosPago.email.includes('@')) {
        setMensaje('❌ Email inválido');
        return false;
      }
    } else if (metodoPago === 'efectivo') {
      if (!datosPago.telefono || datosPago.telefono.length < 8) {
        setMensaje('❌ Teléfono inválido');
        return false;
      }
    }
    return true;
  };

  const procesarCompra = async () => {
    const idUsuario = localStorage.getItem('idUsuario');

    if (!idUsuario) {
      setMensaje('⚠️ Necesitas iniciar sesión para poder comprar.');
      return;
    }

    if (carrito.length === 0) {
      setMensaje('⚠️ Tu carrito está vacío');
      return;
    }

    if (!validarFormularioPago()) {
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    setProcesando(true);
    setMensaje('🔄 Procesando pago...');

    // Simular delay de procesamiento
    setTimeout(async () => {
      try {
        const respuesta = await axios.post('http://localhost:3000/api/comprar', {
          id_usuario: idUsuario,
          carrito: carrito,
          total: totalPagar,
          metodo_pago: metodoPago,
          datos_pago: metodoPago === 'tarjeta' ? {
            ultimos4: datosPago.numeroTarjeta.slice(-4),
            titular: datosPago.nombreTitular
          } : { contacto: metodoPago === 'qr' ? datosPago.email : datosPago.telefono }
        });

        setMensaje(`✅ ${respuesta.data.mensaje}`);
        setCarrito([]);
        setMostrarPago(false);
        localStorage.removeItem(`carritoFam_${idUsuario}`);
        
        // Resetear formulario
        setDatosPago({
          numeroTarjeta: '',
          nombreTitular: '',
          fechaExpiracion: '',
          cvv: '',
          email: '',
          telefono: ''
        });
        
        window.dispatchEvent(new Event('carritoActualizado'));
        
        setTimeout(() => {
          navigate('/productos');
        }, 3000);

      } catch (error) {
        console.error(error);
        const errorExacto = error.response?.data?.error || error.message;
        setMensaje(`❌ Error en el pago: ${errorExacto}`);
      } finally {
        setProcesando(false);
      }
    }, 1500);
  };

  // Formatear número de tarjeta con espacios cada 4 dígitos
  const formatearNumeroTarjeta = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setDatosPago({ ...datosPago, numeroTarjeta: value });
  };

  // Formatear fecha MM/AA
  const formatearFecha = (e) => {
    let value = e.target.value.replace(/\//g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setDatosPago({ ...datosPago, fechaExpiracion: value });
  };

  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
        <div className="card-header bg-dark text-white text-center py-3" style={{ borderRadius: '15px 15px 0 0' }}>
          <h3 className="m-0">🛒 Mi Carrito de Compras</h3>
        </div>
        
        <div className="card-body p-4">
          {mensaje && (
            <div className={`alert ${mensaje.includes('✅') ? 'alert-success' : mensaje.includes('❌') ? 'alert-danger' : 'alert-info'} text-center fw-bold fs-5`}>
              {mensaje}
            </div>
          )}

          {carrito.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-muted mb-4">Tu carrito está vacío 😔</h4>
              <Link to="/productos" className="btn btn-primary px-4">Ir a comprar</Link>
            </div>
          ) : !mostrarPago ? (
            <>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Precio</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Subtotal</th>
                      <th className="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item) => (
                      <tr key={item.id_producto}>
                        <td className="fw-bold text-primary">{item.nombre_producto}</td>
                        <td className="text-center">Bs. {item.precio_venta}</td>
                        <td className="text-center">
                          <span className="badge bg-secondary fs-6">{item.cantidad}</span>
                        </td>
                        <td className="text-end fw-bold text-success">
                          Bs. {item.precio_venta * item.cantidad}
                        </td>
                        <td className="text-center">
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => eliminarProducto(item.id_producto)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <Link to="/productos" className="btn btn-outline-secondary">
                  ⬅️ Seguir comprando
                </Link>
                <div className="text-end">
                  <h4 className="m-0">Total a Pagar: <span className="text-danger fw-bold">Bs. {totalPagar}</span></h4>
                  <button onClick={() => setMostrarPago(true)} className="btn btn-success btn-lg mt-3 w-100 fw-bold shadow">
                    💳 Proceder al Pago
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Resumen de compra */}
              <div className="bg-light p-3 rounded mb-4">
                <h5 className="mb-3">📋 Resumen de tu compra</h5>
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Productos:</strong> {carrito.length}</p>
                    <p className="mb-1"><strong>Cantidad total:</strong> {carrito.reduce((sum, item) => sum + item.cantidad, 0)}</p>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <h4 className="text-danger mb-0">Total: Bs. {totalPagar}</h4>
                  </div>
                </div>
              </div>

              {/* Selección de método de pago */}
              <div className="mb-4">
                <label className="form-label fw-bold">Método de Pago</label>
                <div className="btn-group w-100" role="group">
                  <button 
                    type="button" 
                    className={`btn ${metodoPago === 'tarjeta' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setMetodoPago('tarjeta')}
                  >
                    💳 Tarjeta
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${metodoPago === 'qr' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setMetodoPago('qr')}
                  >
                    📱 QR / Yape / Plin
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${metodoPago === 'efectivo' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setMetodoPago('efectivo')}
                  >
                    💵 Efectivo (Contraentrega)
                  </button>
                </div>
              </div>

              {/* Formulario según método de pago */}
              {metodoPago === 'tarjeta' && (
                <div className="mb-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="mb-3">💳 Datos de la Tarjeta</h6>
                      <div className="mb-3">
                        <label className="form-label">Número de Tarjeta</label>
                        <input 
                          type="text" 
                          name="numeroTarjeta"
                          className="form-control" 
                          placeholder="1234 5678 9012 3456"
                          value={datosPago.numeroTarjeta}
                          onChange={formatearNumeroTarjeta}
                          maxLength="19"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Nombre del Titular</label>
                        <input 
                          type="text" 
                          name="nombreTitular"
                          className="form-control" 
                          placeholder="Como aparece en la tarjeta"
                          value={datosPago.nombreTitular}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Fecha Expiración</label>
                          <input 
                            type="text" 
                            name="fechaExpiracion"
                            className="form-control" 
                            placeholder="MM/AA"
                            value={datosPago.fechaExpiracion}
                            onChange={formatearFecha}
                            maxLength="5"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">CVV</label>
                          <input 
                            type="password" 
                            name="cvv"
                            className="form-control" 
                            placeholder="123"
                            value={datosPago.cvv}
                            onChange={handleInputChange}
                            maxLength="4"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {metodoPago === 'qr' && (
                <div className="mb-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h6 className="mb-3">📱 Pago con QR / Yape / Plin</h6>
                      <div className="alert alert-info">
                        <strong>📧 Enviaremos un código de pago a tu email</strong>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Correo Electrónico</label>
                        <input 
                          type="email" 
                          name="email"
                          className="form-control" 
                          placeholder="tu@email.com"
                          value={datosPago.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {metodoPago === 'efectivo' && (
                <div className="mb-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="mb-3">💵 Pago Contraentrega</h6>
                      <div className="alert alert-warning">
                        <strong>⏰ El pago se realizará al momento de recibir el pedido</strong>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Número de Teléfono</label>
                        <input 
                          type="tel" 
                          name="telefono"
                          className="form-control" 
                          placeholder="77712345"
                          value={datosPago.telefono}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="d-flex gap-3 mt-4">
                <button 
                  onClick={() => {
                    setMostrarPago(false);
                    setMensaje('');
                  }} 
                  className="btn btn-outline-secondary flex-grow-1"
                >
                  ⬅️ Volver al carrito
                </button>
                <button 
                  onClick={procesarCompra} 
                  className="btn btn-success flex-grow-1 fw-bold"
                  disabled={procesando}
                >
                  {procesando ? '🔄 Procesando...' : '✅ Confirmar Pago'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}