'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTopbarPublic } from '@/services/topbar';

export default function Topbar() {
  const [topbar, setTopbar] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTopbarPublic();
        if (data && data.enabled) {
          setTopbar(data);
        }
      } catch (error) {
        console.error('No se pudo cargar el topbar:', error);
      }
    })();
  }, []);

  if (!topbar) return null;

  return (
    <div className="topbar">
      <div className="container">
        <div className="row">
          {/* Columna izquierda con links adicionales (puedes activar si quieres) */}
          <div className="col-lg-6 col-md-5 col-12">
            <ul className="top-link">
              {/* Ejemplos comentados
              <li>
                <Link href="/about">Nosotros</Link>
              </li>
              <li>
                <Link href="/contact">Contacto</Link>
              </li> */}
            </ul>
          </div>

          {/* Columna derecha con contacto */}
          <div className="col-lg-6 col-md-7 col-12">
            <ul className="top-contact">              
              {topbar.email && (
                <li>
                  <i className="fa fa-envelope"></i>
                  <Link href={`mailto:${topbar.email}`}>
                    {topbar.email}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
