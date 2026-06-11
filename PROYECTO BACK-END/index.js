import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { supabase } from './db.js'; 

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('SERVIDOR ACTIVO');
});
// ==========================================
// PRODUCTOS        
// ==========================================
app.get('/api/productos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('producto') 
            .select('*')
            .eq('estado', true); 

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error al traer productos:", error);
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/productos', async (req, res) => {
    try {
        const { id_categoria, id_proveedor, nombre_producto, stock, precio_compra, precio_venta } = req.body;
        const { data, error } = await supabase
            .from('producto')
            .insert([{ id_categoria, id_proveedor, nombre_producto, stock, precio_compra, precio_venta }])
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: error.message });
    }
});
app.put('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const { id_categoria, id_proveedor, nombre_producto, stock, precio_compra, precio_venta } = req.body;

        const { data, error } = await supabase
            .from('producto')
            .update({ id_categoria, id_proveedor, nombre_producto, stock, precio_compra, precio_venta })
            .eq('id_producto', id)
            .select();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: error.message });
    }
});
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('producto')
            .update({ estado: false }) 
            .eq('id_producto', id)
            .select();

        if (error) throw error;
        res.json({ mensaje: 'Producto eliminado lógicamente (inactivo)', data });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: error.message });
    }
});
// ==========================================
// REACTIVAR PRODUCTO 
// ==========================================
app.put('/api/productos/activar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('producto')
            .update({ estado: true }) // 
            .eq('id_producto', id)
            .select();

        if (error) throw error;
        
        res.json({ mensaje: '✅ Producto reactivado y visible en el catálogo nuevamente', data });
    } catch (error) {
        console.error("Error al reactivar producto:", error);
        res.status(500).json({ error: error.message });
    }
});
// ==========================================
// LOGIN Y LOG DE ACCESO  
// ==========================================
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body; 
        
        const { data: usuarios, error: errUser } = await supabase
            .from('usuario')
            .select('*')
            .eq('email', email) 
            .eq('estado', true);

        if (errUser) throw errUser;
        if (usuarios.length === 0) {
            return res.status(401).json({ error: 'Correo no encontrado o inactivo' });
        }
        
        const usuarioDB = usuarios[0];
        const passwordValida = await bcrypt.compare(password, usuarioDB.password_hash);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
        
        const ip = req.ip || req.socket.remoteAddress;
        const browserCompleto = req.headers['user-agent'] || 'Desconocido';
        const browserCorto = browserCompleto.substring(0, 90);
        
        const { error: errLog } = await supabase
            .from('log_acceso')
            .insert([{ 
                id_usuario: usuarioDB.id_usuario, 
                ip_address: ip, 
                evento: 'Ingreso', 
                browser: browserCorto 
            }]);
            
        if (errLog) console.error("Error al guardar el log:", errLog);
        
        res.json({ 
            mensaje: 'Login exitoso', 
            usuario: {
                id: usuarioDB.id_usuario,
                email: usuarioDB.email, 
                rol: usuarioDB.rol
            }
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: error.message });
    }
});
// ==========================================
// LOGOUT 
// ==========================================
app.post('/api/logout', async (req, res) => {
    try {
        const { id_usuario } = req.body;
        const ip = req.ip || req.socket.remoteAddress;
        const browser = req.headers['user-agent']?.substring(0, 90) || 'Desconocido';
        
        const { error } = await supabase
            .from('log_acceso')
            .insert([{ 
                id_usuario: id_usuario, 
                ip_address: ip, 
                evento: 'Salida', 
                browser: browser 
            }]);
        
        if (error) throw error;
        
        res.json({ mensaje: 'Salida registrada exitosamente' });
    } catch (error) {
        console.error("Error al registrar logout:", error);
        res.status(500).json({ error: error.message });
    }
});
// ==========================================
// REGISTRO DE NUEVOS CLIENTES DESDE LA WEB 
// ==========================================
app.post('/api/registro-cliente', async (req, res) => {
    try {
        const { email, password, nombre, telefono, fuerza_password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const { data: usuarioData, error: errorUsuario } = await supabase
            .from('usuario')
            .insert([{ 
                email: email, 
                password_hash: passwordEncriptada,
                fuerza_password: fuerza_password,
                rol: 'Cliente', 
                estado: true 
            }])
            .select();

        if (errorUsuario) throw errorUsuario;
        const idNuevoUsuario = usuarioData[0].id_usuario;

        const { error: errorCliente } = await supabase
            .from('cliente')
            .insert([{ nombre, telefono, estado: true, id_usuario: idNuevoUsuario }]);

        if (errorCliente) throw errorCliente;
        res.status(201).json({ mensaje: "¡Cuenta creada exitosamente!" });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ error: error.message });
    }
});
// ==========================================
// CREAR ADMINISTRADORES
// ==========================================
app.post('/api/registro-administrador-secreto', async (req, res) => {
    try {
        const { email, password, fuerza_password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const { data, error } = await supabase
            .from('usuario')
            .insert([{ 
                email: email,
                password_hash: passwordEncriptada,
                fuerza_password: fuerza_password || 'Fuerte',
                rol: 'Administrador',
                estado: true
            }]);

        if (error) throw error;

        res.status(201).json({
            mensaje: "¡Nuevo Administrador creado con éxito!"
        });

    } catch (error) {
        console.error("Error al crear admin:", error);
        res.status(500).json({ error: error.message });
    }
});
// ==========================================
// PROCESAR COMPRA CON MÉTODOS DE PAGO
// ==========================================
app.post('/api/comprar', async (req, res) => {
    try {
        const { id_usuario, carrito, total, metodo_pago, datos_pago } = req.body;

        if (!carrito || carrito.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        const { data: clienteData, error: errCli } = await supabase
            .from('cliente')
            .select('id_cliente, nombre')
            .eq('id_usuario', id_usuario)
            .single(); 
            
        if (errCli) {
            console.error("Error al buscar cliente:", errCli);
            throw new Error("No se pudo encontrar el perfil de cliente para este usuario.");
        }
        
        const idDelCliente = clienteData.id_cliente;
        const nombreCliente = clienteData.nombre;
        
   
        let estadoPago = 'Completado';
        let observacionPago = '';
        
        switch(metodo_pago) {
            case 'tarjeta':
                estadoPago = 'Completado';
                observacionPago = `Pago con tarjeta - Últimos 4 dígitos: ${datos_pago.ultimos4} - Titular: ${datos_pago.titular}`;
                break;
            case 'qr':
                estadoPago = 'Pendiente';
                observacionPago = `Pago QR/Yape/Plin - Enviar código a: ${datos_pago.contacto}`;
                break;
            case 'efectivo':
                estadoPago = 'Pendiente';
                observacionPago = `Pago contraentrega - Contacto: ${datos_pago.contacto}`;
                break;
            default:
                estadoPago = 'Completado';
                observacionPago = `Pago estándar - Método: ${metodo_pago || 'No especificado'}`;
        }
       
        const { data: ventaData, error: errVenta } = await supabase
            .from('venta') 
            .insert([{
                id_usuario: id_usuario,
                id_cliente: idDelCliente,
                tipo_venta: 'Online', 
                estado_pago: estadoPago,
                fecha_hora: new Date().toISOString(),
                total: total,
                metodo_pago: metodo_pago || 'No especificado',
                observacion: observacionPago
            }])
            .select();

        if (errVenta) {
            console.error("Error al crear venta:", errVenta);
            throw errVenta;
        }
        const idNuevaVenta = ventaData[0].id_venta;
        for (const item of carrito) {
         
            const { error: errDetalle } = await supabase
                .from('detalle_venta')
                .insert([{
                    id_venta: idNuevaVenta,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    sub_total: item.precio_venta * item.cantidad
                }]);
                
            if (errDetalle) {
                console.error("Error al insertar detalle:", errDetalle);
                throw errDetalle;
            }
            const { data: prodData, error: errProd } = await supabase
                .from('producto')
                .select('stock')
                .eq('id_producto', item.id_producto)
                .single();
                
            if (errProd) {
                console.error("Error al consultar stock:", errProd);
                throw errProd;
            }
            const nuevoStock = prodData.stock - item.cantidad;
            if (nuevoStock < 0) {
                throw new Error(`Stock insuficiente para el producto: ${item.nombre_producto}`);
            }
            
            const { error: errStock } = await supabase
                .from('producto')
                .update({ stock: nuevoStock })
                .eq('id_producto', item.id_producto);
                
            if (errStock) {
                console.error("Error al actualizar stock:", errStock);
                throw errStock;
            }
        }
        const ip = req.ip || req.socket.remoteAddress;
        const browserCompleto = req.headers['user-agent'] || 'Desconocido';
        const browserCorto = browserCompleto.substring(0, 90);
        
        await supabase
            .from('log_acceso')
            .insert([{ 
                id_usuario: id_usuario, 
                ip_address: ip, 
                evento: `Compra realizada - Venta #${idNuevaVenta} - Método: ${metodo_pago}`, 
                browser: browserCorto 
            }]);
        
        let mensajeRespuesta = '';
        switch(metodo_pago) {
            case 'tarjeta':
                mensajeRespuesta = `✅ ¡Compra exitosa! Se ha debitado Bs. ${total} de tu tarjeta. Gracias por tu compra, ${nombreCliente}.`;
                break;
            case 'qr':
                mensajeRespuesta = `✅ ¡Pedido registrado! Te hemos enviado un código de pago a ${datos_pago.contacto}. Tu pedido se confirmará una vez realizado el pago.`;
                break;
            case 'efectivo':
                mensajeRespuesta = `✅ ¡Pedido registrado! Pagarás Bs. ${total} al recibir el pedido. Te contactaremos al ${datos_pago.contacto} para coordinar la entrega.`;
                break;
            default:
                mensajeRespuesta = `✅ ¡Venta registrada exitosamente! Gracias por tu compra, ${nombreCliente}.`;
        }
        
        res.status(201).json({ 
            mensaje: mensajeRespuesta,
            id_venta: idNuevaVenta,
            metodo_pago: metodo_pago,
            estado_pago: estadoPago
        });
        
    } catch (error) {
        console.error("Error al procesar la compra:", error);
        res.status(500).json({ error: error.message });
    }
});
// ==========================================
// HISTORIAL DE VENTAS
// ==========================================
app.get('/api/ventas', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('venta')
            .select(`
                id_venta,
                fecha_hora,
                total,
                tipo_venta,
                estado_pago,
                cliente ( nombre )
            `)
            .order('fecha_hora', { ascending: false }); 
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error al traer historial:", error);
        res.status(500).json({ error: error.message });
    }
});
// ==========================================
// MÓDULO DE PEDIDOS A PROVEEDORES
// ==========================================
app.get('/api/pedidos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pedido')
      .select('*')
      .order('fecha_pedido', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pedidos', async (req, res) => {
  const { id_usuario, id_proveedor, carrito_pedido, total_pedido } = req.body;
  try {
    const { data: pedidoGuardado, error: errorPedido } = await supabase
      .from('pedido')
      .insert([{
        id_usuario: id_usuario,
        id_proveedor: id_proveedor,
        fecha_pedido: new Date(),
        fecha_recepcion: null, 
        estado_pedido: 'Pendiente', // 
        total_pedido: total_pedido
      }])
      .select().single();
    if (errorPedido) throw errorPedido;
    for (const item of carrito_pedido) {
      const { error: errorDetalle } = await supabase
        .from('detalle_pedido')
        .insert([{
          id_pedido: pedidoGuardado.id_pedido,
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_compra_unitario: item.precio_compra,
          subtotal: item.subtotal
        }]);
      if (errorDetalle) throw errorDetalle;
    }
    res.json({ mensaje: "📄 ¡Pedido registrado y en espera de llegada!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put('/api/pedidos/recibir/:id', async (req, res) => {
  const idPedido = req.params.id;
  try {
    const { error: errorUpdatePedido } = await supabase
      .from('pedido')
      .update({ 
        estado_pedido: 'Recibido', 
        fecha_recepcion: new Date() 
      })
      .eq('id_pedido', idPedido);
    if (errorUpdatePedido) throw errorUpdatePedido;

    const { data: detalles, error: errorDetalles } = await supabase
      .from('detalle_pedido')
      .select('id_producto, cantidad')
      .eq('id_pedido', idPedido);
    if (errorDetalles) throw errorDetalles;
    for (const item of detalles) {
      const { data: prodActual, error: errConsulta } = await supabase
        .from('producto')
        .select('stock').eq('id_producto', item.id_producto).single();
      if (errConsulta) throw errConsulta;

      const nuevoStock = prodActual.stock + item.cantidad;

      const { error: errUpdateStock } = await supabase
        .from('producto')
        .update({ stock: nuevoStock }).eq('id_producto', item.id_producto);
      if (errUpdateStock) throw errUpdateStock;
    }

    res.json({ mensaje: "📦 ¡Camión recibido! Stock sumado a tu inventario." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// VERIFICAR ESTADO DE PAGO 
// ==========================================
app.get('/api/verificar-pago/:id_venta', async (req, res) => {
    try {
        const { id_venta } = req.params;
        
        const { data, error } = await supabase
            .from('venta')
            .select('estado_pago, metodo_pago, observacion, total, fecha_hora')
            .eq('id_venta', id_venta)
            .single();
            
        if (error) throw error;
        
        res.json({
            estado_pago: data.estado_pago,
            metodo_pago: data.metodo_pago,
            observacion: data.observacion,
            total: data.total,
            fecha: data.fecha_hora
        });
    } catch (error) {
        console.error("Error al verificar pago:", error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ACTUALIZAR PAGO 
// ==========================================
app.put('/api/confirmar-pago/:id_venta', async (req, res) => {
    try {
        const { id_venta } = req.params;
        const { comprobante_pago, observacion } = req.body;
        
        const { data, error } = await supabase
            .from('venta')
            .update({ 
                estado_pago: 'Completado',
                observacion: `Pago confirmado - ${new Date().toISOString()} - ${observacion || 'Sin observaciones'}`
            })
            .eq('id_venta', id_venta)
            .select();
            
        if (error) throw error;
        
        res.json({ 
            mensaje: "✅ Pago confirmado exitosamente",
            venta: data 
        });
    } catch (error) {
        console.error("Error al confirmar pago:", error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// OBTENER VENTAS POR USUARIO 
// ==========================================
app.get('/api/mis-compras/:id_usuario', async (req, res) => {
    try {
        const { id_usuario } = req.params;
        
        const { data, error } = await supabase
            .from('venta')
            .select(`
                id_venta,
                fecha_hora,
                total,
                tipo_venta,
                estado_pago,
                metodo_pago,
                observacion,
                detalle_venta (
                    cantidad,
                    sub_total,
                    producto (
                        nombre_producto,
                        precio_venta
                    )
                )
            `)
            .eq('id_usuario', id_usuario)
            .order('fecha_hora', { ascending: false });
            
        if (error) throw error;
        
        res.json(data);
    } catch (error) {
        console.error("Error al obtener historial de compras:", error);
        res.status(500).json({ error: error.message });
    }
});
// ==========================================
// ELIMINACIÓN LÓGICA DE USUARIOS
// ==========================================
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('usuario')
            .update({ estado: false }) 
            .eq('id_usuario', id)
            .select();

        if (error) throw error;
        
        res.json({ mensaje: '🚫 Cuenta de usuario suspendida lógicamente', data });
    } catch (error) {
        console.error("Error al suspender usuario:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
