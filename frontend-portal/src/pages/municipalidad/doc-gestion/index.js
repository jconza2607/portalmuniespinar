"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { fetchDocGestion } from "@/services/docGestion";
import Footer from "@/components/Footer";
import HeaderTwo from "@/components/Header/HeaderTwo";
import Preloader from "@/components/Preloader";
import ScrollTop from "@/components/ScrollTop";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function DocGestion() {
  const [expandedItems, setExpandedItems] = useState([]);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDocGestion();
        setData(result);

        const initialPagination = {};
        result.forEach((cat) => {
          initialPagination[cat.id] = 1;
        });
        setPagination(initialPagination);
      } catch (err) {
        setError("Error al cargar los documentos de gestión.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccordionChange = (newExpandedItems) => {
    setExpandedItems(newExpandedItems);
  };

  const cambiarPagina = (catId, nuevaPagina) => {
    setPagination((prev) => ({
      ...prev,
      [catId]: nuevaPagina,
    }));
  };

  if (loading) return <p className="text-center my-4">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <Breadcrumbs title="Documentos de Gestión" menuText="Municipalidad" />
      <section className="faq-area section">
        <div className="container">
          {data.map((category) => {
            const currentPage = pagination[category.id] || 1;
            const start = (currentPage - 1) * pageSize;
            const visibleItems = category.items.slice(start, start + pageSize);
            const totalPages = Math.ceil(category.items.length / pageSize);

            return (
              <div className="row faq-wrap mb-5" key={category.id}>
                <div className="col-lg-12">
                  <div className="faq-head">
                    <h2>{category.name}</h2>
                  </div>

                  <div className="faq-item">
                    <Accordion
                      className="panel-group"
                      preExpanded={expandedItems}
                      onChange={handleAccordionChange}
                    >
                      {visibleItems.map((question) => (
                        <AccordionItem
                          className="panel panel-default"
                          key={question.id}
                          uuid={question.id.toString()}
                        >
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              {question.question}
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <p>{question.answer}</p>
                            {question.file_path && (
                              <div className="mt-2">
                                <a
                                  href={`http://localhost:8000/storage/${question.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  Ver documento PDF
                                </a>
                              </div>
                            )}
                          </AccordionItemPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination mt-4">
                      <ul className="pagination-list justify-center">
                        <li>
                          <Link
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1)
                                cambiarPagina(category.id, currentPage - 1);
                            }}
                            className={currentPage === 1 ? "disabled" : ""}
                          >
                            <i className="icofont-rounded-left"></i>
                          </Link>
                        </li>
                        {Array.from({ length: totalPages }).map((_, index) => (
                          <li
                            key={index}
                            className={currentPage === index + 1 ? "active" : ""}
                          >
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                cambiarPagina(category.id, index + 1);
                              }}
                            >
                              {index + 1}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages)
                                cambiarPagina(category.id, currentPage + 1);
                            }}
                            className={
                              currentPage === totalPages ? "disabled" : ""
                            }
                          >
                            <i className="icofont-rounded-right"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>    
  );
}

DocGestion.getLayout = function (page) {
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
