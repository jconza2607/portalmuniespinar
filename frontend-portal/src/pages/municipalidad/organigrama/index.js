'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Footer from "@/components/Footer";
import HeaderTwo from "@/components/Header/HeaderTwo";
import Preloader from "@/components/Preloader";
import ScrollTop from "@/components/ScrollTop";
import { getOrganigramas } from '@/services/organigrama';
import Breadcrumbs from '@/components/Breadcrumbs';

// Evitar SSR en componentes gráficos
const Tree = dynamic(() => import('react-organizational-chart').then(mod => mod.Tree), { ssr: false });
const TreeNode = dynamic(() => import('react-organizational-chart').then(mod => mod.TreeNode), { ssr: false });

// Estilo de nodo visual
const Node = ({ label }) => (
  <div style={{
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "2px 4px",
    display: "inline-block",
    backgroundColor: "#f0f9ff",
    fontWeight: 500,
    fontSize: "10px",
  }}>
    {label}
  </div>
);

export default function OrganigramaPage() {
  const [organigrama, setOrganigrama] = useState([]);
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
    const fetchOrganigrama = async () => {
      try {
        const data = await getOrganigramas();
        setOrganigrama(data);
      } catch (error) {
        console.error("Error al cargar organigrama:", error);
      }
    };
    fetchOrganigrama();
  }, []);

  // Recursividad para construir el árbol
  const renderTree = (nodes) => {
    return nodes.map((node) => (
      <TreeNode key={node.id} label={<Node label={node.nombre} />}>
        {node.children_recursive && renderTree(node.children_recursive)}
      </TreeNode>
    ));
  };

  if (!client || organigrama.length === 0) return null;

  return (
    <>
    <Breadcrumbs title="Organigrama" menuText="Municipalidad" />
      <div className="container py-5">
        <h2 className="text-center mb-4">ORGANIGRAMA DE LA MUNICIPALIDAD PROVINCIAL DE ESPINAR</h2>
        <div style={{ overflowX: 'auto' }}>
          <Tree label={<Node label="Concejo Municipal" />}>
            {renderTree(organigrama)}
          </Tree>
        </div>
      </div>
    </>
  );
}

OrganigramaPage.getLayout = function (page) {
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
