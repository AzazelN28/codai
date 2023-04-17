<template>
  <div class="pen">
    <header>

    </header>
    <main>
      <Chat></Chat>
      <Editors></Editors>
      <Preview></Preview>
    </main>
    <footer>

    </footer>
  </div>
</template>

<script setup>

</script>

<style>
.pen {
  display: grid;
  grid-template-areas:
    "header header header"
    "main main main"
    "main main main"
    "main main main"
    "main main main"
    "main main main"
    "footer footer footer";
}

header {
  grid-area: header;
}

main {
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
    "chat editors preview";
}

footer {
  grid-area: footer;
}
</style>
