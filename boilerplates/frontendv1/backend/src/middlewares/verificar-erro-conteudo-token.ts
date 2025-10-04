import md5 from "md5";
import Usuario from "../entidades/usuario";

export default async function verificarErroConteudoToken(
  request,
  response,
  next
) {
  try {
    const cpf_encriptado = md5(request.params.cpf || request.body.cpf);
    const email_token = request.email_token;
    if (!email_token) {
      return response
        .status(401)
        .json({ erro: "Token invalido ou nao informado." });
    }
    const usuario_token = await Usuario.findOne({
      where: { email: email_token },
    });
    const usuario = await Usuario.findOne({ where: { cpf: cpf_encriptado } });

    if (!usuario_token || !usuario) {
      return response.status(404).json({ erro: "Usuario nao encontrado." });
    }

    if (usuario_token.email !== usuario.email) {
      return response.status(401).json({ erro: "Acesso nao autorizado." });
    }
    next();
  } catch (error) {
    return response
      .status(500)
      .json({ erro: "Erro ao verificar conteudo do token." });
  }
}
