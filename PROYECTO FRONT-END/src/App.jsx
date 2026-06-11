import { useState } from 'react'
import NuevoProducto from './componentes/NuevoProducto'
import RegistroCliente from "./componentes/RegistroCliente";
import HistorialVentas from "./componentes/HistorialVentas";
import RealizarPedido from './componentes/RealizarPedido'
import GestionPedidos from './componentes/GestionPedidos'
import Carrito from "./componentes/Carrito";
import "./App.css";
import Header from "./componentes/Header";
import Inicio from './componentes/Inicio'
import Productos from './componentes/Productos'
import Contactenos from './componentes/Contactenos'
import Acercade from './componentes/Acercade'
import Error404 from './componentes/Error404'
import Login from './Login' 

import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/historial" element={<HistorialVentas />} />
          <Route exact path="/login"       element={<Login />} />
          <Route path="/registro" element={<RegistroCliente />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pedidos" element={<RealizarPedido />} />
          <Route path="/gestion-pedidos" element={<GestionPedidos />} />
          <Route exact path="/"            element={<Inicio />} />
          <Route exact path="/productos"   element={<Productos />} />
          <Route path="/nuevo-producto" element={<NuevoProducto />} />
          <Route exact path="/contactenos" element={<Contactenos />} />
          <Route exact path="/acercade"    element={<Acercade />} />
          <Route path='*'                  element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;