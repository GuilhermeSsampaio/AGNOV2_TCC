import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMaestro from "../../contextos/contexto-maestro";
import { TELEFONE_MÁSCARA } from "../../utilitários/máscaras";
import {
  TAMANHOS,
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

export default function ConsultarPatrocinador() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { patrocinadorConsultado } = useContext(ContextoMaestro);
  console.log("patrocinadorConsultado", patrocinadorConsultado);
  const dados = {
    nome: patrocinadorConsultado?.usuário?.nome,
    empresa: patrocinadorConsultado?.empresa,
    telefone: patrocinadorConsultado?.telefone,
  };

  const navegar = useNavigate();

  function retornarConsultarInteresse() {
    navegar("../consultar-patrocinio");
  }

  return (
    <div className={estilizarFlex()}>
      <Card
        title="Consultar Patrocinador"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Nome*:
          </label>
          <InputText
            name="nome"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome}
            disabled
          />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Empresa*:
          </label>
          <InputText
            name="empresa"
            className={estilizarInputText(null, 300, usuárioLogado.cor_tema)}
            value={dados.empresa}
            disabled
          />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Telefone*:
          </label>
          <InputMask
            name="telefone"
            autoClear
            size={TAMANHOS.TELEFONE}
            mask={TELEFONE_MÁSCARA}
            className={estilizarInputMask(null, usuárioLogado.cor_tema)}
            value={dados.telefone}
            disabled
          />
        </div>

        <Divider className={estilizarDivider(usuárioLogado.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarConsultarInteresse}
          />
        </div>
      </Card>
    </div>
  );
}
