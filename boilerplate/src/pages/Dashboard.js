import React from "react";
import CardBase from "../components/CardBase";

export default function Dashboard() {
  return (
    <div className="grid">
      <div className="col-12 md:col-6 lg:col-4">
        <CardBase title="Estoque">
          <p>Controle de estoque aqui.</p>
        </CardBase>
      </div>
      <div className="col-12 md:col-6 lg:col-4">
        <CardBase title="Usuários">
          <p>Lista de usuários aqui.</p>
        </CardBase>
      </div>
    </div>
  );
}