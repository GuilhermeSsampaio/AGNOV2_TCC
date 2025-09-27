import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UsuárioContext from "../contextos/contexto-usuário";
export default function RotasPatrocinador() {
  const { usuárioLogado } = useContext(UsuárioContext);
  if (usuárioLogado.perfil === "patrocinador") return <Outlet />;
  else return <Navigate to="/" />;
}
