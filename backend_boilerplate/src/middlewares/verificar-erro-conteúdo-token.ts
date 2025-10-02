import md5 from "md5";
import Usuário from "../entidades/usuário";

export default async function verificarErroConteúdoToken(
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
        .json({ erro: "Token inválido ou não informado." });
    }
    const usuário_token = await Usuário.findOne({
      where: { email: email_token },
    });
    const usuário = await Usuário.findOne({ where: { cpf: cpf_encriptado } });

    if (!usuário_token || !usuário) {
      return response.status(404).json({ erro: "Usuário não encontrado." });
    }

    if (usuário_token.email !== usuário.email) {
      return response.status(401).json({ erro: "Acesso não autorizado." });
    }
    next();
  } catch (error) {
    return response
      .status(500)
      .json({ erro: "Erro ao verificar conteúdo do token." });
  }
}
