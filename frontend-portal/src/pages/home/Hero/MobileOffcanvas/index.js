"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Offcanvas } from "react-bootstrap";

/* import Logo from "../../../public/img/logo5.png"; */

export default function MobileOffcanvas() {
  const pathname = usePathname();

  const [show, setShow] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Function to toggle the sub-menu
  const toggleSubMenu = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  // Function to check if a menu item is active
  const isActive = (path) => pathname === path;

  return (
    <>
      <button
        type="button"
        onClick={handleShow}
        className="mobile-menu-offcanvas-toggler"
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>

      {/* <!-- Mobile Menu Modal --> */}
      <Offcanvas show={show} onHide={handleClose} className="mobile-menu-modal">
        <div className="modal-dialog offcanvas-dialog">
          <div className="modal-content">
            <div className="modal-header offcanvas-header">
              <div className="offcanvas-logo">
                <Link href="/">
                  {/* <Image src={Logo} alt="#" width={134} height={50} /> */}
                </Link>
              </div>
              <button type="button" className="btn-close" onClick={handleClose}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="mobile-menu-modal-main-body">
              {/* Offcanvas Menu */}
              <nav id="offcanvas-menu" className="navigation offcanvas-menu">
                <ul id="nav" className="list-none offcanvas-men-list">
                  <li>
                    <Link
                      className="menu-arrow"
                      onClick={() => toggleSubMenu(1)}
                      href="/"
                    >
                      Home <i className="icofont-rounded-down"></i>
                    </Link>                    
                  </li>
                  <li>
                    <Link
                      className="menu-arrow"
                      onClick={() => toggleSubMenu(2)}
                      href="#"
                    >
                      Municipalidad <i className="icofont-rounded-down"></i>
                    </Link>
                    <ul
                      className={`sub-menu ${openSubMenu === 2 ? "open" : ""}`}
                    >
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/municipalidad/directorio") ? "active" : ""}`}
                          href="/municipalidad/directorio"
                        >
                          Directorio
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/municipalidad/organigrama") ? "active" : ""
                          }`}
                          href="/municipalidad/organigrama"
                        >
                          Organigrama
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/municipalidad/doc-gestion") ? "active" : ""
                          }`}
                          href="/municipalidad/doc-gestion"
                        >
                          Documentos de Gestión
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/municipalidad/normas-emitidas") ? "active" : ""
                          }`}
                          href="/municipalidad/normas-emitidas"
                        >
                          Normas Emitidas
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link
                      className="menu-arrow"
                      onClick={() => toggleSubMenu(3)}
                      href="#"
                    >
                      Servicios <i className="icofont-rounded-down"></i>
                    </Link>
                    <ul
                      className={`sub-menu ${openSubMenu === 3 ? "open" : ""}`}
                    >
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/service") ? "active" : ""}`} 
                          href="/service"
                        >
                          Service
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${
                            isActive("/service-details") ? "active" : ""
                          }`}
                          href="/service-details"
                        >
                          Service Details
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link
                      className="menu-arrow"
                      onClick={() => toggleSubMenu(4)}
                      href="#"
                    >
                      Bolsa de Trabajo <i className="icofont-rounded-down"></i>
                    </Link>
                    <ul
                      className={`sub-menu ${openSubMenu === 4 ? "open" : ""}`}
                    >
                      <li>
                        <Link
                          onClick={handleClose}
                          className={` ${isActive("/bolsa-de-trabajo/convocatoria") ? "active" : ""}`}
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
            {/* Mobile menu modal bottom */}
            <div className="mobile-menu-modal-bottom">
              <Link href="/appointment" className="btn" onClick={handleClose}>
                Appointment
              </Link>
            </div>
          </div>
        </div>
      </Offcanvas>
      {/* <!-- End Mobile Menu Modal --> */}
    </>
  );
}
