import { Container } from "@/components/ui/Container";
import { testimonials } from "@/content/landing.config";

export function Testimonials() {
  return (
    <section className="testimonials border-b border-border py-[var(--section-padding)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{testimonials.eyebrow}</p>
          <h2 className="section-title">{testimonials.title}</h2>
        </div>
      </Container>
      {/* Horizontally scrollable: a region so keyboard users can reach it. */}
      <div
        className="testimonial-scroller"
        tabIndex={0}
        role="group"
        aria-label={testimonials.title}
      >
        <div className="testimonial-track">
          {testimonials.items.map((item) => (
            <figure className="testimonial-card" key={item.quote}>
              <span className="testimonial-mark" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <span className="testimonial-name">{item.name}</span>
                <span className="testimonial-journey">{item.journey}</span>
                <span className="testimonial-company">{item.company}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <Container>
        <p className="testimonial-note">Scroll for more →</p>
      </Container>
    </section>
  );
}
