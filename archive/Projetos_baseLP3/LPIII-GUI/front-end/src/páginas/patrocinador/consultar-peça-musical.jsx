import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoPatrocinador from "../../contextos/contexto-patrocinador";
import {
  estilizarBotãoRetornar,
  estilizarBotão,
  estilizarCard,
  estilizarCheckbox,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";
export default function ConsultarPeçaMusical() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const {
    peçaMusicalConsultada,
    peçaMusicalInteresse: peçaMusicalPatrocínio,
    setMaestroProponente,
  } = useContext(ContextoPatrocinador);
  const dados = {
    nome_maestro:
      peçaMusicalConsultada?.maestro?.usuário?.nome ||
      peçaMusicalPatrocínio?.maestro?.usuário?.nome,
    título: peçaMusicalConsultada?.título || peçaMusicalPatrocínio?.título,
    categoria:
      peçaMusicalConsultada?.categoria || peçaMusicalPatrocínio?.categoria,
    área_atuação:
      peçaMusicalConsultada?.área_atuação ||
      peçaMusicalPatrocínio?.área_atuação,
    data_início:
      peçaMusicalConsultada?.data_início || peçaMusicalPatrocínio?.data_início,
    descrição:
      peçaMusicalConsultada?.descrição || peçaMusicalPatrocínio?.descrição,
    internacional:
      peçaMusicalConsultada?.internacional ||
      peçaMusicalPatrocínio?.internacional,
    resultado:
      peçaMusicalConsultada?.resultado || peçaMusicalPatrocínio?.resultado,
  };
  const navegar = useNavigate();
  function retornar() {
    if (peçaMusicalConsultada) navegar("../pesquisar-pecas-musicais");
    else if (peçaMusicalPatrocínio) navegar("../cadastrar-patrocinio");
  }

  function consultarMaestroProponente() {
    if (peçaMusicalConsultada) {
      console.log(peçaMusicalConsultada.maestro);
      setMaestroProponente(peçaMusicalConsultada.maestro);
    } else if (peçaMusicalPatrocínio) {
      setMaestroProponente(peçaMusicalPatrocínio.maestro);
    }
    navegar("../consultar-maestro");
  }
  return (
    <div className={estilizarFlex()}>
      <Card
        title="Consultar Peça Musical"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Maestro*:
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
            Título*:
          </label>
          <InputText
            name="título"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.título}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Duração (minutos)*:
          </label>
          <InputText
            name="duração"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={peçaMusicalConsultada?.duração}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Tom*:
          </label>
          <InputText
            name="tom"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={peçaMusicalConsultada?.tom}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Gênero*:
          </label>
          <InputText
            name="gênero"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={peçaMusicalConsultada?.gênero}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Internacional*:
          </label>
          <Checkbox
            name="internacional"
            checked={dados.internacional}
            className={estilizarCheckbox(null)}
            autoResize
            disabled
          />
        </div>
        <Divider className={estilizarDivider()} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornar}
          />
          <Button
            className={estilizarBotão()}
            label="Maestro"
            onClick={consultarMaestroProponente}
          />
        </div>
      </Card>
    </div>
  );
}
