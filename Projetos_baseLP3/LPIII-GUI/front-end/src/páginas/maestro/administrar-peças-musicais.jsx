import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import ContextoMaestro from "../../contextos/contexto-maestro";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoBuscarPeçasMusicaisMaestro } from "../../serviços/serviços-maestro";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  TAMANHOS,
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarBotãoTabela,
  estilizarCard,
  estilizarColunaConsultar,
  estilizarColumnHeader,
  estilizarDataTable,
  estilizarDataTablePaginator,
  estilizarDivider,
  estilizarFilterMenu,
  estilizarFlex,
  estilizarTriStateCheckbox,
} from "../../utilitários/estilos";

export default function AdministrarPeçasMusicais() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { peçaMusicalConsultada, setPeçaMusicalConsultada } =
    useContext(ContextoMaestro);
  const [listaPeçasMusicais, setListaPeçasMusicais] = useState([]);
  const navegar = useNavigate();

  const opçõesGênero = [
    { label: "Clássico", value: "clássico" },
    { label: "Pop", value: "pop" },
    { label: "Rock", value: "rock" },
  ];

  function retornarPáginaInicial() {
    navegar("/pagina-inicial");
  }

  function adicionarPeçaMusical() {
    setPeçaMusicalConsultada(null);
    navegar("../cadastrar-peca-musical");
  }

  function ConsultarTemplate(peçaMusical) {
    function consultar() {
      setPeçaMusicalConsultada(peçaMusical);
      navegar("../cadastrar-peca-musical");
    }
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotãoTabela(
          usuárioLogado.cor_tema,
          peçaMusicalConsultada?.id === peçaMusical.id
        )}
        tooltip="Consultar Peça Musical"
        tooltipOptions={{ position: "top" }}
        onClick={consultar}
      />
    );
  }

  function DropdownGêneroTemplate(opções) {
    function alterarFiltroDropdown(event) {
      return opções.filterCallback(event.value, opções.index);
    }
    return (
      <Dropdown
        value={opções.value}
        options={opçõesGênero}
        placeholder="Selecione"
        onChange={alterarFiltroDropdown}
        showClear
      />
    );
  }

  function BooleanBodyTemplate(peçaMusical) {
    if (peçaMusical.internacional) return "Sim";
    else return "Não";
  }

  function BooleanFilterTemplate(opções) {
    function alterarFiltroTriState(event) {
      return opções.filterCallback(event.value);
    }
    return (
      <div>
        <label>Internacional</label>
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
    async function buscarPeçasMusicaisMaestro() {
      try {
        const response = await serviçoBuscarPeçasMusicaisMaestro(
          usuárioLogado.cpf
        );
        if (!desmontado && response.data) {
          setListaPeçasMusicais(response.data);
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    buscarPeçasMusicaisMaestro();
    return () => (desmontado = true);
  }, [usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Card
        title="Administrar Peças Musicais"
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
            filterElement={DropdownGêneroTemplate}
            showClearButton={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()}
            showFilterMenuOptions={false}
            sortable
          />
          <Column
            field="internacional"
            header="Internacional"
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
          onClick={adicionarPeçaMusical}
        />
      </Card>
    </div>
  );
}
