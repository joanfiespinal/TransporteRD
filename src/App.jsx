import React, { useState } from 'react';

const tarifas = {
  'Santiago|Santo Domingo': { guagua: 500, carro: 1500 },
  'Santo Domingo|La Vega': { guagua: 400, carro: 1200 },
  'Santo Domingo|San Cristóbal': { guagua: 150, carro: 400 },
  'Santo Domingo|Bani': { guagua: 200, carro: 450 },
  'Santo Domingo|Barahona': { guagua: 550, carro: 2000 },
  'Santo Domingo|San Pedro de Macorís': { guagua: 200, carro: 1000 },
  'Santo Domingo|La Romana': { guagua: 300, carro: 1200 },
  'Santiago|La Vega': { guagua: 300, carro: 700 },
  'Santiago|Puerto Plata': { guagua: 300, carro: 800 },
  'Santo Domingo|Higuey': { guagua: 550, carro: 1300 },
  'La Romana|Higuey': { guagua: 200, carro: 700 },
};

const ciudades = [
  'Santo Domingo',
  'Santiago',
  'La Vega',
  'San Cristóbal',
  'Bani',
  'Barahona',
  'San Pedro de Macorís',
  'La Romana',
  'Puerto Plata',
  'Higuey',
];

const pesos = (cantidad) =>
  new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    maximumFractionDigits: 2,
  }).format(cantidad);

function buscarTarifa(origen, destino, transporte) {
  const directa = tarifas[`${origen}|${destino}`];
  const inversa = tarifas[`${destino}|${origen}`];
  return directa?.[transporte] ?? inversa?.[transporte] ?? null;
}

export default function App() {
  const [origen, setOrigen] = useState('Santo Domingo');
  const [destino, setDestino] = useState('Santiago');
  const [transporte, setTransporte] = useState('guagua');
  const [personas, setPersonas] = useState(1);
  const [resultado, setResultado] = useState(null);
  const [oscuro, setOscuro] = useState(false);

  function calcularPasaje(evento) {
    evento.preventDefault();

    if (origen === destino) {
      setResultado({
        error: 'El origen y el destino deben ser diferentes.',
      });
      return;
    }

    const cantidadPersonas = Number(personas);

    if (!Number.isInteger(cantidadPersonas) ||
        cantidadPersonas < 1 ||
        cantidadPersonas > 20) {
      setResultado({
        error: 'Selecciona una cantidad de 1 a 20 pasajeros.',
      });
      return;
    }

    if (transporte === 'metro') {
      setResultado({
        error: 'El Metro de Santo Domingo es un transporte urbano y no conecta directamente estas ciudades.',
      });
      return;
    }

    const tarifa = buscarTarifa(origen, destino, transporte);

    if (tarifa === null) {
      setResultado({
        error: 'Todavía no tenemos una tarifa estimada para esta ruta. Prueba con otra ruta.',
      });
      return;
    }

    setResultado({
      origen,
      destino,
      transporte,
      personas: cantidadPersonas,
      tarifa,
      total: tarifa * cantidadPersonas,
    });
  }

  function intercambiarCiudades() {
    setOrigen(destino);
    setDestino(origen);
    setResultado(null);
  }

  return (
    <div className={`aplicacion ${oscuro ? 'modo-oscuro' : ''}`}>
      <header className="encabezado">
        <a className="marca" href="#inicio" aria-label="TransporteRD, inicio">
          <span className="marca-icono">🚌</span>
          <span>Transporte<span className="texto-verde">RD</span></span>
        </a>

        <button
          className="boton-tema"
          type="button"
          onClick={() => setOscuro(!oscuro)}
          aria-label={oscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {oscuro ? '☀️' : '🌙'}
        </button>
      </header>

      <main id="inicio">
        <section className="hero">
          <span className="etiqueta">REPÚBLICA DOMINICANA</span>
          <h1>Tu próximo viaje <span className="texto-verde">comienza aquí.</span></h1>
          <p>
            Calcula cuánto podrías gastar en tu pasaje y planifica
            tu viaje entre las principales ciudades del país.
          </p>
        </section>

        <section className="tarjeta" aria-labelledby="titulo-formulario">
          <div className="tarjeta-titulo">
            <span className="icono-titulo">📍</span>
            <div>
              <h2 id="titulo-formulario">Calcula tu pasaje</h2>
              <p>Completa los datos de tu viaje.</p>
            </div>
          </div>

          <form onSubmit={calcularPasaje}>
            <div className="grupo-ruta">
              <div className="campo">
                <label htmlFor="origen">Ciudad de origen</label>
                <select
                  id="origen"
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                >
                  {ciudades.map((ciudad) => (
                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="boton-intercambiar"
                onClick={intercambiarCiudades}
                aria-label="Intercambiar origen y destino"
                title="Intercambiar ciudades"
              >
                ⇅
              </button>

              <div className="campo">
                <label htmlFor="destino">Ciudad de destino</label>
                <select
                  id="destino"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                >
                  {ciudades.map((ciudad) => (
                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="campo">
              <label htmlFor="transporte">Medio de transporte</label>
              <select
                id="transporte"
                value={transporte}
                onChange={(e) => setTransporte(e.target.value)}
              >
                <option value="guagua">🚌 Guagua interurbana</option>
                <option value="carro">🚕 Carro público</option>
                <option value="metro">🚇 Metro de Santo Domingo</option>
              </select>
            </div>

            <div className="campo">
              <label htmlFor="personas">Cantidad de pasajeros</label>
              <input
                id="personas"
                type="number"
                min="1"
                max="20"
                step="1"
                value={personas}
                onChange={(e) => setPersonas(e.target.value)}
                required
              />
            </div>

            <button className="boton-calcular" type="submit">
              Calcular mi pasaje <span aria-hidden="true">→</span>
            </button>
          </form>

          {resultado && (
            <section
              className={`resultado ${resultado.error ? 'resultado-error' : ''}`}
              aria-live="polite"
            >
              {resultado.error ? (
                <>
                  <h3>Revisa tu viaje</h3>
                  <p>{resultado.error}</p>
                </>
              ) : (
                <>
                  <span className="resultado-etiqueta">COSTO ESTIMADO</span>
                  <h3>{pesos(resultado.total)}</h3>
                  <p>
                    {resultado.origen} → {resultado.destino}
                  </p>
                  <div className="detalle-resultado">
                    <span>Transporte</span>
                    <strong>
                      {resultado.transporte === 'guagua'
                        ? 'Guagua interurbana'
                        : 'Carro público'}
                    </strong>
                    <span>Pasajeros</span>
                    <strong>{resultado.personas}</strong>
                    <span>Precio por persona</span>
                    <strong>{pesos(resultado.tarifa)}</strong>
                  </div>
                  <p className="aviso">
                    Esta tarifa es ilustrativa, no oficial. Confirma el precio
                    con el operador antes de viajar.
                  </p>
                </>
              )}
            </section>
          )}
        </section>

        <section className="beneficios">
          <article className="beneficio">
            <span>🧭</span>
            <h3>Planifica tu ruta</h3>
            <p>Consulta las rutas disponibles entre varias ciudades dominicanas.</p>
          </article>
          <article className="beneficio">
            <span>💰</span>
            <h3>Organiza tu presupuesto</h3>
            <p>Calcula el gasto aproximado según la cantidad de pasajeros.</p>
          </article>
          <article className="beneficio">
            <span>📱</span>
            <h3>Fácil de utilizar</h3>
            <p>Una herramienta sencilla para consultar desde tu celular o computadora.</p>
          </article>
        </section>

        <p className="nota-general">
          Los precios mostrados son ejemplos orientativos y pueden variar según
          el operador, la ruta y las condiciones del servicio.
        </p>
      </main>

      <footer className="pie">
        <p>© {new Date().getFullYear()} TransporteRD</p>
        <p>Moviéndonos por República Dominicana 🇩🇴</p>
      </footer>

      <a
        className="boton-whatsapp"
        href="https://wa.me/?text=Hola%2C%20quiero%20consultar%20sobre%20una%20ruta%20de%20transporte%20en%20Rep%C3%BAblica%20Dominicana."
        target="_blank"
        rel="noreferrer"
        aria-label="Compartir consulta por WhatsApp"
        title="Consultar por WhatsApp"
      >
        ☎
      </a>

      <button
        className="boton-subir"
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Volver arriba"
        title="Volver arriba"
      >
        ↑
      </button>
    </div>
  );
}
