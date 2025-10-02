import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { TELEFONE_MÁSCARA } from "../../utilitários/máscaras";
import {
  serviçoCadastrarPatrocinador,
  serviçoAtualizarPatrocinador,
  serviçoBuscarPatrocinador,
} from "../../serviços/serviços-patrocinador";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
  TAMANHOS,
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputMask,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";
export default function CadastrarPatrocinador() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({
    empresa: "",
    telefone: "",
  });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();
  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  }
  function validarCampos() {
    let errosCamposObrigatórios;
    errosCamposObrigatórios = validarCamposObrigatórios(dados);
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  }
  function títuloFormulário() {
    if (usuárioLogado?.cadastrado) return "Alterar Patrocinador";
    else return "Cadastrar Patrocinador";
  }
  async function cadastrarPatrocinador() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarPatrocinador({
          ...dados,
          usuário_info: usuárioLogado,
          empresa: dados.empresa,
          telefone: dados.telefone,
        });
        if (response.data)
          setUsuárioLogado((usuário) => ({
            ...usuário,
            status: response.data.status,
            token: response.data.token,
          }));
        mostrarToast(
          referênciaToast,
          "Patrocinador cadastrado com sucesso!",
          "sucesso"
        );
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }
  async function atualizarPatrocinador() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarPatrocinador({
          ...dados,
          cpf: usuárioLogado.cpf,
        });
        if (response)
          mostrarToast(
            referênciaToast,
            "Patrocinador atualizado com sucesso!",
            "sucesso"
          );
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }
  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar";
    else return "Cadastrar";
  }
  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) atualizarPatrocinador();
    else cadastrarPatrocinador();
  }
  function redirecionar() {
    if (cpfExistente) {
      setUsuárioLogado(null);
      navegar("/criar-usuario");
    } else {
      setUsuárioLogado((usuárioLogado) => ({
        ...usuárioLogado,
        cadastrado: true,
      }));
      navegar("/pagina-inicial");
    }
  }
  useEffect(() => {
    let desmontado = false;
    async function buscarDadosPatrocinador() {
      try {
        const response = await serviçoBuscarPatrocinador(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados((dados) => ({
            ...dados,
            empresa: response.data.empresa,
            telefone: response.data.telefone,
          }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    if (usuárioLogado?.cadastrado) buscarDadosPatrocinador();
    return () => (desmontado = true);
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);
  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referênciaToast}
        onHide={redirecionar}
        position="bottom-center"
      />
      <Card
        title={títuloFormulário()}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>Empresa*:</label>
          <InputText
            name="empresa"
            className={estilizarInputText(erros.empresa, 400, dados.cor_tema)}
            value={dados.empresa}
            onChange={alterarEstado}
          />

          <MostrarMensagemErro mensagem={erros.empresa} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Telefone*:
          </label>
          <InputMask
            name="telefone"
            autoClear
            size={TAMANHOS.TELEFONE}
            onChange={alterarEstado}
            className={estilizarInputMask(
              erros.telefone,
              usuárioLogado.cor_tema
            )}
            mask={TELEFONE_MÁSCARA}
            value={dados.telefone}
          />
          <MostrarMensagemErro mensagem={erros.telefone} />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={redirecionar}
          />
          <Button
            className={estilizarBotão()}
            label={labelBotãoSalvar()}
            onClick={açãoBotãoSalvar}
          />
        </div>
      </Card>
    </div>
  );
}
