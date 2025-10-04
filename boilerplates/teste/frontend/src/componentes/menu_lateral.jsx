import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import ContextoUsuario from "../contextos/contexto_usuario";
import formatarPerfil from "../utilitarios/formatar_perfil";
import {
  estilizarBotao,
  estilizarColuna,
  estilizarGridColunaSidebar,
  estilizarGridSidebar,
  estilizarMenu,
  estilizarMenuLateralDesktop,
  estilizarMenuLateralMobile,
  estilizarSidebar,
  estilizarSubtitulo,
  estilizarTitulo,
} from "../utilitarios/estilos";

export default function MenuLateral({ children }) {
  const { usuarioLogado, setUsuarioLogado } = useContext(ContextoUsuario);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [visible, setVisible] = useState(false);
  const tamanhoDesktop = windowWidth > 991;
  const navegar = useNavigate();

  function sairSistema() {
    setUsuarioLogado({});
    navegar("/");
  }

  function redimensionarJanela() {
    setWindowWidth(window.innerWidth);
  }

  function MenuServicos() {
    if (tamanhoDesktop) {
      return (
        <div className={estilizarMenuLateralDesktop(usuarioLogado?.cor_tema)}>
          <h1 className={estilizarTitulo(usuarioLogado?.cor_tema)}>
            {usuarioLogado?.nome}
          </h1>
          <h2 className={estilizarSubtitulo(usuarioLogado?.cor_tema)}>
            {formatarPerfil(usuarioLogado?.perfil)}
          </h2>
          <Menu className={estilizarMenu()} model={opcoesMenu()} />
        </div>
      );
    } else
      return (
        <>
          <div className={estilizarMenuLateralMobile(usuarioLogado?.cor_tema)}>
            <Button
              className={estilizarBotao(usuarioLogado?.cor_tema)}
              icon="pi pi-bars"
              aria-label="Filter"
              onClick={() => setVisible(true)}
            />
            <h1 className={estilizarTitulo(usuarioLogado?.cor_tema)}>
              {usuarioLogado?.nome}
            </h1>
            <h2 className={estilizarSubtitulo(usuarioLogado?.cor_tema)}>
              {formatarPerfil(usuarioLogado?.perfil)}
            </h2>
          </div>
          <Sidebar
            className={estilizarSidebar()}
            visible={visible}
            onHide={() => setVisible(false)}
            showCloseIcon
          >
            <Menu className={estilizarMenu()} model={opcoesMenu()} />
          </Sidebar>
        </>
      );
  }

  useEffect(() => {
    window.addEventListener("resize", redimensionarJanela);
    return () => window.removeEventListener("resize", redimensionarJanela);
  }, []);

  function opcoesMenu() {
    return [
      {
        label: "Pagina Inicial",
        command: () => navegar("/pagina-inicial"),
      },
      {
        label: "Atualizar Cadastro",
        command: () => navegar("/atualizar-usuario"),
      },
      {
        label: "Sair",
        command: sairSistema,
      },
    ];
  }

  return (
    <div className={estilizarGridSidebar(usuarioLogado?.cor_tema)}>
      <div className={estilizarGridColunaSidebar()}>
        <MenuServicos />
      </div>
      <div className={estilizarColuna()}>{children}</div>
    </div>
  );
}
