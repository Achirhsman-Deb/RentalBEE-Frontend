import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import  carStore  from "./store/store.ts";
import { Provider } from "react-redux";
import { AlertProvider } from "./Components/AlertProvider.tsx";

// Root Element Render
createRoot(document.getElementById("root")!).render(
  <Provider store={carStore}>
    <AlertProvider>
      <App />
    </AlertProvider>
  </Provider>
);
