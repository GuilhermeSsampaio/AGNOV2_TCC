import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuarioLogado from "./rotas_usuario_logado";
import LogarUsuario from "../paginas/usuario/logar_usuario";
import CadastrarUsuario from "../paginas/usuario/cadastrar_usuario";
import PaginaInicial from "../paginas/usuario/pagina_inicial";
import RecuperarAcesso from "../paginas/usuario/recuperar_acesso";

export default function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuario />} path="/" />
        <Route element={<CadastrarUsuario />} path="criar-usuario" />
        <Route element={<RecuperarAcesso />} path="recuperar-acesso" />

        <Route element={<RotasUsuarioLogado />}>
          <Route element={<PaginaInicial />} path="pagina-inicial" />
          <Route element={<CadastrarUsuario />} path="atualizar-usuario" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
