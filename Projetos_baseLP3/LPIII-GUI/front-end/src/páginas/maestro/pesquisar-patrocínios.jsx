import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoMaestro from "../../contextos/contexto-maestro";
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarPatrocíniosPeçaMusical } from "../../serviços/serviços-maestro";
import {
  TAMANHOS,
  estilizarBotãoRetornar,
  estilizarBotãoTabela,
  estilizarCard,
  estilizarColumnHeader,
  estilizarColunaConsultar,
  estilizarDataTable,
  estilizarDataTablePaginator,
  estilizarDivider,
  estilizarFilterMenu,
  estilizarFlex,
  estilizarTriStateCheckbox,
} from "../../utilitários/estilos";
export default function PesquisarPatrocínios() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const {
    patrocínioConsultado,
    setPatrocínioConsultado,
    peçaMusicalConsultada,
  } = useContext(ContextoMaestro);
  const [listaPatrocínios, setListaPatrocínios] = useState([]);
  const navegar = useNavigate();

  function retornarCadastrarPeçaMusical() {
    setPatrocínioConsultado(null);
    navegar("../cadastrar-peca-musical");
  }

  function ConsultarTemplate(patrocínio) {
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotãoTabela(
          usuárioLogado.cor_tema,
          patrocínioConsultado?.id === patrocínio.id
        )}
        tooltip="Consultar patrocínio"
        tooltipOptions={{ position: "top" }}
        onClick={() => {
          setPatrocínioConsultado(patrocínio);
          navegar("../consultar-patrocinio");
        }}
      />
    );
  }
  // function DropdownÁreaTemplate(opções) {
  //   function alterarFiltroDropdown(event) {
  //     return opções.filterCallback(event.value, opções.index);
  //   }
  //   return (
  //     <Dropdown
  //       value={opções.value}
  //       options={opçõesCategoria}
  //       placeholder="Selecione"
  //       onChange={alterarFiltroDropdown}
  //       showClear
  //     />
  //   );
  // }
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
        <label>Show/Exposição:</label>
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
    async function buscarPatrocíniosPeçaMusical() {
      try {
        const response = await serviçoBuscarPatrocíniosPeçaMusical(
          peçaMusicalConsultada?.id
        );
        if (!desmontado && response.data) setListaPatrocínios(response.data);
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "error");
      }
    }
    buscarPatrocíniosPeçaMusical();
    return () => (desmontado = true);
  }, [peçaMusicalConsultada?.id]);
  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} position="bottom-center" />
      <Card
        title="Patrocínios Cadastrados"
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
            field="patrocinador.usuário.nome"
            header="Patrocinador"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="orçamento_disponível"
            header="Orçamento"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="data_proposta"
            header="Data Proposta"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
            body={(rowData) =>
              new Date(rowData.data_proposta).toLocaleDateString()
            }
          />
          <Column
            field="show_exposicao"
            header="Show/Exposição"
            dataType="boolean"
            filter
            showFilterOperator={false}
            body={BooleanBodyTemplate}
            filterElement={BooleanFilterTemplate}
            filterMatchMode="equals"
            showClearButton={false}
            showAddButton={false}
            filterMenuClassName={estilizarFilterMenu()}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
        </DataTable>
        <Divider className={estilizarDivider()} />
        <Button
          className={estilizarBotãoRetornar()}
          label="Retornar"
          onClick={retornarCadastrarPeçaMusical}
        />
      </Card>
    </div>
  );
}
