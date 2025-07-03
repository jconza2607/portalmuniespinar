"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TeamCard from "@/components/TeamCard";
import Preloader from "@/components/Preloader";
import HeaderTwo from "@/components/Header/HeaderTwo";
import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";

import { getDirectoriosPublic } from "@/services/directorio";

import DefaultImage from "../../../../public/img/team1.jpg"; // imagen por defecto

export default function DirectorioPage() {
  const [directorios, setDirectorios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDirectoriosPublic();
        setDirectorios(data.filter((d) => d.activo));
      } catch (err) {
        console.error("Error cargando directorios", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);  

  return (
    <>
      <Breadcrumbs title="Directorio Telefónico" menuText="Municipalidad" />

      <section id="team" className="team section single-page">
        <div className="container">
          <div className="row">
            {loading ? (
              <p>Cargando...</p>
            ) : directorios.length === 0 ? (
              <p>No hay directorio disponible.</p>
            ) : (
              directorios.map((item) => (
                <div key={item.id} className="col-lg-4 col-md-6 col-12 mb-4">
                  <TeamCard
                    tilt="tilt-disable"
                    image={item.foto ? `http://localhost:8000/storage/${item.foto}` : DefaultImage}
                    designation={item.cargo}
                    name={item.nombre}
                    telefono={item.telefono}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

DirectorioPage.getLayout = function (page) {
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
