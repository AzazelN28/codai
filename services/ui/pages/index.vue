<template>
  <header>
    <div class="logo">
      <i class="bx bx-brain"></i>
      <h1>CodAI</h1>
    </div>
  </header>
  <main>
    <div class="cta">
      <button type="submit" @click="onClick">
        New pen
      </button>
    </div>
    <!-- Textos generados por ChatGPT xD -->
    <!--
    <section>
      <p>Introduciendo el nuevo servicio de desarrollo web impulsado por inteligencia artificial: CodAI. ¿Estás cansado de perder tiempo en el desarrollo de sitios web? ¿Te gustaría tener un editor de código que te ayude a ser más productivo y eficiente? CodAI es la solución que has estado buscando.</p>
      <p>CodAI utiliza inteligencia artificial para ayudarte a escribir código más rápido y de manera más eficiente. Nuestro sistema de autocompletado predictivo sugiere el código más relevante para que puedas completar tus líneas de código en un instante. También puedes aprovechar nuestras sugerencias de corrección de errores para evitar errores comunes en el código.</p>
      <p>Nuestro servicio también incluye un entorno de pruebas en vivo para que puedas ver tus cambios en tiempo real. Y cuando hayas terminado, puedes compartir tus proyectos directamente desde CodAI en las redes sociales o en tu propio sitio web.</p>
      <p>En resumen, CodAI es la solución perfecta para cualquier desarrollador que busque mejorar su flujo de trabajo y aumentar su productividad. Únete a nuestra comunidad de desarrolladores hoy y descubre por ti mismo cómo CodAI puede ayudarte a llevar tus habilidades de desarrollo web al siguiente nivel.</p>
    </section>
    -->
  </main>
</template>

<script setup>
import Status from 'http-status-codes'

const router = useRouter()

async function onClick(e) {
  const response = await fetch('/api/v1/pens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.status === Status.CREATED)
  {
    const pen = await response.json()
    router.push({ path: `/p/${pen.id}` })
  }
  else {
    // TODO: Ya veré lo que hago.
  }
}
</script>

<style scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 4rem;
}

.logo .bx {
  font-size: 10rem;
}

header {
  display: grid;
  place-items: center;
}

main {
  display: grid;
  place-items: center;
}

button {
  padding: 2rem;
  font-size: 2rem;
  border-radius: .5rem;
  border: 0;
  color: #fff;
  background-image: linear-gradient(45deg, hsl(80, 100%, 70%), hsl(220, 50%, 50%));
  background-size: 100%;
    background-position: center;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
  transition: all .5s ease-out
}

button:hover {
  padding: 2.5rem;
  font-size: 2.5rem;

  background-size: 150%;
}

section {
  max-width: 960px;
}

p {
  font-size: 1.25rem;
  line-height: 1.85rem;
}
</style>
