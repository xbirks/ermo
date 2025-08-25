'use client';

import Image from 'next/image';
import StandardButton from '../buttons/standard-button';

export default function CasosExito({ municipio = '' }) {
  return (
    <section className="grid__master">
      <h2>
        Casos de <span className="jardin__destacado">éxito</span>
      </h2>

      <div className="exito__master-new">
        {/* ITEM 1 */}
        <div className="exito__item">
          <div className="exito">
            <video
              className="exito__bg"
              src="/videos/landing_web/garta_01.mp4"
              poster="/assets/test_vid_poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Gartalia"
            />
            <div className="exito__info">
              <div className="exito__labels">
                <div className="exito__labels-icon">web</div>
                <div className="exito__labels-icon">branding</div>
                <div className="exito__labels-icon">seo</div>
              </div>

              <div className="exito__footer">
                <img
                  src="/assets/gartalia_logo.svg"
                  alt="Logo Gartalia"
                  className="exito__logo"
                  width="180"
                  height="90"
                />
                <StandardButton
                  link="https://www.gartalia.com"
                  title="Ver web"
                  style=""
                  bg="#3F52FF"
                  color="white"
                  borderColor="transparent"
                  hoverBg="#0E1C9D"
                  hoverColor="white"
                  hoverBorderColor=""
                />
              </div>
            </div>
          </div>

          <p className="exito__review">
            Gartalia pasó de no tener presencia online a estar
            <strong> posicionada como una de las mejores empresas de jardinería {municipio ? `de ${municipio}` : ''}.</strong>{' '}
            Gracias a una web bien optimizada y una estrategia SEO efectiva.
          </p>
        </div>

        {/* ITEM 2 */}
        <div className="exito__item">
          <div className="exito">
            <video
              className="exito__bg"
              src="/videos/landing_web/AR_vid.mp4"
              poster="/assets/test_vid_poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Arianny Rivas Agency"
            />
            <div className="exito__info">
              <div className="exito__labels">
                <div className="exito__labels-icon">web</div>
                <div className="exito__labels-icon">branding y marca paraguas</div>
              </div>

              <div className="exito__footer">
                <img
                  src="/assets/ar_logo.svg"
                  alt="Logo AR Agency"
                  className="exito__logo"
                  width="180"
                  height="90"
                />
                <StandardButton
                  link="https://www.ariannyrivasagency.com"
                  title="Ver web"
                  style=""
                  bg="#3F52FF"
                  color="white"
                  borderColor="transparent"
                  hoverBg="#3F52FF"
                  hoverColor="white"
                />
              </div>
            </div>
          </div>

          <p className="exito__review">
            Arianny Rivas necesitaba un portfolio para sus modelos que se sintiera <strong>premium</strong>, que fuera rápido y
            mostrara fotos y vídeos a la máxima calidad. Implementamos <strong>animación entre páginas</strong> para una experiencia tipo app.
          </p>
        </div>

        {/* ITEM 3 SANOGUERA */}
        <div className="exito__item">
          <div className="exito">
            <video
              className="exito__bg"
              src="/videos/landing_web/sanoguera_vid.mp4"
              poster="/assets/test_vid_poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Sanoguera"
            />
            <div className="exito__info">
              <div className="exito__labels">
                <div className="exito__labels-icon">Web</div>
                <div className="exito__labels-icon">Branding</div>
                <div className="exito__labels-icon">Fotografía</div>
                <div className="exito__labels-icon">Redacción artículos</div>
              </div>

              <div className="exito__footer">
                <img
                  src="/assets/sanoguera_logo.svg"
                  alt="Logo Sanoguera"
                  className="exito__logo"
                  width="180"
                  height="90"
                />
                <StandardButton
                  link="https://sanoguera-asesores.com"
                  title="Ver web"
                  style=""
                  bg="#3F52FF"
                  color="white"
                  borderColor="transparent"
                  hoverBg="#3F52FF"
                  hoverColor="white"
                />
              </div>
            </div>
          </div>

          <p className="exito__review">
            Sanoguera quería pasar de una asesoría tradicional a una <strong>consultoría especializada en sector primario</strong>.
            Su ubicación en MercaValencia era ideal; actualizamos su marca y web para reflejarlo con rigor y profesionalidad.
          </p>
        </div>

        {/* ITEM 4 SEGORBINA */}
        <div className="exito__item">
          <div className="exito">
            <video
              className="exito__bg"
              src="/videos/landing_web/segorbina_vid.mp4"
              poster="/assets/test_vid_poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Segorbina Bastones"
            />
            <div className="exito__info">
              <div className="exito__labels">
                <div className="exito__labels-icon">Web</div>
                <div className="exito__labels-icon">Branding</div>
                <div className="exito__labels-icon">Fotografía</div>
                <div className="exito__labels-icon">Vídeo</div>
              </div>

              <div className="exito__footer">
                <img
                  src="/assets/segorbina_logo.svg"
                  alt="Logo Segorbina Bastones"
                  className="exito__logo"
                  width="180"
                  height="90"
                />
                <StandardButton
                  link="https://sanoguera-asesores.com"
                  title="Ver web"
                  style=""
                  bg="#3F52FF"
                  color="white"
                  borderColor="transparent"
                  hoverBg="#3F52FF"
                  hoverColor="white"
                />
              </div>
            </div>
          </div>

          <p className="exito__review">
            Carlos necesitaba <strong>renovar la web de su empresa de bastones</strong> y convertirla en un catálogo claro.
            Actualizamos branding, realizamos fotografía de producto y un vídeo corporativo para reforzar la confianza.
          </p>
        </div>

        {/* CTA inferior */}
        <div className="exito__cta">
          <StandardButton
            link="#"
            title="Ver más casos de éxito"
            style="mt-xs"
            bg="#3F52FF"
            color="white"
            borderColor="#3F52FF"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="#0E1C9D"
          />
        </div>
      </div>
    </section>
  );
}
