export default function formatarPerfil(perfil) {
  switch (perfil) {
    case "administrador":
      return "Administrador";
    case "usuario":
      return "Usuario";
    default:
      return perfil;
  }
}
