import FeatureCard from "@/components/FeatureCard";
import SectionHead from "@/components/SectionHead";

export default function Features(props) {
  const { sectionName } = props;

  return (
    <>
      <section className={sectionName ? sectionName : "Feautes section"}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <SectionHead
                title="Protección y vigilancia Comunitaria"
                desc="Trabajamos con la comunidad para fortalecer la seguridad en barrios y sectores, promoviendo la vigilancia vecinal y la prevención del delito"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-12">
              <FeatureCard
                cardClass="single-features"
                icon="icofont icofont-ui-call"
                title="Llamado de emergencia"
                desc="Atendemos reportes ciudadanos las 24 horas del día a través de nuestra central telefónica, canalizando alertas a Serenazgo, Policía o primeros auxilios."
              />
            </div>
            <div className="col-lg-4 col-12">
              <FeatureCard
                cardClass="single-features"
                icon="icofont icofont-police-car"
                title="Patrullaje integrado"
                desc="Coordinamos acciones entre Serenazgo y la PNP para fortalecer la vigilancia en zonas estratégicas, priorizando horarios y sectores con mayor incidencia."
              />
            </div>
            <div className="col-lg-4 col-12">
              <FeatureCard
                cardClass="single-features last"
                icon="icofont icofont-people"
                title="Respuesta ante delitos o emergencias"
                desc="Brindamos atención rápida y articulada frente a situaciones de riesgo, delitos o urgencias médicas, activando protocolos de seguridad comunitaria."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
