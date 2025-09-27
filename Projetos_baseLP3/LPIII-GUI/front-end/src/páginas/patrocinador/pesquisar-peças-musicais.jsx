import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import Contextopatrocinador from "../../contextos/contexto-patrocinador";
import { serviçoBuscarPeçasMusicais } from "../../serviços/serviços-patrocinador";
import mostrarToast from "../../utilitários/mostrar-toast";
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
} from "../../utilitários/estilos";
export default function PesquisarPeçasMusicais() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const {
    peçaMusicalConsultada,
    setPeçaMusicalConsultada,
    setPeçaMusicalSelecionada,
  } = useContext(Contextopatrocinador);
  const [listaPeçasMusicais, setListaPeçasMusicais] = useState([]);
  const navegar = useNavigate();

  const opçõesEstilo = [
    { label: "Clássico", value: "clássico" },
    { label: "Pop", value: "pop" },
    { label: "Rock", value: "rock" },
  ];

  function retornarCadastrarPatrocínio() {
    setPeçaMusicalSelecionada(peçaMusicalConsultada);
    setPeçaMusicalConsultada(null);
    navegar("../cadastrar-patrocinio");
  }

  function ConsultarTemplate(peçaMusical) {
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotãoTabela(
          usuárioLogado.cor_tema,
          peçaMusicalConsultada?.id === peçaMusical.id
        )}
        tooltip="Consultar Peça Musical"
        tooltipOptions={{ position: "top" }}
        onClick={() => {
          setPeçaMusicalConsultada(peçaMusical);
          navegar("../consultar-peca-musical");
        }}
      />
    );
  }

  function DropdownEstiloTemplate(opções) {
    function alterarFiltroDropdown(event) {
      return opções.filterCallback(event.value, opções.index);
    }
    return (
      <Dropdown
        value={opções.value}
        options={opçõesEstilo}
        placeholder="Selecione"
        onChange={alterarFiltroDropdown}
        showClear
      />
    );
  }

  useEffect(() => {
    let desmontado = false;
    async function buscarPeçasMusicais() {
      try {
        const response = await serviçoBuscarPeçasMusicais();
        if (!desmontado && response.data) setListaPeçasMusicais(response.data);
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "error");
      }
    }
    buscarPeçasMusicais();
    return () => (desmontado = true);
  }, [usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} position="bottom-center" />
      <Card
        title="Pesquisar Peças Musicais"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <DataTable
          dataKey="id"
          size="small"
          paginator
          rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhuma peça musical encontrada."
          value={listaPeçasMusicais}
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
            field="maestro.usuário.nome"
            header="Nome do Maestro"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="título"
            header="Título"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="duração"
            header="Duração (min)"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="tom"
            header="Tom"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            field="gênero"
            header="Gênero"
            filter
            filterMatchMode="equals"
            filterElement={DropdownEstiloTemplate}
            showClearButton={false}
            showFilterOperator={false}
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
          onClick={retornarCadastrarPatrocínio}
        />
      </Card>
    </div>
  );
}
