import Link from "next/link";

export default function CallAction() {
  return (
    <>
      <section className="call-action overlay">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-12">
              <div className="content">
                <h2>Atención a la Ciudadanía</h2>
                <p>
                ¿Tienes una solicitud o reclamo? Comunícate con nuestra Plataforma de Atención al Ciudadano.
                📍 Acércate de 🕐 Lunes a viernes de 8:00 a.m. a 6:00 p.m.
                </p>
                {/* <div className="button">
                  <Link href="/contact" className="btn">
                    Contact Now
                  </Link>
                  <Link href="/about" className="btn second">
                    Learn More<i className="fa fa-long-arrow-right"></i>
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
