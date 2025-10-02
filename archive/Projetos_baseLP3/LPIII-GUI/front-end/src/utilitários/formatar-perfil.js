export default function formatarPerfil(perfil) {
  switch (perfil) {
    case "maestro":
      return "Maestro";
    case "patrocinador":
      return "Patrocinador";
    default:
      return;
  }
}
