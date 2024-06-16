import { useState } from "preact/hooks";
import "./app.css";
import Controller from "./lib/components/Controller/Controller";
import Ready from "./lib/components/Ready";
import { consentToPlayback } from "./lib/soundOptons/observables";

export function App() {
  const [hasConsented, setHasConsented] = useState(false);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {hasConsented ? (
        <Controller />
      ) : (
        <Ready
          onClick={() => {
            setHasConsented(true);
            consentToPlayback();
          }}
        />
      )}
    </main>
  );
}
