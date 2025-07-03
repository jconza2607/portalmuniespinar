"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderTwo from "@/components/Header/HeaderTwo";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import ScrollTop from "@/components/ScrollTop";
import { fetchConvocatorias } from "@/services/convocatoria";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Etiquetas por tipo de adjunto
const TIPO_LABELS = {
  base: "Bases",
  cronograma: "Cronograma",
  fe_derratas: "Fe de Erratas",
  perfil: "Perfiles",
  comunicado: "Comunicados",
  otro: "Resultado",
};

// Hook para cuenta regresiva
function useCountdown(fechaCierre) {
  const fechaConHora = `${fechaCierre}T23:59:59-05:00`; // Perú UTC-5
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(new Date(fechaConHora)));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(new Date(fechaConHora)));
    }, 1000);
    return () => clearInterval(timer);
  }, [fechaCierre]);

  return timeLeft;
}

// Calcula la diferencia entre ahora y la fecha objetivo
function calcTimeLeft(targetDate) {
  const total = new Date(targetDate) - new Date();
  if (total <= 0) return null;

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { days, hours, minutes, seconds };
}

/* ---------- PÁGINA ---------- */
export default function Convocatoria({ convocatorias }) {
  const [search, setSearch] = useState("");
  const [openCollapse, setOpenCollapse] = useState(null);

  const visibles = convocatorias.filter((c) =>
    c.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (collapseId) => {
    setOpenCollapse((prev) => (prev === collapseId ? null : collapseId));
  };

  return (
    <>
      <Breadcrumbs title="Convocatoria" menuText="Municipalidad" />

      <section className="py-5">
        <div className="container">
          <h2 className="mb-4">Convocatorias vigentes</h2>          

          {visibles.length === 0 ? (
            <p className="text-muted">No se encontraron resultados.</p>
          ) : (
            <div className="row g-4">
              {visibles.map((c) => {
                const agrupados = c.adjuntos.reduce((acc, a) => {
                  acc[a.tipo] = acc[a.tipo] || [];
                  acc[a.tipo].push(a);
                  return acc;
                }, {});

                const countdown = c.fecha_cierre ? useCountdown(c.fecha_cierre) : null;

                return (
                  <div key={c.id} className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{c.titulo}</h5>
                        <p className="small text-muted mb-2">
                          {c.descripcion_corta || "—"}
                        </p>

                        {c.fecha_cierre && countdown ? (
                          <p className="mb-2 text-danger">
                            ⏳ Cierra en{" "}
                            <strong>
                              {countdown.days}d {countdown.hours}h{" "}
                              {countdown.minutes}m {countdown.seconds}s
                            </strong>
                          </p>
                        ) : c.fecha_cierre ? (
                          <p className="mb-2 text-muted">🔔 Convocatoria cerrada</p>
                        ) : null}

                        <div id={`accordion-${c.id}`} className="w-100 mt-auto">
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            {Object.entries(agrupados).map(([tipo, adjuntos]) => {
                              const collapseId = `collapse-${c.id}-${tipo}`;
                              const label = TIPO_LABELS[tipo] || tipo;

                              return (
                                <button
                                  key={tipo}
                                  className={`btn btn-sm text-white px-2 py-1 fw-semibold border-0 ${
                                    openCollapse === collapseId ? "bg-dark" : "bg-secondary"
                                  }`}
                                  style={{ fontSize: "0.85rem" }}
                                  onClick={() => handleToggle(collapseId)}
                                >
                                  {label} ({adjuntos.length})
                                </button>
                              );
                            })}
                          </div>

                          {Object.entries(agrupados).map(([tipo, adjuntos]) => {
                            const collapseId = `collapse-${c.id}-${tipo}`;
                            if (openCollapse !== collapseId) return null;

                            return (
                              <div key={tipo} className="mb-2">
                                <ul className="list-unstyled mb-0 ps-3">
                                  {adjuntos.map((a) => (
                                    <li key={a.id}>
                                      <i className="bi bi-file-earmark-pdf me-1"></i>
                                      <a
                                        href={`${BACKEND}/storage/${a.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {a.titulo || "Ver archivo"}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* ---------- CARGA SSR ---------- */
export async function getStaticProps() {
  try {
    const convocatorias = await fetchConvocatorias();
    return { props: { convocatorias }, revalidate: 60 };
  } catch (e) {
    console.error(e);
    return { props: { convocatorias: [] }, revalidate: 30 };
  }
}

/* ---------- LAYOUT ---------- */
Convocatoria.getLayout = function (page) {
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
