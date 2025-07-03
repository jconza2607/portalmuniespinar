'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AvatarImage from './AvatarImage';
import LogoEspinar from './LogoEspinar';
import { fetchMenu } from '@/services/menu';

export default function Sidebar({ visible, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const [menus, setMenus] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  // Obtener menús de la API
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMenu(); // padres con children
        setMenus(data);
      } catch (err) {
        console.error('Error al cargar menús:', err);
      }
    })();
  }, []);

  const normalize = (href = '') => '/' + href.replace(/^\/+/, '');
  const isActive = (href) =>
    pathname === normalize(href) || pathname.startsWith(normalize(href) + '/');

  // Abrir automáticamente el menú correspondiente a la ruta actual
  useEffect(() => {
    if (!menus.length) return;

    const activeChild = menus
      .flatMap((m) => m.children || [])
      .find((c) => isActive(c.href));

    if (activeChild) {
      setOpenMenu(activeChild.parent_id);
      return;
    }

    const activeParent = menus.find((m) => isActive(m.href));
    if (activeParent) {
      setOpenMenu(activeParent.id);
      return;
    }

    setOpenMenu(null);
  }, [pathname, menus]);

  const handleToggle = (id) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  const getIcon = (icon) => icon || 'icofont-ui-home';
  const closeMobile = () => onClose && onClose();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <aside className={`sidebar ${visible ? 'show' : ''}`}>
      <button className="btn btn-light d-lg-none mb-3" onClick={onClose}>
        ×
      </button>

      <div className="brand-header d-flex align-items-center mb-3">
        <LogoEspinar />
      </div>

      <div className="sidebar-divider" />

      <div className="user-section text-center mb-3">
        <AvatarImage />
        <h6 className="user-name">Jose L. Conza</h6>
        <small className="user-role">Administrador</small>
      </div>

      <div className="sidebar-divider" />

      <ul className="nav flex-column">
        {menus.map((parent) => {
          const hasKids = parent.children?.length > 0;
          const sectionActive =
            isActive(parent.href) ||
            parent.children?.some((c) => isActive(c.href));

          return (
            <li key={parent.id}>
              {hasKids ? (
                <>
                  <button
                    className={`nav-link w-100 text-start ${
                      sectionActive ? 'active' : ''
                    }`}
                    onClick={() => handleToggle(parent.id)}
                  >
                    <i className={getIcon(parent.icon)} /> {parent.label}
                  </button>

                  {openMenu === parent.id && (
                    <div className="submenu">
                      {parent.children.map((child) => (
                        <Link
                          key={child.id}
                          href={normalize(child.href)}
                          className={isActive(child.href) ? 'active' : ''}
                          onClick={closeMobile}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={normalize(parent.href)}
                  className={`nav-link ${sectionActive ? 'active' : ''}`}
                  onClick={closeMobile}
                >
                  <i className={getIcon(parent.icon)} /> {parent.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* Separador visual */}
      <div className="sidebar-divider" />

      {/* Botón cerrar sesión */}
      <div className="text-center mt-3 px-3">
        <button className="btn w-100" onClick={handleLogout}>
          <i className="icofont-logout me-2" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
