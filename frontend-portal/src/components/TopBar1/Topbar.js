'use client';

export default function Topbar({ onToggleSidebar }) {
  return (
    <>
      {/* Barra azul */}
      <div className="topbar-blue">
        <button className="btn text-white hamburger-btn me-2" onClick={onToggleSidebar}>
          <i className="icofont-navigation-menu fs-4" />
        </button>

        <div className="search-box me-auto">
          <i className="icofont-search" />
          <input type="text" placeholder="Search" />
        </div>

        <div className="topbar-icons d-flex align-items-center gap-2">
          <span className="rounded-circle bg-light text-dark px-2">FR</span>
          <i className="icofont-star" />
          <i className="icofont-chart-bar-graph" />
          <i className="icofont-calendar" />
          <div className="avatar-wrapper">
            <img src="/img/user.png" className="avatar-top" alt="user" />
            <span className="status-dot bg-success" />
          </div>
        </div>
      </div>    
    </>
  );
}
