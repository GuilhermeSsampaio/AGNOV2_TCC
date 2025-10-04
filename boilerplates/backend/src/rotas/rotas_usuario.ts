import { Router } from "express";
import ServicosUsuario from "src/servicos/servicos_usuario";
import verificarToken from "src/middlewares/verificar_token";
import verificarErroConteudoToken from "src/middlewares/verificar_erro_conteudo_token";

const RotasUsuario = Router();
export default RotasUsuario;

// Rotas publicas
RotasUsuario.post("/login", ServicosUsuario.logarUsuario);
RotasUsuario.post("/verificar-cpf/:cpf", ServicosUsuario.verificarCpfExistente);

// Rota de cadastro
RotasUsuario.post("/cadastrar", ServicosUsuario.cadastrarUsuario);

// Rotas que exigem autenticacao
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
