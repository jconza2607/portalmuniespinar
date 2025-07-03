import Script from "next/script";
import Head from "next/head";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";

import Topbar from "@/components/TopBar1/Topbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Preloader from "@/components/Preloader";
import ColorLayout from "@/components/ColorPlate/ColorLayout";

// Fuentes y CSS globales
import { Poppins } from "next/font/google";
import "../../public/css/bootstrap.min.css";
import "../../public/css/font-awesome.min.css";
import "../../public/css/icofont.css";
import "animate.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "react-modal-video/css/modal-video.min.css";
import "./globals.css";

// Fuente principal
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// Rutas donde NO se debe mostrar sidebar/topbar
const ocultarSidebarEn = ["/", "/login"];

function LayoutConSidebar({ children }) {
  const pathname = usePathname();
  const mostrarSidebar = !ocultarSidebarEn.includes(pathname);
  const [open, setOpen] = useState(false);

  if (!mostrarSidebar) return children;

  return (
    <div className="dashboard-wrapper">
      {/* Topbar */}
      <Topbar onToggleSidebar={() => setOpen(!open)} />

      {/* Sidebar + Contenido principal */}
      <div className="dashboard-body">
        <Sidebar visible={open} onClose={() => setOpen(false)} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps }) {
  const is404 = Component.name === "NotFound";

  // Permitir que una página defina su propio layout, sino usa el layout con sidebar
  const getLayout =
    Component.getLayout || ((page) => <LayoutConSidebar>{page}</LayoutConSidebar>);

  return (
    <>
      <Head>
        <title>Municipalidad Provincial de Espinar</title>
        <meta name="description" content="Municipalidad Provincial de Espinar" />
        <link rel="icon" href="/img/favicon.ico" />
      </Head>

      <AuthProvider>
        <Preloader />
        <ColorLayout />

        {/* Render dinámico con o sin layout */}
        {is404 ? (
          <Component {...pageProps} />
        ) : (
          getLayout(<Component {...pageProps} />)
        )}

        {/* Script de Bootstrap */}
        {/* <Script src="/js/bootstrap.min.js" /> */}
        <Script src="/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
        
      </AuthProvider>
    </>
  );
}
