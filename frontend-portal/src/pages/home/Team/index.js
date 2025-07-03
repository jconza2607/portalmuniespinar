"use client";

import { useEffect, useState } from "react";
import SectionHead from "@/components/SectionHead";
import TeamCard from "@/components/TeamCard";
import SectionImg from "../../../../public/img/section-img2.png";
import TeamImg1 from "../../../../public/img/team1.jpg";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { getDirectoriosPublic } from "@/services/directorio";

export default function Team() {
  const [autoridades, setAutoridades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAutoridades = async () => {
      try {
        const data = await getDirectoriosPublic();
        const filtradas = Array.isArray(data)
          ? data.filter((item) => item.autoridad && item.activo)
          : [];
        setAutoridades(filtradas);
      } catch (err) {
        console.error("Error al cargar autoridades:", err);
        setAutoridades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAutoridades();
  }, []);

  const renderCard = (item) => (
    <div className="col-lg-3 col-md-6 col-12" key={item.id}>
      <TeamCard
        image={item.foto ? `/storage/${item.foto}` : TeamImg1.src}
        name={item.nombre}
        designation={item.cargo}
        telefono={item.telefono}
      />
    </div>
  );

  return (
    <section id="team" className="team section overlay">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <SectionHead
              img={SectionImg}
              title="Nuestras Autoridades"
              desc="Conoce al equipo que lidera la gestión municipal en favor del desarrollo de Espinar"
            />
          </div>
        </div>

        <div className="row">
          {loading ? (
            <p className="text-center">Cargando autoridades...</p>
          ) : autoridades.length === 0 ? (
            <p className="text-center">No hay autoridades registradas.</p>
          ) : autoridades.length <= 4 ? (
            autoridades.map(renderCard)
          ) : (
            <div className="col-12">
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={30}
                slidesPerView={4}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  576: { slidesPerView: 2 },
                  992: { slidesPerView: 3 },
                  1200: { slidesPerView: 4 },
                }}
              >
                {autoridades.map((item) => (
                  <SwiperSlide key={item.id}>
                    <TeamCard
                      image={item.foto ? `http://localhost:8000/storage/${item.foto}` : TeamImg1.src}
                      name={item.nombre}
                      designation={item.cargo}
                      telefono={item.telefono}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
