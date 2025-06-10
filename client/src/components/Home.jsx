import React from 'react';
import Hero from './Hero';
import FeaturedProducts from './FeaturedProducts';
import Benefits from './Benefits';
import TestimonialSection from './TestimonialSection';
import Contact from './Contact';

function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Benefits />
      <TestimonialSection />
      <Contact />
    </>
  );
}

export default Home;