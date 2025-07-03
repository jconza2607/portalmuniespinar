import SectionHead from "@/components/SectionHead";
import SectionImg from "../../../../public/img/section-img2.png";
import Sliders from "./Sliders";

export default function Testimonial() {
  return (
    <>
      <section className="section testimonials overlay">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <SectionHead
                title="Lo Que Dicen Nuestros Ciudadanos Sobre la Municipalidad"
                img={SectionImg}
              />
            </div>
          </div>
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
