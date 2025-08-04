import { useEffect, useRef, useContext, useState } from "react";
import { gsap } from "gsap";
import useTextLinesReveal from "./useTextLinesReveal";
import { AppContext } from "./appContext";

const ContactPage = () => {
  const { setCursorState } = useContext(AppContext);
  
  const containerRef = useRef(null);
  const previewRef = useRef(null);
  const backCtrlRef = useRef(null);
  const contentRef = useRef(null);
  const textRefs = useRef({});
  const { animateIn, animateOut } = useTextLinesReveal(textRefs);

  const [formData, setFormData] = useState({ email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("https://formspree.io/f/mnnpzwol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
        }),
      });
  
      if (res.ok) {
        setSuccess(true);
        setFormData({ email: "", message: "" });
              setTimeout(() => setSuccess(false), 5000);
      } else {
        setError("Hubo un problema al enviar el mensaje.");
      }
    } catch (err) {
      setError("Error de conexión. Intenta más tarde.");
    }
  };  

  useEffect(() => {
    const container = containerRef.current;
    const preview = previewRef.current;
    const backCtrl = backCtrlRef.current;
    const content = contentRef.current;
    const triggerButton = document.querySelector(".contact-link");

    const overlayRows = container.querySelectorAll(".overlay__row");
    const innerElements = preview.querySelectorAll(".oh__inner");
    const previewImage = preview.querySelector(".preview__img");
    const previewImageInner = preview.querySelector(".preview__img-inner");

    const openPreview = () => {
      const textArea = preview.querySelector(".textarea");
      const inputName = preview.querySelector(".input-name");
      const inputEmail = preview.querySelector(".input-email");
      const submitButton = preview.querySelector(".submit");

      const formElements = [textArea, inputName, inputEmail, submitButton];
      gsap.set(formElements, { opacity: 0, y: 20 });

      window.scrollTo({ top: 0, behavior: "instant" });

      document.documentElement.style.overflow = 'hidden';

      gsap.timeline({ defaults: { duration: 1, ease: "power3.inOut" } })
        .add(() => {
          content.classList.add("content--hidden");
        }, "start")
        .set([innerElements, backCtrl], { opacity: 0 }, "start")
        .to(overlayRows, { scaleY: 1 }, "start")
        .add(() => {
          container.classList.add("preview-visible");
          preview.classList.add("preview--current");
          animateIn.current();
        }, "start+=0.6")
        .to([previewImage, previewImageInner], { y: "0%" }, "start+=0.6")
        .to(innerElements, { yPercent: 0, opacity: 1 }, "start+=0.9")
        .to(backCtrl, { opacity: 1 }, "start+=1")
        .to(formElements, {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.6,
          ease: "power3.out"
        }, "start+=1.2");
      };

    const closePreview = () => {
      const textArea = preview.querySelector(".textarea");
      const inputName = preview.querySelector(".input-name");
      const inputEmail = preview.querySelector(".input-email");
      const submitButton = preview.querySelector(".submit");
      const formElements = [textArea, inputName, inputEmail, submitButton];

      document.documentElement.style.overflow = '';
      gsap.timeline({ defaults: { duration: 1, ease: "power3.inOut" } })
        .to(formElements, {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.2,
          ease: "power2.in"
        }, "start")
        .to(innerElements, { yPercent: -101, opacity: 0 }, "start")
        .to(backCtrl, { opacity: 0 }, "start")
        .to(previewImage, { y: "101%" }, "start")
        .to(previewImageInner, { y: "-101%" }, "start")
        .add(() => {
          animateOut.current();
        }, "start+=0.6")
        .to(overlayRows, {
          scaleY: 0,
          onComplete: () => {
            preview.classList.remove("preview--current");
            container.classList.remove("preview-visible");
            content.classList.remove("content--hidden");
          },
        }, "start+=0.6");
    };

    triggerButton.addEventListener("click", openPreview);
    backCtrl.addEventListener("click", closePreview);

    return () => {
      triggerButton.removeEventListener("click", openPreview);
      backCtrl.removeEventListener("click", closePreview);
    };
  }, [animateIn, animateOut]);

  return (
    <main ref={containerRef}>
      <div className="content" ref={contentRef} />
      <div className="overlay">
        <div className="overlay__row"></div>
        <div className="overlay__row"></div>
      </div>
      <section className="previews previews--contact">
        <div className="preview" ref={previewRef}>
          <button
            className="unbutton preview__back"
            ref={backCtrlRef}
            onPointerEnter={() => setCursorState("large")}
            onPointerLeave={() => setCursorState("default")}
          >
            <svg width="100px" height="18px" viewBox="0 0 50 9">
              <path vectorEffect="non-scaling-stroke" d="m0 4.5 5-3m-5 3 5 3m45-3h-77" />
            </svg>
          </button>

          <div className="preview__img">
            <div
              className="preview__img-inner"
              style={{ backgroundImage: "url(img/about-page/bg.jpg)" }}
            ></div>
          </div>

          <h2 className="preview__title oh">
            <span className="oh__inner">Contact me</span>
          </h2>

          <div className="preview__column preview__column--start">
            <span className="preview__column-title preview__column-title--main oh">
              <span className="oh__inner">You made it this far? Might as well send me a thought.</span>
            </span>

            <div className="contact-form-container">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="textarea"
                  onPointerEnter={() => setCursorState("large--filled-red")}
                  onPointerLeave={() => setCursorState("default")}>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell me something..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-name"
                  onPointerEnter={() => setCursorState("large--filled-red")}
                  onPointerLeave={() => setCursorState("default")}>
                  <input
                    type="name"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-email"
                  onPointerEnter={() => setCursorState("large--filled-red")}
                  onPointerLeave={() => setCursorState("default")}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="submit"
                onPointerEnter={() => setCursorState("large")}
                onPointerLeave={() => setCursorState("default")}>
                  <button type="submit">Send</button>
                </div>
                
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Thanks for your message!</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
