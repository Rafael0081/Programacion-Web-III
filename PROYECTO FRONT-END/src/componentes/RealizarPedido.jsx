import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RealizarPedido() {
  const [productos, setProductos] = useState([]);
  const [carritoPedido, setCarritoPedido] = useState([]);
  const [idProveedor, setIdProveedor] = useState(1); // Por defecto el proveedor 1
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioCompra, setPrecioCompra] = useState("");
  const [mensaje, setMensaje] = useState("");
  
  const navigate = useNavigate();
  const idUsuario = localStorage.getItem("idUsuario"); 

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/productos");
        setProductos(res.data);
      } catch (error) {
        console.error("Error al cargar productos", error);
      }
    };
    obtenerProductos();
  }, []);

  // 1. FILTRO MÁGICO: Solo guardamos los que coincidan con el ID escrito
  const productosFiltrados = productos.filter((p) => p.id_proveedor == idProveedor);

  // 2. FUNCIÓN DE SEGURIDAD: Si cambia el proveedor, borramos lo que había elegido
  const handleProveedorChange = (e) => {
    setIdProveedor(e.target.value);
    setProductoSeleccionado(""); 
  };

  const agregarAlPedido = (e) => {
    e.preventDefault();
    if (!productoSeleccionado || !precioCompra || cantidad < 1) {
      setMensaje("⚠️ Llena todos los datos del producto.");
      return;
    }

    const prodInfo = productos.find(p => p.id_producto === parseInt(productoSeleccionado));
    
    const nuevoItem = {
      id_producto: prodInfo.id_producto,
      nombre_producto: prodInfo.nombre_producto,
      cantidad: parseInt(cantidad),
      precio_compra: parseFloat(precioCompra),
      subtotal: parseInt(cantidad) * parseFloat(precioCompra)
    };

    setCarritoPedido([...carritoPedido, nuevoItem]);
    setMensaje("");
    
    setProductoSeleccionado("");
    setCantidad(1);
    setPrecioCompra("");
  };

  const totalPedido = carritoPedido.reduce((suma, item) => suma + item.subtotal, 0);

  const enviarPedido = async () => {
    if (carritoPedido.length === 0) return setMensaje("⚠️ Agrega al menos un producto al pedido.");

    try {
      const res = await axios.post("http://localhost:3000/api/pedidos", {
        id_usuario: idUsuario,
        id_proveedor: idProveedor,
        carrito_pedido: carritoPedido,
        total_pedido: totalPedido
      });

      setMensaje(`✅ ${res.data.mensaje}`);
      setCarritoPedido([]);
      
      setTimeout(() => {
        navigate("/productos"); 
      }, 3000);

    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al registrar el pedido en la base de datos.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-primary fw-bold mb-4">📦 Registrar Pedido a Proveedor</h2>
      
      {mensaje && <div className="alert alert-info fw-bold">{mensaje}</div>}

      <div className="row">
        {/* LADO IZQUIERDO */}
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm p-4">
            <h4 className="text-muted border-bottom pb-2">Agregar Producto</h4>
            <form onSubmit={agregarAlPedido}>
              
              <div className="mb-3">
                <label className="fw-bold">ID Proveedor:</label>
                {/* 3. Conectamos el input con nuestra función de seguridad */}
                <input 
                  type="number" 
                  className="form-control" 
                  value={idProveedor} 
                  onChange={handleProveedorChange} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="fw-bold">Seleccionar Producto:</label>
                <select className="form-select" value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)} required>
                  <option value="">-- Elige un producto --</option>
                  
                  {/* 4. Dibujamos SOLO la lista filtrada */}
                  {productosFiltrados.length > 0 ? (
                    productosFiltrados.map(p => (
                      <option key={p.id_producto} value={p.id_producto}>
                        {p.nombre_producto} (Stock actual: {p.stock})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No hay productos para este proveedor</option>
                  )}
                  
                </select>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="fw-bold">Cantidad a pedir:</label>
                  <input type="number" className="form-control" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                </div>
                <div className="col-6 mb-3">
                  <label className="fw-bold">Costo Unitario (Bs):</label>
                  <input type="number" step="0.01" className="form-control" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-bold">➕ Añadir a la lista</button>
            </form>
          </div>
        </div>

        {/* LADO DERECHO */}
        <div className="col-md-7">
          <div className="card shadow-sm p-4">
            <h4 className="text-muted border-bottom pb-2">Detalle del Pedido</h4>
            
            {carritoPedido.length === 0 ? (
              <p className="text-center text-muted my-5">Aún no has agregado productos al pedido.</p>
            ) : (
              <>
                <table className="table table-hover mt-3">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Costo Un.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carritoPedido.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre_producto}</td>
                        <td>{item.cantidad}</td>
                        <td>Bs. {item.precio_compra}</td>
                        <td className="fw-bold text-success">Bs. {item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-end border-top pt-3 mt-3">
                  <h4>Total Pedido: <span className="text-danger fw-bold">Bs. {totalPedido}</span></h4>
                  <button onClick={enviarPedido} className="btn btn-success btn-lg mt-2 fw-bold">🛒 Confirmar y Guardar Pedido</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}