import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import  carStore  from "./store/store.ts";
import { Provider } from "react-redux";
import { AlertProvider } from "./Components/AlertProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Root Element Render
createRoot(document.getElementById("root")!).render(
  <Provider store={carStore}>
    <AlertProvider>
      <GoogleOAuthProvider clientId="37066794168-9rmtfttts3cjhoh6kbe79jgcnserpmnr.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </AlertProvider>
  </Provider>
);
