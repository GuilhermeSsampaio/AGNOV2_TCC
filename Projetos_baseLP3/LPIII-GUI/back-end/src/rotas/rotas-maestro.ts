import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import ServiçosMaestro from "src/serviços/serviços-maestro";
import verificarPerfilMaestro from "../middlewares/verificar-perfil-maestro";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";

const RotasMaestro = Router();
export default RotasMaestro;

RotasMaestro.post("/", ServiçosMaestro.cadastrarMaestro);
RotasMaestro.get(
  "/:cpf",
  verificarToken,
  verificarPerfilMaestro,
  ServiçosMaestro.buscarMaestro
);

RotasMaestro.patch(
  "/",
  verificarToken,
  verificarPerfilMaestro,
  ServiçosMaestro.atualizarMaestro
);

RotasMaestro.post(
  "/pecas-musicais",
  verificarToken,
  verificarPerfilMaestro,
  ServiçosMaestro.cadastrarPeçaMusical
);
RotasMaestro.patch(
  "/pecas-musicais",
  verificarToken,
  verificarPerfilMaestro,
  ServiçosMaestro.alterarPeçaMusical
);
RotasMaestro.delete(
  "/pecas-musicais/:id",
  verificarToken,
  verificarPerfilMaestro,
  ServiçosMaestro.removerPeçaMusical
);
RotasMaestro.get(
  "/pecas-musicais/maestro/:cpf",
  verificarToken,
  verificarPerfilMaestro,
  verificarErroConteúdoToken,
  ServiçosMaestro.buscarPeçasMusicaisMaestro
);
RotasMaestro.get(
  "/pecas-musicais/patrocinios",
  verificarToken,
  verificarPerfilMaestro,
  ServiçosMaestro.buscarPatrocíniosPeçasMusicais
);

// Rota para buscar patrocínios de uma peça musical específica
RotasMaestro.get(
  "/pecas-musicais/:id/patrocinios",
  ServiçosMaestro.buscarPatrocíniosPeçaMusical
);
