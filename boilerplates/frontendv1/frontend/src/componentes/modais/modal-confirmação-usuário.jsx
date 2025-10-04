import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import formatarPerfil from "../../utilitários/formatar-perfil";
import {
  estilizarBotão,
  estilizarBotãoRemover,
  estilizarDivCampo,
  estilizarInlineFlex,
  estilizarLabel,
  estilizarModal,
} from "../../utilitários/estilos";
import {
  serviçoAlterarUsuário,
  serviçoCadastrarUsuário,
  serviçoRemoverUsuário,
} from "../../serviços/serviços-usuário";
import mostrarToast from "../../utilitários/mostrar-toast";

export default function ModalConfirmaçãoUsuário() {
  const referênciaToast = useRef(null);
  const {
    setUsuárioLogado,
    confirmaçãoUsuário,
    setConfirmaçãoUsuário,
    setMostrarModalConfirmação,
    usuárioLogado,
  } = useContext(ContextoUsuário);
  const dados = {
    cpf: confirmaçãoUsuário?.cpf,
    perfil: confirmaçãoUsuário?.perfil,
    nome: confirmaçãoUsuário?.nome,
    senha: confirmaçãoUsuário?.senha,
    email: confirmaçãoUsuário?.email,
    questão: confirmaçãoUsuário?.questão,
    resposta: confirmaçãoUsuário?.resposta,
    cor_tema: confirmaçãoUsuário?.cor_tema,
  };
  const [destinoRedirecionamento, setDestinoRedirecionamento] = useState(null);

  const navegar = useNavigate();
  function labelOperação() {
    switch (confirmaçãoUsuário?.operação) {
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
    return formatarPerfil(dados.perfil) || dados.perfil || "Usuário";
  }

  function fecharToast() {
    if (destinoRedirecionamento) {
      setMostrarModalConfirmação(false);
      setConfirmaçãoUsuário({});
      if (confirmaçãoUsuário?.operação === "remover") {
        setUsuárioLogado({});
      }
      navegar(destinoRedirecionamento);
      setDestinoRedirecionamento(null);
    }
  }
  async function salvarUsuario() {
    try {
      const response = await serviçoCadastrarUsuário({
        cpf: dados.cpf,
        nome: dados.nome,
        perfil: dados.perfil,
        email: dados.email,
        senha: dados.senha,
        questao: dados.questão,
        resposta: dados.resposta,
        cor_tema: dados.cor_tema,
      });
      setUsuárioLogado({
        ...response.data.usuario,
        token: response.data.token,
        cpf: dados.cpf,
        cadastrado: true,
      });
      setDestinoRedirecionamento("../pagina-inicial");
      mostrarToast(
        referênciaToast,
        "Cadastro realizado com sucesso! Redirecionando à Página Inicial...",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(
        referênciaToast,
        error.response?.data?.erro || "Não foi possível concluir o cadastro.",
        "erro"
      );
    }
  }
  async function alterarUsuário(dadosAlterados) {
    try {
      const response = await serviçoAlterarUsuário({
        ...dadosAlterados,
        cpf: usuárioLogado.cpf,
      });
      setUsuárioLogado({ ...usuárioLogado, ...response.data });
      setDestinoRedirecionamento("../pagina-inicial");
      mostrarToast(
        referênciaToast,
        "Alterado com sucesso! Redirecionando à Página Inicial...",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(
        referênciaToast,
        error.response?.data?.erro || "Não foi possível alterar os dados.",
        "erro"
      );
    }
  }
  async function removerUsuário() {
    try {
      await serviçoRemoverUsuário(usuárioLogado.cpf);
      setDestinoRedirecionamento("../");
      mostrarToast(
        referênciaToast,
        "Removido com sucesso! Redirecionando ao Login.",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(
        referênciaToast,
        error.response?.data?.erro || "Não foi possível remover o usuário.",
        "erro"
      );
    }
  }

  function executarOperação() {
    switch (confirmaçãoUsuário?.operação) {
      case "salvar":
        salvarUsuario();
        break;
      case "alterar":
        alterarUsuário({
          email: dados.email,
          senha: dados.senha,
          questão: dados.questão,
          resposta: dados.resposta,
          cor_tema: dados.cor_tema,
        });
        break;
      case "remover":
        removerUsuário();
        break;
      default:
        break;
    }
  }

  function ocultar() {
    if (!destinoRedirecionamento) {
      setConfirmaçãoUsuário({});
      setMostrarModalConfirmação(false);
    }
  }
  return (
    <div className={estilizarModal()}>
      <Toast
        ref={referênciaToast}
        onHide={fecharToast}
        position="bottom-center"
      />
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          Tipo de Perfil:
        </label>
        <label>{exibirPerfilFormatado()}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          CPF -- nome de usuário:
        </label>
        <label>{dados.cpf}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          Nome Completo:
        </label>
        <label>{dados.nome}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          Email:
        </label>
        <label>{dados.email}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          Questão de Segurança:
        </label>
        <label>{dados.questão}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          Resposta:
        </label>
        <label>{dados.resposta}</label>
      </div>
      <div className={estilizarInlineFlex()}>
        <Button
          label={labelOperação()}
          onClick={executarOperação}
          className={estilizarBotão(confirmaçãoUsuário?.cor_tema)}
        />
        <Button
          label="Corrigir"
          onClick={ocultar}
          className={estilizarBotãoRemover(confirmaçãoUsuário?.cor_tema)}
        />
      </div>
    </div>
  );
}
