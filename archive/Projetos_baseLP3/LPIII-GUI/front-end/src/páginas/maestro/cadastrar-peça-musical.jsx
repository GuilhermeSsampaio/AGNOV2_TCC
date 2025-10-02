import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";

import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMaestro from "../../contextos/contexto-maestro";
import {
  serviçoAlterarPeçaMusical,
  serviçoCadastrarPeçaMusical,
  serviçoRemoverPeçaMusical,
  serviçoBuscarPatrocíniosPeçasMusicais,
} from "../../serviços/serviços-maestro";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
  estilizarBotão,
  estilizarBotãoRemover,
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarDropdown,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarInputNumber,
  estilizarLabel,
  estilizarCheckbox,
} from "../../utilitários/estilos";

export default function CadastrarPeçaMusical() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { peçaMusicalConsultada } = useContext(ContextoMaestro);
  const [dados, setDados] = useState({
    título: peçaMusicalConsultada?.título || "",
    duração: peçaMusicalConsultada?.duração || "",
    tom: peçaMusicalConsultada?.tom || "",
    gênero: peçaMusicalConsultada?.gênero || "",
    internacional: peçaMusicalConsultada?.internacional || false,
  });
  const [listaGêneros, setListaGêneros] = useState([]);
  const [erros, setErros] = useState({});
  const navegar = useNavigate();

  const opçõesGênero = [
    { label: "Clássico", value: "clássico" },
    { label: "Pop", value: "pop" },
    { label: "Rock", value: "rock" },
  ];

  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    let valor = event.target.value || event.checked;
    setDados({ ...dados, [chave]: valor });
  }

  function validarCampos() {
    const { título, duração, tom, gênero, internacional } = dados;
    let errosCamposObrigatórios = validarCamposObrigatórios({
      título,
      duração,
      tom,
      gênero,
      internacional,
    });
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  }

  function retornarAdministrarPeçasMusicais() {
    navegar("../administrar-pecas-musicais");
  }

  async function cadastrarPeçaMusical() {
    if (validarCampos()) {
      try {
        const dadosAjustados = {
          ...dados,
          cpf: usuárioLogado.cpf,
        };

        await serviçoCadastrarPeçaMusical(dadosAjustados);
        mostrarToast(
          referênciaToast,
          "Peça Musical cadastrada com sucesso!",
          "sucesso"
        );
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }

  async function alterarPeçaMusical() {
    if (validarCampos()) {
      try {
        const dadosAjustados = {
          ...dados,
          id: peçaMusicalConsultada.id,
        };

        await serviçoAlterarPeçaMusical(dadosAjustados);
        mostrarToast(
          referênciaToast,
          "Peça Musical alterada com sucesso!",
          "sucesso"
        );
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }

  async function removerPeçaMusical() {
    try {
      await serviçoRemoverPeçaMusical(peçaMusicalConsultada.id);
      mostrarToast(
        referênciaToast,
        "Peça Musical excluída com sucesso!",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(referênciaToast, error.response.data.erro, "erro");
    }
  }

  function BotõesAções() {
    if (peçaMusicalConsultada) {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarPeçasMusicais}
          />
          <Button
            className={estilizarBotãoRemover()}
            label="Remover"
            onClick={removerPeçaMusical}
          />
          <Button
            className={estilizarBotão()}
            label="Alterar"
            onClick={alterarPeçaMusical}
          />
          <Button
            className={estilizarBotão()}
            label="Patrocínios"
            onClick={mostrarPatrocínios}
          />
        </div>
      );
    } else {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarPeçasMusicais}
          />
          <Button
            className={estilizarBotão()}
            label="Cadastrar"
            onClick={cadastrarPeçaMusical}
          />
        </div>
      );
    }
  }

  function títuloFormulário() {
    if (peçaMusicalConsultada) return "Alterar Peça Musical";
    else return "Cadastrar Peça Musical";
  }

  function mostrarPatrocínios() {
    navegar("../pesquisar-patrocinios");
  }

  useEffect(() => {
    async function buscarGênerosPeçasMusicais() {
      try {
        const response = await serviçoBuscarPatrocíniosPeçasMusicais();
        if (response.data) setListaGêneros(response.data);
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    buscarGênerosPeçasMusicais();
  }, []);

  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referênciaToast}
        onHide={retornarAdministrarPeçasMusicais}
        position="bottom-center"
      />
      <Card
        title={títuloFormulário()}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Título*:
          </label>
          <InputText
            name="título"
            className={estilizarInputText(
              erros.título,
              400,
              usuárioLogado.cor_tema
            )}
            value={dados.título}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.título} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Duração (minutos)*:
          </label>
          <InputNumber
            name="duração"
            className={estilizarInputNumber(
              erros.duração,
              usuárioLogado.cor_tema
            )}
            value={dados.duração}
            onValueChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.duração} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Tom*:
          </label>
          <InputText
            name="tom"
            className={estilizarInputText(
              erros.tom,
              200,
              usuárioLogado.cor_tema
            )}
            value={dados.tom}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.tom} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Gênero*:
          </label>
          <Dropdown
            name="gênero"
            className={estilizarDropdown(erros.gênero, usuárioLogado.cor_tema)}
            value={dados.gênero}
            options={opçõesGênero}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.gênero} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Internacional*:
          </label>{" "}
          <Checkbox
            name="internacional"
            checked={dados.internacional}
            onChange={alterarEstado}
            className={estilizarCheckbox(null)}
            autoResize
          />
          <MostrarMensagemErro mensagem={erros.internacional} />
        </div>

        <Divider className={estilizarDivider()} />
        <BotõesAções />
      </Card>
    </div>
  );
}
