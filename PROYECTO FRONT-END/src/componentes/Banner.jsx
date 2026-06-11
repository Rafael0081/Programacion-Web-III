import b1 from '../imagenes/GArroz50g.png'
import b2 from '../imagenes/Filipitos200g.png'
import b3 from '../imagenes/PACEÑA620ML.png'

function Banner() {
    return (
        <div className="container py-4">
            {/* Carrusel */}
            <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="false">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>

                <div className="carousel-inner" style={{ backgroundColor: '#f8f9fa', borderRadius: '15px' }}>
                    {/* SLIDE 1 */}
                    <div className="carousel-item active">
                        <img src={b1} className="d-block m-auto" style={{ height: '400px', objectFit: 'contain' }} alt="Grageas de Arroz" />
                        <div className="carousel-caption d-none d-md-block" style={{ position: 'absolute', bottom: '0', left: 0, right: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)', paddingBottom: '20px' }}>
                            <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px' }}>ELCEIBO</h3>
                            <h5 style={{ color: '#ffc107', fontSize: '28px', fontWeight: 'bold' }}>Gragéas de Arroz</h5>
                        </div>
                    </div>

                    {/* SLIDE 2 */}
                    <div className="carousel-item">
                        <img src={b2} className="d-block m-auto" style={{ height: '400px', objectFit: 'contain' }} alt="Filipitos" />
                        <div className="carousel-caption d-none d-md-block" style={{ position: 'absolute', bottom: '0', left: 0, right: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)', paddingBottom: '20px' }}>
                            <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px' }}>ELCEIBO</h3>
                            <h5 style={{ color: '#ffc107', fontSize: '28px', fontWeight: 'bold' }}>Filipitos</h5>
                        </div>
                    </div>

                    {/* SLIDE 3 */}
                    <div className="carousel-item">
                        <img src={b3} className="d-block m-auto" style={{ height: '400px', objectFit: 'contain' }} alt="Paceña" />
                        <div className="carousel-caption d-none d-md-block" style={{ position: 'absolute', bottom: '0', left: 0, right: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)', paddingBottom: '20px' }}>
                            <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px' }}>PACEÑA</h3>
                            <h5 style={{ color: '#ffc107', fontSize: '28px', fontWeight: 'bold' }}>Contenido 620ml</h5>
                        </div>
                    </div>
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" style={{ filter: 'invert(1)' }}></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" style={{ filter: 'invert(1)' }}></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default Banner;