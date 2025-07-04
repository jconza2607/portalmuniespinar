"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderTwo from "@/components/Header/HeaderTwo";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import ScrollTop from "@/components/ScrollTop";
import { fetchConvocatorias } from "@/services/convocatoria";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const TIPO_LABELS = {
  base: "Bases",
  cronograma: "Cronograma",
  fe_derratas: "Fe de Erratas",
  perfil: "Perfiles",
  comunicado: "Comunicados",
  otro: "Resultado",
};

/* -------------------- HOOK CUENTA REGRESIVA -------------------- */
function useCountdown(fechaCierre) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // Si no hay fecha, dejamos el estado a null y salimos.
    if (!fechaCierre) {
      setTimeLeft(null);
      return;
    }

    const target = new Date(`${fechaCierre}T23:59:59-05:00`);
    const tick = () => setTimeLeft(calcTimeLeft(target));

    tick(); // primer cálculo inmediato
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [fechaCierre]);

  return timeLeft;
}

function calcTimeLeft(targetDate) {
  const diff = targetDate - new Date();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

/* -------------------- CARD -------------------- */
function CardConvocatoria({ c, open, toggle }) {
  const countdown = useCountdown(c.fecha_cierre);

  const agrupados = c.adjuntos.reduce((acc, a) => {
    (acc[a.tipo] ||= []).push(a);
    return acc;
  }, {});

  return (
    <div className="col-md-6">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{c.titulo}</h5>
          <p className="small text-muted mb-2">{c.descripcion_corta || "—"}</p>

          {countdown ? (
            <p className="mb-2 text-danger">
              ⏳ Cierra en{" "}
              <strong>
                {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
                {countdown.seconds}s
              </strong>
            </p>
          ) : c.fecha_cierre ? (
            <p className="mb-2 text-muted">🔔 Convocatoria cerrada</p>
          ) : null}

          {/* ---------- Adjuntos ---------- */}
          <div id={`accordion-${c.id}`} className="w-100 mt-auto">
            <div className="d-flex flex-wrap gap-2 mb-3">
              {Object.entries(agrupados).map(([tipo, adj]) => {
                const id = `col-${c.id}-${tipo}`;
                const label = TIPO_LABELS[tipo] || tipo;
                return (
                  <button
                    key={tipo}
                    className={`btn btn-sm text-white px-2 py-1 fw-semibold border-0 ${
                      open === id ? "bg-dark" : "bg-secondary"
                    }`}
                    style={{ fontSize: "0.85rem" }}
                    onClick={() => toggle(id)}
                  >
                    {label} ({adj.length})
                  </button>
                );
              })}
            </div>

            {Object.entries(agrupados).map(([tipo, adj]) => {
              const id = `col-${c.id}-${tipo}`;
              if (open !== id) return null;
              return (
                <div key={tipo}>
                  <ul className="list-unstyled mb-0 ps-3">
                    {adj.map((a) => (
                      <li key={a.id}>
                        <i className="bi bi-file-earmark-pdf me-1" />
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
}

/* -------------------- PÁGINA -------------------- */
export default function Convocatoria({ convocatorias }) {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((p) => (p === id ? null : id));

  const vigentes = convocatorias.filter((c) => c.activo);

  return (
    <>
      <Breadcrumbs title="Convocatoria" menuText="Municipalidad" />

      <section className="py-5">
        <div className="container">
          <h2 className="mb-4">Convocatorias vigentes</h2>

          {vigentes.length === 0 ? (
            <p className="text-muted">No se encontraron resultados.</p>
          ) : (
            <div className="row g-4">
              {vigentes.map((c) => (
                <CardConvocatoria
                  key={c.id}
                  c={c}
                  open={openId}
                  toggle={toggle}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* -------------------- CARGA SSR -------------------- */
export async function getStaticProps() {
  try {
    const convocatorias = await fetchConvocatorias();
    return { props: { convocatorias }, revalidate: 60 };
  } catch (e) {
    console.error(e);
    return { props: { convocatorias: [] }, revalidate: 30 };
  }
}

/* -------------------- LAYOUT -------------------- */
Convocatoria.getLayout = (page) => (
  <>
    <Preloader />
    <HeaderTwo />
    <main>{page}</main>
    <Footer />
    <ScrollTop />
  </>
);
