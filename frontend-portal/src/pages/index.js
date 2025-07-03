import Footer from "@/components/Footer";
import Hero from "./home/Hero";
import Schedule from "./home/Schedule";
import HeaderTwo from "@/components/Header/HeaderTwo";
import Newsletter from "@/components/Newsletter";
import ScrollTop from "@/components/ScrollTop";
import Features from "./home/Features";
import Funfact from "./home/Funfact";
import WhyChoose from "./home/WhyChoose";
import CallAction from "./home/CallAction";
import Portfolio from "./home/Portfolio";
import Testimonial from "./home/Testimonials";
import Departments from "./home/Departments";
import Team from "./home/Team";
import Appoinment from "./home/Appoinment";

export default function Home() {
  return (
    <>      
      <HeaderTwo />
      <Hero />
      <Schedule />
      <Features />
      <Funfact />
      <WhyChoose />
      <CallAction />
      <Portfolio />
      <Testimonial />
      <Departments />
      <Team />
      <Appoinment />
      <Footer />
      <ScrollTop />        
    </>
  );
}
