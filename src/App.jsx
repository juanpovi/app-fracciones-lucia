import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import confetti from "canvas-confetti";

const operaciones = ["Suma", "Resta", "Multiplicación", "División"];
const audioAcierto = typeof Audio !== "undefined" ? new Audio("/acierto.mp3") : null;
const audioError = typeof Audio !== "undefined" ? new Audio("/error.mp3") : null;

function generarFraccionAleatoria() {
  const numerador = Math.floor(Math.random() * 9) + 1;
  const denominador = Math.floor(Math.random() * 9) + 1;
  return { numerador, denominador };
}

function simplificarFraccion(n, d) {
  const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
  const divisor = mcd(n, d);
  return { numerador: n / divisor, denominador: d / divisor };
}

export default function FraccionesApp() {
  const [operacionSeleccionada, setOperacionSeleccionada] = useState(null);
  const [ejercicio, setEjercicio] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [resultadoCorrecto, setResultadoCorrecto] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [explicacionPaso, setExplicacionPaso] = useState("");
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [intentos, setIntentos] = useState(0);

  const reiniciarPuntaje = () => {
    setAciertos(0);
    setIntentos(0);
  };

  const explicaciones = {
    Suma:
      "Método cruzado: multiplicamos en cruz los numeradores y denominadores, luego sumamos y multiplicamos los denominadores. Ejemplo: 1/4 + 2/3 = (1×3 + 2×4)/(4×3) = (3 + 8)/12 = 11/12",
    Resta:
      "Método cruzado: multiplicamos en cruz los numeradores y denominadores, luego restamos y multiplicamos los denominadores. Ejemplo: 3/4 - 1/6 = (3×6 - 1×4)/(4×6) = (18 - 4)/24 = 14/24 = 7/12",
    Multiplicación:
      "Multiplicamos numerador por numerador y denominador por denominador. Ejemplo: 2/3 × 3/4 = 6/12 = 1/2",
    División:
      "Multiplicamos la primera fracción por la inversa de la segunda. Ejemplo: 3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8",
  };

  const generarEjercicio = () => {
    const f1 = generarFraccionAleatoria();
    const f2 = generarFraccionAleatoria();
    let resultado;
    let pasos = "";

    switch (operacionSeleccionada) {
      case "Suma":
        pasos = `(${f1.numerador}×${f2.denominador} + ${f2.numerador}×${f1.denominador}) / (${f1.denominador}×${f2.denominador})`;
        resultado = {
          numerador:
            f1.numerador * f2.denominador +
            f2.numerador * f1.denominador,
          denominador: f1.denominador * f2.denominador,
        };
        break;
      case "Resta":
        pasos = `(${f1.numerador}×${f2.denominador} - ${f2.numerador}×${f1.denominador}) / (${f1.denominador}×${f2.denominador})`;
        resultado = {
          numerador:
            f1.numerador * f2.denominador -
            f2.numerador * f1.denominador,
          denominador: f1.denominador * f2.denominador,
        };
        break;
      case "Multiplicación":
        pasos = `${f1.numerador}×${f2.numerador} / ${f1.denominador}×${f2.denominador}`;
        resultado = {
          numerador: f1.numerador * f2.numerador,
          denominador: f1.denominador * f2.denominador,
        };
        break;
      case "División":
        pasos = `${f1.numerador}×${f2.denominador} / ${f1.denominador}×${f2.numerador}`;
        resultado = {
          numerador: f1.numerador * f2.denominador,
          denominador: f1.denominador * f2.numerador,
        };
        break;
      default:
        resultado = null;
    }

    if (resultado) resultado = simplificarFraccion(resultado.numerador, resultado.denominador);
    setEjercicio({ f1, f2 });
    setResultadoCorrecto(resultado);
    setRespuesta("");
    setFeedback("");
    setExplicacionPaso(pasos);
    setMostrarAyuda(false);
  };

  const verificarRespuesta = () => {
    const [n, d] = respuesta.split("/").map(Number);
    setIntentos(intentos + 1);
    if (
      n === resultadoCorrecto.numerador &&
      d === resultadoCorrecto.denominador
    ) {
      setAciertos(aciertos + 1);
      setFeedback("✅ ¡Muy bien!");
      if (audioAcierto) audioAcierto.play();
      confetti();
    } else {
      setFeedback(
        `❌ Intenta de nuevo. La respuesta correcta es ${resultadoCorrecto.numerador}/${resultadoCorrecto.denominador}`
      );
      if (audioError) audioError.play();
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">
        Aprende a Operar con Fracciones
      </h1>

      <div className="text-center text-lg mb-4">
        Puntaje: {aciertos} correctas de {intentos} intentos
        <Button
          variant="outline"
          size="sm"
          className="ml-4"
          onClick={reiniciarPuntaje}
        >
          Reiniciar puntaje
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {operaciones.map((op) => (
          <Button
            key={op}
            onClick={() => {
              setOperacionSeleccionada(op);
              setEjercicio(null);
              setFeedback("");
              setExplicacionPaso("");
            }}
            variant={operacionSeleccionada === op ? "default" : "outline"}
          >
            {op}
          </Button>
        ))}
      </div>

      {operacionSeleccionada && (
        <Card className="mb-4">
          <CardContent className="p-4 text-lg">
            <strong className="block mb-2">
              {operacionSeleccionada.toUpperCase()}
            </strong>
            <p>{explicaciones[operacionSeleccionada]}</p>
          </CardContent>
        </Card>
      )}

      {operacionSeleccionada && (
        <div className="space-y-4">
          <Button onClick={generarEjercicio}>Generar ejercicio</Button>

          {ejercicio && (
            <div>
              <p className="text-lg mb-2">
                ¿Cuánto es {ejercicio.f1.numerador}/{ejercicio.f1.denominador} {operacionSeleccionada === "Suma" ? "+" : operacionSeleccionada === "Resta" ? "−" : operacionSeleccionada === "Multiplicación" ? "×" : "÷"} {ejercicio.f2.numerador}/{ejercicio.f2.denominador}?
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mb-2"
                onClick={() => setMostrarAyuda(!mostrarAyuda)}
              >
                {mostrarAyuda ? "Ocultar ayuda" : "Mostrar ayuda paso a paso"}
              </Button>
              {mostrarAyuda && (
                <p className="text-sm text-gray-700 mb-2">
                  Ayuda: {explicacionPaso} = {resultadoCorrecto.numerador}/{resultadoCorrecto.denominador}
                </p>
              )}
              <Input
                placeholder="Respuesta en forma a/b"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
              />
              <Button className="mt-2" onClick={verificarRespuesta}>
                Verificar
              </Button>
              {feedback && (
                <div className="mt-2 text-lg">
                  <p>{feedback}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Desarrollo: {explicacionPaso} = {resultadoCorrecto.numerador}/{resultadoCorrecto.denominador}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
