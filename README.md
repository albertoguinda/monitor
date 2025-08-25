# Monitor de AGVs

Proyecto de monitorización de AGVs (vehículos autoguiados) desarrollado como prueba técnica.  
Aplicación full-stack con frontend interactivo en tiempo real y backend simulador de flota AGV.

---

## 📋 Contenido

1. [Descripción general](#descripción-general)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Ejecución local](#-ejecución-local)
5. [Justificación tecnológica](#justificación-tecnológica)
6. [Notas finales](#notas-finales)
7. [Autor](#autor)

---

## Descripción general

Esta aplicación permite visualizar el estado y posición de varios AGVs en planta, así como asignar nuevos destinos mediante un sistema de WebSockets en tiempo real.

- Visualización de posiciones en mapa dinámico (Canvas).
- Estado de batería de cada AGV.
- Envío de coordenadas de destino en tiempo real.
- Backend que simula el movimiento físico de los AGVs.

---

## Tecnologías utilizadas

### **Frontend**

- [Astro](https://astro.build/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- WebSocket (cliente)

### **Backend**

- Node.js (puro)
- WebSocket Server (ws)
- MQTT (simulador de datos de prueba)
- TypeScript

---

## Estructura del proyecto

```bash
root/
│
├── .astro/
├── backend/
│   ├── src/
│   │   ├── agvSimulator.ts
│   │   ├── config.ts
│   │   ├── init.ts
│   │   ├── movement.ts
│   │   ├── mqttClient.ts
│   │   ├── server.ts
│   │   └── types.ts
│   └── package.json
│
├── dist/
├── public/
│   ├── favicon-96x96.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   └── site.webmanifest
│
├── src/
│   ├── components/
│   │   ├── AGVCard.tsx
│   │   ├── AGVMap.tsx
│   │   └── WsClient.tsx
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
│
├── astro.config.mjs
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md

Instrucciones de ejecución local

git clone https://github.com/albertoguinda/moontech.git
cd moontech

cd backend
npm install

cd ..
npm install
npm run dev

```

## Justificación tecnológica

### Este proyecto ha sido diseñado con un doble objetivo:

- Utilizar tecnologías modernas de frontend como Astro, React, Tailwind CSS y TypeScript para demostrar conocimiento actualizado en desarrollo web.

- Mantener el backend en Node.js puro, con WebSocket nativo, simulador MQTT y arquitectura modular, perfectamente alineado con stacks habituales en entornos industriales.

- Esta combinación permite mostrar capacidades tanto en desarrollo moderno de interfaces interactivas como en lógica backend robusta, altamente adaptable a los entornos industriales o SCADA.

## Notas finales

- Código cuidadosamente estructurado y documentado en español.
- Buenas prácticas de arquitectura, separación de responsabilidades y documentación.
- Proyecto profesional orientado a entornos industriales / SCADA.

## Autor

- [Alberto Guinda Sevilla - LinkedIn](https://www.linkedin.com/in/albertoguindasevilla/)
- [Alberto Guinda Sevilla - GitHub](https://github.com/albertoguinda/)
