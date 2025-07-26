import React from 'react';
import Hero from './Hero';
import FeaturedProducts from './FeaturedProducts';
import Benefits from './Benefits';
import TestimonialSection from './TestimonialSection';
import Contact from './Contact';
import { useLoaderData } from 'react-router-dom';

function Home() {
  const productslist = useLoaderData() || [];
  return (
    <>
      <Hero />
      <FeaturedProducts products={productslist}/>
      <Benefits />
      <TestimonialSection />
      <Contact />
    </>
  );
}

export default Home;