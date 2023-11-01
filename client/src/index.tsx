import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./views/App/App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { NextUIProvider } from "@nextui-org/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
