import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    
    const captchaRef = useRef(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
         
        // 1. Verificación del CAPTCHA
        const captchaValue = captchaRef.current.getValue();
        if (!captchaValue) {
            setMensaje('⚠️ Por favor, marca la casilla "No soy un robot"');
            return;
        }

        try {
            // 2. Hacemos la petición al backend enviando 'email'
            const res = await axios.post('http://localhost:3000/api/login', { email, password });
            
            // 3. CORRECCIÓN: Usamos 'res' en lugar de 'respuesta' para guardar en memoria
            localStorage.setItem('rolUsuario', res.data.usuario.rol || 'Cliente');
            localStorage.setItem('idUsuario', res.data.usuario.id);

            setMensaje(`✅ ${res.data.mensaje}. ¡Bienvenido ${res.data.usuario.email}!`);
            
            setTimeout(() => {
                navigate('/productos');
            }, 1500);
            
        } catch (error) {
            setMensaje(`❌ Error: ${error.response?.data?.error || 'No se pudo conectar al servidor'}`);
            captchaRef.current.reset();
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '25px', fontWeight: 'bold' }}>Ingreso al Sistema</h2>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* CORRECCIÓN: Input cambiado de text/username a email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: 'bold', color: '#555' }}>Correo Electrónico</label>
                        <input 
                            type="email" 
                            placeholder="ejemplo@gmail.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: 'bold', color: '#555' }}>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="Escribe tu contraseña" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', my: '10px' }}>
                        <ReCAPTCHA
                            ref={captchaRef}
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={{ padding: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
                        Iniciar Sesión
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                        <Link to="/registro" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                            ¿No tienes cuenta? Regístrate aquí
                        </Link>
                    </div>
                </form>

                {mensaje && (
                    <div style={{ 
                        marginTop: '20px', 
                        padding: '12px', 
                        textAlign: 'center', 
                        backgroundColor: mensaje.includes('❌') ? '#f8d7da' : '#d4edda', 
                        color: mensaje.includes('❌') ? '#721c24' : '#155724',
                        borderRadius: '5px',
                        border: mensaje.includes('❌') ? '1px solid #f5c6cb' : '1px solid #c3e6cb'
                    }}>
                        <strong>{mensaje}</strong>
                    </div>
                )}
            </div>
        </div>
    );
}