export default function formatarPerfil(perfil) {
  switch (perfil) {
    case "administrador":
      return "Administrador";
    case "usuario":
      return "Usuário";
    default:
      return perfil;
  }
}
