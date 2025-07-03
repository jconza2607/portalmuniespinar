// pages/visionmision.js
import Image from "next/image";
import Preloader from "@/components/Preloader";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderTwo from "@/components/Header/HeaderTwo";
import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";
import { getInstitucionalPublic } from "@/services/institucional";

export default function VisionMisionPage({ institucional }) {
  return (
    <>
      <Breadcrumbs title="Visión y Misión" menuText="Municipalidad" />

      <div className="doctor-details-area section">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="doctor-details-item doctor-details-left">
                {institucional?.imagen ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${institucional.imagen}`}
                    alt="Imagen institucional"
                    width={479}
                    height={551}
                  />
                ) : (
                  <Image
                    src="/img/doctor-detail.jpg"
                    alt="Por defecto"
                    width={479}
                    height={551}
                  />
                )}
              </div>
            </div>
            <div className="col-lg-7">
              <div className="doctor-details-item">
                <div className="doctor-details-right">
                  <div className="doctor-name">
                    <h3 className="name">Municipalidad Provincial de Espinar</h3>
                  </div>
                  <div className="doctor-details-biography">
                    <h3>Visión</h3>
                    <p>{institucional?.vision || "No disponible"}</p>
                  </div>
                  <div className="doctor-details-biography">
                    <h3>Misión</h3>
                    <p>{institucional?.mision || "No disponible"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const institucional = await getInstitucionalPublic();
    return { props: { institucional } };
  } catch (error) {
    console.error("Error al obtener institucional:", error.message);
    return { props: { institucional: null } };
  }
}

VisionMisionPage.getLayout = function (page) {
  return (
    <>
      <Preloader />
      <HeaderTwo />
      <main>{page}</main>
      <Footer />
      <ScrollTop />
    </>
  );
};
