"use client";

import { useEffect, useState } from "react";
import Logo from "../Logo";
import MobileOffcanvas from "@/components/MobileOffcanvas";
import { fetchConvocatorias } from "@/services/convocatoria"; // <-- asegúrate de tener esta función disponible

export default function HeaderMiddle() {
  const [estadoConvocatoria, setEstadoConvocatoria] = useState("Cargando...");

  useEffect(() => {
    const verificarConvocatorias = async () => {
      try {
        const data = await fetchConvocatorias();
        const hayVigentes = data.some((c) => {
          if (!c.fecha_cierre) return false;
          const ahora = new Date();
          const cierre = new Date(`${c.fecha_cierre}T23:59:59-05:00`);
          return cierre > ahora;
        });
        setEstadoConvocatoria(hayVigentes ? "Vigente" : "Cerradas");
      } catch (error) {
        console.error("Error verificando convocatorias:", error);
        setEstadoConvocatoria("Error");
      }
    };

    verificarConvocatorias();
  }, []);

  return (
    <div className="middle-header">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-3 col-12 mobile-menu-sticky">
            <Logo />
            <MobileOffcanvas />
          </div>
          <div className="col-lg-9 col-md-9 col-12">
            <div className="widget-main">
              <div className="single-widget">
                <a 
                  >
                  <i className="icofont-briefcase"></i>
                </a>
                <p>Convocatoria</p>
                <h4>{estadoConvocatoria}</h4>
              </div>

              <div className="single-widget">
                <a
                  href="#"
                  rel="noopener noreferrer"
                  style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
                >
                  <i className="icofont-support"></i>
                </a>
                <p>Mesa de Partes</p>
                <h4>Lun-Vie: 8:30-18:00</h4>
              </div>

              <div className="single-widget">
                <a
                  href="https://www.transparencia.gob.pe/enlaces/pte_transparencia_enlaces.aspx?id_entidad=11811"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
                >
                  <i className="icofont-search"></i>
                </a>
                <p>Portal de</p>
                <h4>Transparencia</h4>
              </div>

              <div className="single-widget">
                <a
                  href="https://www.gob.pe/muniespinar"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
                >
                  <i className="icofont-university"></i>
                </a>
                <p>Portal</p>
                <h4>Gob.pe</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
