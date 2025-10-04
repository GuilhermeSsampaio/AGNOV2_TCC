import servidor from "./servidor";

export function servicoLogarUsuario(login) {
  return servidor.post("usuarios/login", login);
}

export function servicoVerificarCpfExistente(cpf) {
  return servidor.post(`/usuarios/verificar-cpf/${cpf}`);
}

export function servicoAlterarUsuario(usuario) {
  const { tokenRecuperacao, ...payload } = usuario;
  const config = tokenRecuperacao
    ? { headers: { Authorization: `Bearer ${tokenRecuperacao}` } }
    : undefined;
  return servidor.patch("/usuarios/alterar-usuario", payload, config);
}
export function servicoRemoverUsuario(cpf) {
  return servidor.delete(`/usuarios/${cpf}`);
}
export function servicoBuscarQuestaoSeguranca(cpf) {
  return servidor.get(`/usuarios/questao/${cpf}`);
}
export function servicoVerificarRespostaCorreta(resposta) {
  return servidor.post("/usuarios/verificar-resposta", resposta);
}
export function servicoCadastrarUsuario(usuario) {
  return servidor.post("/usuarios/cadastrar", usuario);
}
