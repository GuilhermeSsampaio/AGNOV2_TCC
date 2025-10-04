import { useContext } from "react";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import ContextoUsuario from "../../contextos/contexto_usuario";
import imge from "../../imagens/imagem.png";
import {
  estilizarCard,
  estilizarCardHeaderCentralizado,
  estilizarPaginaUnica,
} from "../../utilitarios/estilos";
export default function PaginaInicial() {
  const { usuarioLogado } = useContext(ContextoUsuario);
  function HeaderCentralizado() {
    return (
      <div className={estilizarCardHeaderCentralizado()}>
        Bem-vindo a plataforma
      </div>
    );
  }
  return (
    <div className={estilizarPaginaUnica()}>
      <Card
        header={HeaderCentralizado}
        className={estilizarCard(usuarioLogado.cor_tema)}
      >
        <Image
          src={imge}
          alt="Ilustracao inspiradora"
          width={900}
          height={500}
        />
      </Card>
    </div>
  );
}
