import servidor from "./servidor";

export function serviçoLogarUsuário(login) {
  return servidor.post("usuarios/login", login);
}

export function serviçoVerificarCpfExistente(cpf) {
  return servidor.post(`/usuarios/verificar-cpf/${cpf}`);
}

export function serviçoAlterarUsuário(usuário) {
  const { tokenRecuperação, ...payload } = usuário;
  const config = tokenRecuperação
    ? { headers: { Authorization: `Bearer ${tokenRecuperação}` } }
    : undefined;
  return servidor.patch("/usuarios/alterar-usuario", payload, config);
}
export function serviçoRemoverUsuário(cpf) {
  return servidor.delete(`/usuarios/${cpf}`);
}
export function serviçoBuscarQuestãoSegurança(cpf) {
  return servidor.get(`/usuarios/questao/${cpf}`);
}
export function serviçoVerificarRespostaCorreta(resposta) {
  return servidor.post("/usuarios/verificar-resposta", resposta);
}
export function serviçoCadastrarUsuário(usuário) {
  return servidor.post("/usuarios/cadastrar", usuário);
}
