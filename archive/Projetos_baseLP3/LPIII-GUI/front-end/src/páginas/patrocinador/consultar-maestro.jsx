import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoPatrocinador from "../../contextos/contexto-patrocinador";
import {
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";
export default function ConsultarMaestro() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { maestroProponente } = useContext(ContextoPatrocinador);
  const dados = {
    nome_maestro: maestroProponente?.usuário?.nome,
    estilo: maestroProponente?.estilo,
    anos_experiência: maestroProponente?.anos_experiência,
    nacionalidade: maestroProponente?.nacionalidade,
  };
  console.log("dads", maestroProponente);
  const navegar = useNavigate();
  function retornarConsultarPatrocínio() {
    navegar("/consultar-peca-musical");
  }
  return (
    <div className={estilizarFlex()}>
      <Card
        title="Consultar Maestro"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Maestro:
          </label>
          <InputText
            name="nome_maestro"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome_maestro}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Estilo:
          </label>
          <InputText
            name="estilo"
            className={estilizarInputText(null, 150, usuárioLogado.cor_tema)}
            value={dados.estilo}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Anos de Experiência:
          </label>
          <InputNumber
            name="anos_experiência"
            size={5}
            value={dados.anos_experiência}
            inputClassName={estilizarInputText(null, usuárioLogado.cor_tema)}
            mode="decimal"
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Nacionalidade:
          </label>
          <InputText
            name="nacionalidade"
            className={estilizarInputText(null, 150, usuárioLogado.cor_tema)}
            value={dados.nacionalidade}
            disabled
          />
        </div>
        <Divider className={estilizarDivider(usuárioLogado.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarConsultarPatrocínio}
          />
        </div>
      </Card>
    </div>
  );
}
