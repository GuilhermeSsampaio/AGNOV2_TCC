import servidor from "./servidor";
export function serviçoCadastrarPatrocinador(patrocinador) {
  return servidor.post("/patrocinadores", patrocinador);
}
export function serviçoAtualizarPatrocinador(patrocinador) {
  return servidor.patch("/patrocinadores", patrocinador);
}
export function serviçoBuscarPatrocinador(cpf) {
  return servidor.get(`/patrocinadores/${cpf}`);
}

export function serviçoCadastrarPatrocínio(patrocínio) {
  return servidor.post("/patrocinadores/patrocinios", patrocínio);
}
export function serviçoRemoverPatrocínio(id) {
  return servidor.delete(`/patrocinadores/patrocinios/${id}`);
}
export function serviçoBuscarPatrocíniosPatrocinador(cpf) {
  return servidor.get(`/patrocinadores/patrocinios/patrocinador/${cpf}`);
}
export function serviçoBuscarPeçasMusicais() {
  return servidor.get("/patrocinadores/patrocinios/pecas-musicais");
}
