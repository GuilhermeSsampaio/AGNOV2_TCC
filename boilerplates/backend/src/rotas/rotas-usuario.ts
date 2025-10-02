import { Router } from "express";
import ServicosUsuario from "../servicos/servicos-usuario";
import verificarToken from "../middlewares/verificar-token";
import verificarErroConteudoToken from "../middlewares/verificar-erro-conteudo-token";

const RotasUsuario = Router();
export default RotasUsuario;

// Rotas públicas
RotasUsuario.post("/login", ServicosUsuario.logarUsuario);
RotasUsuario.post("/verificar-cpf/:cpf", ServicosUsuario.verificarCpfExistente);

// Rota de cadastro
RotasUsuario.post("/cadastrar", ServicosUsuario.cadastrarUsuario);

// Rotas que exigem autenticação
RotasUsuario.patch(
  "/alterar-usuario",
  verificarToken,
  ServicosUsuario.alterarUsuario
);
RotasUsuario.delete(
  "/:cpf",
  verificarToken,
  verificarErroConteudoToken,
  ServicosUsuario.removerUsuario
);

// Outras rotas
RotasUsuario.get("/questao/:cpf", ServicosUsuario.buscarQuestaoSeguranca);
RotasUsuario.post(
  "/verificar-resposta",
  ServicosUsuario.verificarRespostaCorreta
);
RotasUsuario.get("/", ServicosUsuario.listarTodosUsuarios);
