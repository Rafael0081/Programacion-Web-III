import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegistroCliente() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '', 
        password: '',
        nombre: '',
        telefono: ''
    });

    const [fuerza, setFuerza] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    // Función que evalúa la contraseña
    const evaluarFuerza = (pass) => {
        if (pass.length === 0) return '';
        if (pass.length < 6) return 'Débil';
        if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) return 'Fuerte';
        if (pass.length >= 6 && /[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) return 'Medio';
        return 'Débil';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'password') {
            setFuerza(evaluarFuerza(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(formData.email)) {
            setError('❌ Formato inválido. Debes usar un correo real (ej. nombre@gmail.com).');
            setMensaje('');
            return; 
        }
        try {
            // Le mandamos al backend todos los datos + la fuerza de la contraseña 
            const datosAEnviar = {
                ...formData,
                fuerza_password: fuerza || 'Débil' 
            };

            const respuesta = await axios.post('http://localhost:3000/api/registro-cliente', datosAEnviar);
            setMensaje(`✅ ${respuesta.data.mensaje}`);
            setError('');
            
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('❌ Hubo un problema al crear la cuenta. Verifica que el correo no esté en uso.');
            setMensaje('');
        }
    };

    // Función para pintar la barrita de color según la fuerza
    const getColorFuerza = () => {
        if (fuerza === 'Fuerte') return 'text-success'; // Verde
        if (fuerza === 'Medio') return 'text-warning'; // Amarillo
        return 'text-danger'; // Rojo
    };

    return (
        <div className="container py-5" style={{ maxWidth: '500px' }}>
            <div className="card shadow-lg border-0 rounded-4">
                <div className="card-header bg-dark text-white text-center py-3 rounded-top-4">
                    <h3 className="m-0">Crea tu Cuenta</h3>
                </div>
                <div className="card-body p-4">
                    {mensaje && <div className="alert alert-success">{mensaje}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Datos de Acceso */}
                        <h5 className="text-muted border-bottom pb-2 mb-3">Datos de Acceso</h5>
                        
                        {/* 2. CAMBIO AQUÍ: type="email", name="email" y el placeholder */}
                        <div className="mb-3">
                            <input 
                                type="email" 
                                name="email" 
                                className="form-control" 
                                placeholder="Correo electrónico (ej. juan@gmail.com)" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="mb-2">
                            <input type="password" name="password" className="form-control" placeholder="Contraseña" onChange={handleChange} required />
                        </div>
                        
                        {/* Indicador visual de la fuerza de la contraseña */}
                        {fuerza && (
                            <div className="mb-4 text-end">
                                <small className="fw-bold">
                                    Seguridad: <span className={getColorFuerza()}>{fuerza}</span>
                                </small>
                            </div>
                        )}

                        {/* Datos Personales */}
                        <h5 className="text-muted border-bottom pb-2 mb-3 mt-3">Datos Personales</h5>
                        <div className="mb-3">
                            <input type="text" name="nombre" className="form-control" placeholder="Nombre completo" onChange={handleChange} required />
                        </div>
                        <div className="mb-4">
                            <input type="text" name="telefono" className="form-control" placeholder="Ej. 71234567" onChange={handleChange} required />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 fw-bold fs-5 mb-3">
                            Registrarme
                        </button>
                        
                        <div className="text-center">
                            <span className="text-muted">¿Ya tienes cuenta? </span>
                            <Link to="/login" className="text-decoration-none fw-bold">Inicia Sesión aquí</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}