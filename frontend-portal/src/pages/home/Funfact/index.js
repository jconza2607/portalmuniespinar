import FunfactCard from "@/components/FunfactCard";

export default function Funfact() {
  return (
    <>
      <div id="fun-facts" className="fun-facts section overlay">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-12">
              <FunfactCard
                icon="icofont icofont-home"
                number="3468"
                desc="visitas"
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <FunfactCard
                icon="icofont icofont-download"
                number="557"
                desc="descargas"
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <FunfactCard
                icon="icofont-like"
                number="4379"
                desc="likes"
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <FunfactCard
                icon="icofont icofont-table"
                number="107"
                desc="años de vida"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
