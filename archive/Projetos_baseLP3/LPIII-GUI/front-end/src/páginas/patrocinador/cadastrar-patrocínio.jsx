import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoPatrocinador from "../../contextos/contexto-patrocinador";
import {
  serviçoCadastrarPatrocínio,
  serviçoRemoverPatrocínio,
} from "../../serviços/serviços-patrocinador";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarBotãoRemover,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputNumber,
  estilizarInputText,
  estilizarLabel,
  estilizarCheckbox,
} from "../../utilitários/estilos";
export default function CadastrarPatrocínio() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const {
    patrocínioConsultado,
    peçaMusicalSelecionada,
    setPeçaMusicalPatrocínio,
    setPeçaMusicalConsultada,
  } = useContext(ContextoPatrocinador);
  const [dados, setDados] = useState({
    id_peça: peçaMusicalSelecionada?.id || "",
    orçamento_disponível: patrocínioConsultado?.orçamento_disponível || "",
    show_exposicao: patrocínioConsultado?.show_exposicao || false,
  });
  const [erros, setErros] = useState({});
  const navegar = useNavigate();
  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    let valor = event.target.value || event.checked;
    setDados({ ...dados, [chave]: valor });
  }

  function validarCampos() {
    const { orçamento_disponível } = dados;
    let errosCamposObrigatórios = validarCamposObrigatórios({
      orçamento_disponível,
    });
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  }

  function peçaMusicalLabel() {
    if (patrocínioConsultado?.peça_musical?.título || peçaMusicalSelecionada)
      return "Peça Musical Selecionada*:";
    else return "Selecione uma Peça Musical*:";
  }

  function pesquisarPeçasMusicais() {
    navegar("../pesquisar-pecas-musicais");
  }

  function retornarAdministrarPatrocínios() {
    navegar("../administrar-patrocinios");
  }

  async function cadastrarPatrocínio() {
    if (validarCampos()) {
      try {
        await serviçoCadastrarPatrocínio({ ...dados, cpf: usuárioLogado.cpf });
        mostrarToast(
          referênciaToast,
          "Patrocínio cadastrado com sucesso!",
          "sucesso"
        );
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }

  async function removerPatrocínio() {
    try {
      await serviçoRemoverPatrocínio(patrocínioConsultado.id);
      mostrarToast(
        referênciaToast,
        "Patrocínio removido com sucesso!",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(referênciaToast, error.response.data.erro, "erro");
    }
  }

  function BotõesAções() {
    if (patrocínioConsultado) {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarPatrocínios}
          />
          <Button
            className={estilizarBotãoRemover()}
            label="Remover"
            onClick={removerPatrocínio}
          />
          <Button
            className={estilizarBotão()}
            label="Peça Musical"
            onClick={consultarPeçaMusicalPatrocínio}
          />
        </div>
      );
    } else {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarPatrocínios}
          />
          <Button
            className={estilizarBotão()}
            label="Cadastrar"
            onClick={cadastrarPatrocínio}
          />
        </div>
      );
    }
  }

  function títuloFormulário() {
    if (patrocínioConsultado) return "Alterar Patrocínio";
    else return "Cadastrar Patrocínio";
  }

  function PeçaMusicalInputText() {
    if (peçaMusicalSelecionada?.título) {
      return (
        <InputText
          name="título_peçaMusical"
          className={estilizarInputText(
            erros.título_peçaMusical,
            400,
            usuárioLogado.cor_tema
          )}
          value={peçaMusicalSelecionada?.título}
          disabled
        />
      );
    } else if (patrocínioConsultado?.peça_musical?.título) {
      return (
        <InputText
          name="título_peçaMusical"
          className={estilizarInputText(
            erros.título_peçaMusical,
            400,
            usuárioLogado.cor_tema
          )}
          value={patrocínioConsultado?.peça_musical?.título}
          disabled
        />
      );
    } else return null;
  }

  function BotãoSelecionar() {
    if (!peçaMusicalSelecionada && !patrocínioConsultado) {
      return (
        <Button
          className={estilizarBotão()}
          label="Selecionar"
          onClick={pesquisarPeçasMusicais}
        />
      );
    } else if (peçaMusicalSelecionada) {
      return (
        <Button
          className={estilizarBotão()}
          label="Substituir"
          onClick={pesquisarPeçasMusicais}
        />
      );
    } else return null;
  }

  function consultarPeçaMusicalPatrocínio() {
    setPeçaMusicalPatrocínio(patrocínioConsultado?.peça_musical);
    setPeçaMusicalConsultada(patrocínioConsultado?.peça_musical);
    navegar("../consultar-peca-musical");
  }
  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referênciaToast}
        onHide={retornarAdministrarPatrocínios}
        position="bottom-center"
      />
      <Card
        title={títuloFormulário()}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            {peçaMusicalLabel()}
          </label>
          <BotãoSelecionar />
          <PeçaMusicalInputText />
          <MostrarMensagemErro mensagem={erros.id_peça} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Orçamento Disponível*:
          </label>
          <InputNumber
            name="orçamento_disponível"
            value={dados.orçamento_disponível}
            onValueChange={alterarEstado}
            mode="currency"
            currency="BRL"
            locale="pt-BR"
            className={estilizarInputNumber(
              erros.orçamento_disponível,
              usuárioLogado.cor_tema
            )}
          />
          <MostrarMensagemErro mensagem={erros.orçamento_disponível} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Show de exposição?*:
          </label>{" "}
          <Checkbox
            name="show_exposicao"
            checked={dados.show_exposicao}
            onChange={alterarEstado}
            className={estilizarCheckbox(null)}
            autoResize
          />
          <MostrarMensagemErro mensagem={erros.show_exposicao} />
        </div>

        <Divider className={estilizarDivider()} />
        <BotõesAções />
      </Card>
    </div>
  );
}
