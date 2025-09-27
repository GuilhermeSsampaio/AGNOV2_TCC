import { Router } from "express";
import ServiçosUsuário from "../serviços/serviços-usuário";
import verificarToken from "../middlewares/verificar-token";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";

const RotasUsuário = Router();
export default RotasUsuário;

// Rotas públicas
RotasUsuário.post("/login", ServiçosUsuário.logarUsuário);
RotasUsuário.post("/verificar-cpf/:cpf", ServiçosUsuário.verificarCpfExistente);

// Rota de cadastro
RotasUsuário.post("/cadastrar", ServiçosUsuário.cadastrarUsuário);

// Rotas que exigem autenticação
RotasUsuário.patch(
  "/alterar-usuario",
  verificarToken,
  ServiçosUsuário.alterarUsuário
);
RotasUsuário.delete(
  "/:cpf",
  verificarToken,
  verificarErroConteúdoToken,
  ServiçosUsuário.removerUsuário
);

// Outras rotas
RotasUsuário.get("/questao/:cpf", ServiçosUsuário.buscarQuestãoSegurança);
RotasUsuário.post(
  "/verificar-resposta",
  ServiçosUsuário.verificarRespostaCorreta
);
RotasUsuário.get("/", ServiçosUsuário.listarTodosUsuários);
