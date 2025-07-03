"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <div className="main-menu">
        <nav className="navigation">
          <ul className="nav menu">
            <li>
              <Link href="/">
                Home
              </Link>
              
            </li>
            <li>
              <Link href="#">
                Municipalidad <i className="icofont-rounded-down"></i>
              </Link>
              <ul className="dropdown">
                <li>
                  <Link
                    className={` ${pathname === "/municipalidad/visionmision" ? "active" : ""}`}
                    href="/municipalidad/visionmision"
                  >
                    Visión y Misión
                  </Link>
                </li>
                <li>
                  <Link
                    className={` ${
                      pathname === "/municipalidad/directorio" ? "active" : ""
                    }`}
                    href="/municipalidad/directorio"
                  >
                    Directorio
                  </Link>
                </li>
                <li>
                  <Link
                    className={` ${
                      pathname === "/municipalidad/organigrama" ? "active" : ""
                    }`}
                    href="/municipalidad/organigrama"
                  >
                    Organigrama
                  </Link>
                </li>
                <li>
                  <Link
                    className={` ${
                      pathname === "/municipalidad/doc-gestion" ? "active" : ""
                    }`}
                    href="/municipalidad/doc-gestion"
                  >
                    Documentos de Gestión
                  </Link>
                </li>
                <li>
                  <Link
                    className={` ${
                      pathname === "/municipalidad/normas-emitidas" ? "active" : ""
                    }`}
                    href="/municipalidad/normas-emitidas"
                  >
                    Normas Emitidas
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="#">
                Servicios <i className="icofont-rounded-down"></i>
              </Link>
              <ul className="dropdown">
                <li>
                  <Link
                    className={` ${pathname === "/service" ? "active" : ""}`}
                    href="/service"
                  >
                    Service
                  </Link>
                </li>
                <li>
                  <Link
                    className={` ${
                      pathname === "/service-details" ? "active" : ""
                    }`}
                    href="/service-details"
                  >
                    Service Details
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="#">
                Bolsa de Trabajo <i className="icofont-rounded-down"></i>
              </Link>
              <ul className="dropdown">
                <li>
                  <Link
                    className={` ${pathname === "/bolsa-de-trabajo/convocatoria" ? "active" : ""}`}
                    href="/bolsa-de-trabajo/convocatoria"
                  >
                    Convocatoria
                  </Link>
                </li>                
              </ul>
            </li>            
          </ul>
        </nav>
      </div>
    </>
  );
}
