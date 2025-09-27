import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UsuárioContext from "../contextos/contexto-usuário";
export default function RotasMaestro() {
  const { usuárioLogado } = useContext(UsuárioContext);
  if (usuárioLogado.perfil === "maestro") return <Outlet />;
  else return <Navigate to="/" />;
}
