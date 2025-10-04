import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto_usuario";
import formatarPerfil from "../../utilitarios/formatar_perfil";
import {
  estilizarBotao,
  estilizarBotaoRemover,
  estilizarDivCampo,
  estilizarInlineFlex,
  estilizarLabel,
  estilizarModal,
} from "../../utilitarios/estilos";
import {
  servicoAlterarUsuario,
  servicoCadastrarUsuario,
  servicoRemoverUsuario,
} from "../../servicos/servicos_usuario";
import mostrarToast from "../../utilitarios/mostrar_toast";

export default function ModalConfirmacaoUsuario() {
  const referenciaToast = useRef(null);
  const {
    setUsuarioLogado,
    confirmacaoUsuario,
    setConfirmacaoUsuario,
    setMostrarModalConfirmacao,
    usuarioLogado,
  } = useContext(ContextoUsuario);
  const dados = {
    cpf: confirmacaoUsuario?.cpf,
    perfil: confirmacaoUsuario?.perfil,
    nome: confirmacaoUsuario?.nome,
    senha: confirmacaoUsuario?.senha,
    email: confirmacaoUsuario?.email,
    questao: confirmacaoUsuario?.questao,
    resposta: confirmacaoUsuario?.resposta,
    cor_tema: confirmacaoUsuario?.cor_tema,
  };
  const [destinoRedirecionamento, setDestinoRedirecionamento] = useState(null);

  const navegar = useNavigate();
  function labelOperacao() {
    switch (confirmacaoUsuario?.operacao) {
      case "salvar":
        return "Salvar";
      case "alterar":
        return "Alterar";
      case "remover":
        return "Remover";
      default:
        return;
    }
  }

  function exibirPerfilFormatado() {
    return formatarPerfil(dados.perfil) || dados.perfil || "Usuario";
  }

  function fecharToast() {
    if (destinoRedirecionamento) {
      setMostrarModalConfirmacao(false);
      setConfirmacaoUsuario({});
      if (confirmacaoUsuario?.operacao === "remover") {
        setUsuarioLogado({});
      }
      navegar(destinoRedirecionamento);
      setDestinoRedirecionamento(null);
    }
  }
  async function salvarUsuario() {
    try {
      const response = await servicoCadastrarUsuario({
        cpf: dados.cpf,
        nome: dados.nome,
        perfil: dados.perfil,
        email: dados.email,
        senha: dados.senha,
        questao: dados.questao,
        resposta: dados.resposta,
        cor_tema: dados.cor_tema,
      });
      setUsuarioLogado({
        ...response.data.usuario,
        token: response.data.token,
        cpf: dados.cpf,
        cadastrado: true,
      });
      setDestinoRedirecionamento("../pagina-inicial");
      mostrarToast(
        referenciaToast,
        "Cadastro realizado com sucesso! Redirecionando a Pagina Inicial...",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(
        referenciaToast,
        error.response?.data?.erro || "Nao foi possivel concluir o cadastro.",
        "erro"
      );
    }
  }
  async function alterarUsuario(dadosAlterados) {
    try {
      const response = await servicoAlterarUsuario({
        ...dadosAlterados,
        cpf: usuarioLogado.cpf,
      });
      setUsuarioLogado({ ...usuarioLogado, ...response.data });
      setDestinoRedirecionamento("../pagina-inicial");
      mostrarToast(
        referenciaToast,
        "Alterado com sucesso! Redirecionando a Pagina Inicial...",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(
        referenciaToast,
        error.response?.data?.erro || "Nao foi possivel alterar os dados.",
        "erro"
      );
    }
  }
  async function removerUsuario() {
    try {
      await servicoRemoverUsuario(usuarioLogado.cpf);
      setDestinoRedirecionamento("../");
      mostrarToast(
        referenciaToast,
        "Removido com sucesso! Redirecionando ao Login.",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(
        referenciaToast,
        error.response?.data?.erro || "Nao foi possivel remover o usuario.",
        "erro"
      );
    }
  }

  function executarOperacao() {
    switch (confirmacaoUsuario?.operacao) {
      case "salvar":
        salvarUsuario();
        break;
      case "alterar":
        alterarUsuario({
          email: dados.email,
          senha: dados.senha,
          questao: dados.questao,
          resposta: dados.resposta,
          cor_tema: dados.cor_tema,
        });
        break;
      case "remover":
        removerUsuario();
        break;
      default:
        break;
    }
  }

  function ocultar() {
    if (!destinoRedirecionamento) {
      setConfirmacaoUsuario({});
      setMostrarModalConfirmacao(false);
    }
  }
  return (
    <div className={estilizarModal()}>
      <Toast
        ref={referenciaToast}
        onHide={fecharToast}
        position="bottom-center"
      />
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          Tipo de Perfil:
        </label>
        <label>{exibirPerfilFormatado()}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          CPF -- nome de usuario:
        </label>
        <label>{dados.cpf}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          Nome Completo:
        </label>
        <label>{dados.nome}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          Email:
        </label>
        <label>{dados.email}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          Questao de Seguranca:
        </label>
        <label>{dados.questao}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          Resposta:
        </label>
        <label>{dados.resposta}</label>
      </div>
      <div className={estilizarInlineFlex()}>
        <Button
          label={labelOperacao()}
          onClick={executarOperacao}
          className={estilizarBotao(confirmacaoUsuario?.cor_tema)}
        />
        <Button
          label="Corrigir"
          onClick={ocultar}
          className={estilizarBotaoRemover(confirmacaoUsuario?.cor_tema)}
        />
      </div>
    </div>
  );
}
