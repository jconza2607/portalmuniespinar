import SectionHead from "@/components/SectionHead";
import Sliders from "./Sliders";

export default function Portfolio() {
  return (
    <>
      <section className="portfolio section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <SectionHead
                title="Últimas Noticias de la Municipalidad Provincial de Espinar"
                desc="Infórmate sobre las acciones más recientes que realiza la Municipalidad Provincial de Espinar: acuerdos, actividades oficiales, campañas sociales y avances de obras al servicio de la población."
              />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-12">
              <Sliders />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
