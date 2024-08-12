import React from 'react';
import StandardButton from '../buttons/standard-button.jsx';
import Spacer from '../buttons/spacer.jsx';

export default function NotFound() {
  return (
    <div>
        <Spacer className="spacer-xxl" />
      <h1>Aquí no hay nada por ahora</h1>
      <p>Estamos trabajando en esta página para que muy pronto puedas ver su contenido. Disculpa las molestias.</p>

      <StandardButton
                link="/"
                title="Volver"
                style=""
            />

    </div>
  );
}