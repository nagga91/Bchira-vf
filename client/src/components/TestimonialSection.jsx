import { useState } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "John Deo",
    role: "Customer",
    text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Emily Carter",
    role: "Customer",
    text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    image: "https://randomuser.me/api/portraits/women/60.jpg",
  },
  {
    name: "Michael Lee",
    role: "Customer",
    text: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

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
