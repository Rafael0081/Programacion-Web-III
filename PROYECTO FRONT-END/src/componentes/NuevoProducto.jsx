import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function NuevoProducto() {
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [idCategoria, setIdCategoria] = useState('1'); 
  const [idProveedor, setIdProveedor] = useState('1'); 
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError(false);

    try {
      await axios.post('http://localhost:3000/api/productos', {
        id_categoria: parseInt(idCategoria),
        id_proveedor: parseInt(idProveedor),
        nombre_producto: nombre,
        stock: parseInt(stock),
        precio_compra: parseFloat(precioCompra),
        precio_venta: parseFloat(precioVenta)
      });

      setError(false);
      setMensaje('✅ ¡Producto creado y guardado en el inventario con éxito!');
      setNombre('');
      setStock('');
      setPrecioCompra('');
      setPrecioVenta('');
      setTimeout(() => {
        navigate('/productos');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(true);
      setMensaje('❌ Hubo un error al guardar el producto. Verifica los datos.');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
        <div className="card-header bg-success text-white text-center py-3" style={{ borderRadius: '15px 15px 0 0' }}>
          <h3 className="m-0">➕ Registrar Nuevo Producto</h3>
        </div>

        <div className="card-body p-4">
          {mensaje && (
            <div className={`alert ${error ? 'alert-danger' : 'alert-success'} text-center fw-bold`}>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label className="form-label fw-bold">Nombre del Producto</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej. Papas Fritas Lays 40g"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Stock Inicial</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Cantidad"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Precio Compra (Bs.)</label>
              <input 
                type="number" 
                step="0.01"
                className="form-control" 
                placeholder="0.00"
                value={precioCompra}
                onChange={(e) => setPrecioCompra(e.target.value)}
                min="0"
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Precio Venta (Bs.)</label>
              <input 
                type="number" 
                step="0.01"
                className="form-control" 
                placeholder="0.00"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                min="0"
                required 
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">ID_Categoria</label>
              <input 
                type="number" 
                className="form-control" 
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
                required 
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">ID Proveedor</label>
              <input 
                type="number" 
                className="form-control" 
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                required 
              />
            </div>

            <div className="col-12 d-flex gap-3 mt-4">
              <Link to="/productos" className="btn btn-outline-secondary w-50 py-2">
                Cancelar
              </Link>
              <button type="submit" className="btn btn-success w-50 py-2 fw-bold shadow">
                💾 Guardar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}