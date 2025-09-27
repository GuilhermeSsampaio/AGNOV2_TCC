import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoPatrocinador from "../../contextos/contexto-patrocinador";
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarPatrocíniosPatrocinador } from "../../serviços/serviços-patrocinador";
import {
  TAMANHOS,
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarBotãoTabela,
  estilizarCard,
  estilizarColumnHeader,
  estilizarColunaConsultar,
  estilizarDataTable,
  estilizarDataTablePaginator,
  estilizarDivider,
  estilizarFlex,
  estilizarTriStateCheckbox,
  estilizarFilterMenu,
} from "../../utilitários/estilos";

export default function AdministrarPatrocínios() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const {
    patrocínioConsultado,
    setPatrocínioConsultado,
    setPeçaMusicalSelecionada,
  } = useContext(ContextoPatrocinador);
  const [listaPatrocínios, setListaPatrocínios] = useState([]);
  const navegar = useNavigate();

  function retornarPáginaInicial() {
    navegar("/pagina-inicial");
  }

  function adicionarPatrocínio() {
    setPatrocínioConsultado(null);
    setPeçaMusicalSelecionada(null);
    navegar("../cadastrar-patrocinio");
  }

  function ConsultarTemplate(patrocínio) {
    function consultar() {
      setPatrocínioConsultado(patrocínio);
      setPeçaMusicalSelecionada(null);
      navegar("../cadastrar-patrocinio");
    }
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotãoTabela(
          usuárioLogado.cor_tema,
          patrocínioConsultado?.id === patrocínio.id
        )}
        tooltip="Consultar patrocínio"
        tooltipOptions={{ position: "top" }}
        onClick={consultar}
      />
    );
  }

  function formatarData(patrocínio) {
    if (patrocínio.data_proposta) {
      return new Date(patrocínio.data_proposta).toLocaleDateString();
    }
    return "";
  }

  function formatarMoeda(patrocínio) {
    if (patrocínio.orçamento_disponível) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(patrocínio.orçamento_disponível);
    }
    return "";
  }

  function BooleanBodyTemplate(patrocínio) {
    if (patrocínio.show_exposicao) return "Sim";
    else return "Não";
  }

  function BooleanFilterTemplate(opções) {
    function alterarFiltroTriState(event) {
      return opções.filterCallback(event.value);
    }
    return (
      <div>
        <label>Show de exposição</label>
        <TriStateCheckbox
          className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)}
          value={opções.value}
          onChange={alterarFiltroTriState}
        />
      </div>
    );
  }

  useEffect(() => {
    let desmontado = false;
    async function buscarPatrocíniosPatrocinador() {
      try {
        const response = await serviçoBuscarPatrocíniosPatrocinador(
          usuárioLogado.cpf
        );
        if (!desmontado && response.data) setListaPatrocínios(response.data);
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "error");
      }
    }
    buscarPatrocíniosPatrocinador();
    return () => (desmontado = true);
  }, [usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} position="bottom-center" />
      <Card
        title="Administrar Patrocínios"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <DataTable
          dataKey="id"
          size="small"
          paginator
          rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhum patrocínio encontrado."
          value={listaPatrocínios}
          responsiveLayout="scroll"
          breakpoint="490px"
          removableSort
          className={estilizarDataTable()}
          paginatorClassName={estilizarDataTablePaginator(
            usuárioLogado.cor_tema
          )}
        >
          <Column
            bodyClassName={estilizarColunaConsultar()}
            body={ConsultarTemplate}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
          />
          <Column
            field="peça_musical.título"
            header="Peça Musical"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="peça_musical.maestro.usuário.nome"
            header="Maestro"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="orçamento_disponível"
            header="Orçamento Disponível"
            body={formatarMoeda}
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="data_proposta"
            header="Data da Proposta"
            body={formatarData}
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="show_exposicao"
            header="Show de exposição"
            body={BooleanBodyTemplate}
            filter
            filterElement={BooleanFilterTemplate}
            filterMatchMode="equals"
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            showClearButton={false}
            showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()}
            showFilterMenuOptions={false}
            sortable
          />
        </DataTable>
        <Divider className={estilizarDivider()} />
        <Button
          className={estilizarBotãoRetornar()}
          label="Retornar"
          onClick={retornarPáginaInicial}
        />
        <Button
          className={estilizarBotão()}
          label="Adicionar"
          onClick={adicionarPatrocínio}
        />
      </Card>
    </div>
  );
}
