import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarMaestro from "../páginas/maestro/cadastrar-maestro";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarPatrocinador from "../páginas/patrocinador/cadastrar-patrocinador";
import { ProvedorMaestro } from "../contextos/contexto-maestro";
import { ProvedorPatrocinador } from "../contextos/contexto-patrocinador";
import RotasMaestro from "./rotas-maestro";
import RotasPatrocinador from "./rotas-patrocinador";
import AdministrarPeçasMusicais from "../páginas/maestro/administrar-peças-musicais";
import CadastrarPeçaMusical from "../páginas/maestro/cadastrar-peça-musical";
import AdministrarPatrocínios from "../páginas/patrocinador/administrar-patrocínios";
import CadastrarPatrocínio from "../páginas/patrocinador/cadastrar-patrocínio";
import PesquisarPeçasMusicais from "../páginas/patrocinador/pesquisar-peças-musicais";
import ConsultarPeçaMusical from "../páginas/patrocinador/consultar-peça-musical";
import PesquisarPatrocínios from "../páginas/maestro/pesquisar-patrocínios";
import ConsultarPatrocínio from "../páginas/maestro/consultar-patrocínio";
import ConsultarPatrocinador from "../páginas/maestro/consultar-patrocinador";
import ConsultarMaestro from "../páginas/patrocinador/consultar-maestro";
export default function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuário />} path="/" />
        <Route element={<CadastrarUsuário />} path="criar-usuario" />
        <Route element={<RecuperarAcesso />} path="recuperar-acesso" />

        <Route element={<RotasUsuárioLogado />}>
          <Route element={<PáginaInicial />} path="pagina-inicial" />
          <Route element={<CadastrarUsuário />} path="atualizar-usuario" />

          <Route
            element={
              <ProvedorMaestro>
                <RotasMaestro />
              </ProvedorMaestro>
            }
          >
            <Route element={<CadastrarMaestro />} path="cadastrar-maestro" />
            <Route
              element={<AdministrarPeçasMusicais />}
              path="administrar-pecas-musicais"
            />
            <Route
              element={<CadastrarPeçaMusical />}
              path="cadastrar-peca-musical"
            />
            <Route
              element={<PesquisarPatrocínios />}
              path="pesquisar-patrocinios"
            />
            <Route
              element={<ConsultarPatrocínio />}
              path="consultar-patrocinio"
            />
            <Route
              element={<ConsultarPatrocinador />}
              path="consultar-patrocinador"
            />
          </Route>

          <Route
            element={
              <ProvedorPatrocinador>
                <RotasPatrocinador />
              </ProvedorPatrocinador>
            }
          >
            <Route
              element={<CadastrarPatrocinador />}
              path="cadastrar-patrocinador"
            />
            <Route
              element={<AdministrarPatrocínios />}
              path="administrar-patrocinios"
            />
            <Route
              element={<CadastrarPatrocínio />}
              path="cadastrar-patrocinio"
            />
            <Route
              element={<PesquisarPeçasMusicais />}
              path="pesquisar-pecas-musicais"
            />
            <Route
              element={<ConsultarPeçaMusical />}
              path="consultar-peca-musical"
            />
            <Route element={<ConsultarMaestro />} path="consultar-maestro" />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
