function Contactenos() {
    return (
        <div className="container mt-3">
            <h2>Contáctenos</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre:</label>
                    <input type="text" className="form-control" id="nombre" placeholder="Ingrese su nombre" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico:</label>
                    <input type="email" className="form-control" id="email" placeholder="Ingrese su correo electrónico" />
                </div>
                <div className="mb-3">
                    <label htmlFor="mensaje" className="form-label">Mensaje:</label>
                    <textarea className="form-control" id="mensaje" rows="4" placeholder="Escriba su mensaje aquí"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        </div>
    );
}

export default Contactenos;