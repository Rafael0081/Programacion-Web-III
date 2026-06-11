import c1 from '../imagenes/LogoTienda.png';

function Acercade() {
    return (

        <div>

            <div className="container mt-5">
                <div className="card shadow-lg p-4">
                    <div className="row align-items-center">
                        <div className="col-md-4 text-center mb-3 mb-md-0">
                            <img src={c1} alt="Foto del desarrollador" className="img-fluid rounded-circle border border-dark"
                            />
                        </div>

                        <div className="col-md-8">
                            <h1 className="mb-3">Acerca de...</h1>
                            <ul className="list-unstyled">
                                <li><h4><strong>Desarrollador:</strong> Rafael Kevin Apaza Quispe</h4></li>
                                <li><h4><strong>Carrera:</strong> Informatica-Programacion Web 2</h4></li>
                                <li><h4><strong>Jornada:</strong> Tarde</h4></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Acercade;