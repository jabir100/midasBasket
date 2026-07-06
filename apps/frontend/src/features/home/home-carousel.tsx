import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { HomepageCarouselSlide } from "./homepage.types.js";

type HomeCarouselProps = {
  slides: HomepageCarouselSlide[];
};

export function HomeCarousel({ slides }: Readonly<HomeCarouselProps>): ReactNode {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [slides.length, isHovered]);

  if (slides.length === 0) {
    return null;
  }

  const handlePrev = (): void => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const handleNext = (): void => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section
      className="carousel-container"
      aria-label="Promotional slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`carousel-slide ${index === activeIndex ? "active" : ""}`}
          aria-hidden={index !== activeIndex}
        >
          {slide.image.src && (
            <img
              src={slide.image.src}
              alt={slide.image.alt}
              className="carousel-image"
              loading={index === 0 ? "eager" : "lazy"}
            />
          )}
          <div className="carousel-overlay" />
          
          {(slide.title || slide.description) && (
            <div className="carousel-content">
              {slide.title && <h2>{slide.title}</h2>}
              {slide.description && <p>{slide.description}</p>}
              {slide.linkHref && (
                <a
                  className="ui-button ui-button-primary"
                  style={{ width: "fit-content", marginTop: "0.5rem" }}
                  href={slide.linkHref}
                >
                  Explore now
                </a>
              )}
            </div>
          )}
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="carousel-nav-btn carousel-nav-prev"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            className="carousel-nav-btn carousel-nav-next"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>

          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`carousel-dot ${index === activeIndex ? "active" : ""}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
