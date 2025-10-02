import { createContext, useState } from "react";
const ContextoPatrocinador = createContext();
export default ContextoPatrocinador;
export function ProvedorPatrocinador({ children }) {
  const [patrocínioConsultado, setPatrocínioConsultado] = useState({});
  const [peçaMusicalConsultada, setPeçaMusicalConsultada] = useState({});
  const [peçaMusicalSelecionada, setPeçaMusicalSelecionada] = useState({});
  const [peçaMusicalPatrocínio, setPeçaMusicalPatrocínio] = useState({});
  const [maestroProponente, setMaestroProponente] = useState([]);
  return (
    <ContextoPatrocinador.Provider
      value={{
        patrocínioConsultado,
        setPatrocínioConsultado,
        peçaMusicalConsultada,
        setPeçaMusicalConsultada,
        peçaMusicalSelecionada,
        setPeçaMusicalSelecionada,
        peçaMusicalPatrocínio,
        setPeçaMusicalPatrocínio,
        maestroProponente,
        setMaestroProponente,
      }}
    >
      {children}
    </ContextoPatrocinador.Provider>
  );
}
