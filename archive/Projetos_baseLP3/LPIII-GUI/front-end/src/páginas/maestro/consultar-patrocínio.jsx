import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMaestro from "../../contextos/contexto-maestro";
import {
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarCheckbox,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";
export default function ConsultarPatrocínio() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { patrocínioConsultado, setPatrocinadorConsultado } =
    useContext(ContextoMaestro);

  const dados = {
    nome_patrocinador: patrocínioConsultado?.patrocinador?.usuário?.nome,
    orçamento_disponível: patrocínioConsultado?.orçamento_disponível,
    data_proposta: new Date(
      patrocínioConsultado?.data_proposta
    ).toLocaleDateString(),
    show_exposicao: patrocínioConsultado?.show_exposicao,
    título_peça: patrocínioConsultado?.peça_musical?.título,
  };

  const navegar = useNavigate();

  function retornarPesquisarPatrocínios() {
    navegar("../pesquisar-patrocinios");
  }

  function consultarPatrocinador() {
    setPatrocinadorConsultado(patrocínioConsultado.patrocinador);
    navegar("../consultar-patrocinador");
  }

  return (
    <div className={estilizarFlex()}>
      <Card
        title="Consultar Patrocínio"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Patrocinador:
          </label>
          <InputText
            name="nome_patrocinador"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome_patrocinador}
            disabled
          />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Orçamento Disponível:
          </label>
          <InputNumber
            name="orçamento_disponível"
            className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
            value={dados.orçamento_disponível}
            mode="currency"
            currency="BRL"
            disabled
          />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Data da Proposta:
          </label>
          <InputText
            name="data_proposta"
            className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
            value={dados.data_proposta}
            disabled
          />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Show/Exposição:
          </label>
          <Checkbox
            name="show_exposicao"
            checked={dados.show_exposicao}
            className={estilizarCheckbox()}
            disabled
          />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Peça Musical:
          </label>
          <InputText
            name="título_peça"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.título_peça}
            disabled
          />
        </div>

        <Divider className={estilizarDivider()} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarPesquisarPatrocínios}
          />
          <Button
            className={estilizarBotão()}
            label="Patrocinador"
            onClick={consultarPatrocinador}
          />
        </div>
      </Card>
    </div>
  );
}
