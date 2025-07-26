import { useState } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aya Ben Saïd",
    role: "Cliente",
    text: "Le service était impeccable et l'équipe très professionnelle. Je recommande vivement cette entreprise.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Omar Aloui",
    role: "Client",
    text: "Très satisfait de la qualité et de la rapidité. C'était au-delà de mes attentes.",
    image: "https://randomuser.me/api/portraits/men/27.jpg",
  },
  {
    name: "Noura Haddad",
    role: "Cliente",
    text: "Une expérience exceptionnelle du début à la fin. Merci pour votre écoute et votre efficacité.",
    image: "https://randomuser.me/api/portraits/women/41.jpg",
  },
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="py-16 testimonial bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="section-title">
          NOS TÉMOIGNAGES
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left - Image */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-full h-full object-cover rounded-full border-4 border-gray-300 shadow-lg"
              />
            </div>
          </div>

          {/* Right - Text Content */}
          <div className="w-full md:w-2/3">
            <Quote className="text-4xl text-teal-700 mb-4" />
            <p className="text-3xl italic text-gray-700">
              "{testimonials[currentIndex].text}"
            </p>
            <h4 className="mt-6 text-xl font-semibold text-gray-900">
              {testimonials[currentIndex].name}
            </h4>
            <p className="text-sm text-gray-500">{testimonials[currentIndex].role}</p>

            {/* Indicators */}
            <div className="flex space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition ${
                    index === currentIndex ? "bg-teal-700" : "bg-gray-300"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
