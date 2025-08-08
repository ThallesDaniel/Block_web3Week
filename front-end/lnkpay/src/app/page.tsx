"use client";

import { useState, ChangeEvent } from "react";
import hash from "object-hash";
import { addLink } from "@/services/Web3Service";

interface AddLinkParams {
  url: string;
  linkId: string;
  feeInWei: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [fee, setFee] = useState<string>("0");

  function onUrlChange(event: ChangeEvent<HTMLInputElement>) {
    setUrl(event.target.value);
  }

  function onFeeChange(event: ChangeEvent<HTMLInputElement>) {
    setFee(event.target.value);
  }

  function btnCreateClick() {
    const linkId = hash(url).slice(0, 5);
    setMessage(`Enviando seu link para blockchain...aguarde...`);

    addLink({ url, linkId, feeInWei: fee } as AddLinkParams)
      .then(() => {
        setUrl("");
        setFee("0");
        setMessage(
          `Seu link foi criado com sucesso: http://localhost:3000/${linkId}`
        );
      })
      .catch((err: Error) => setMessage(err.message));
  }

  return (
    <div className="container px-4 py-5">
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-6">
          <img
            src="/logo.png"
            className="d-block mx-lg-auto img-fluid"
            width={700}
            alt="Imagem de segurança digital"
          />
        </div>
        <div className="col-6">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
            LinkShield
          </h1>
          <p className="lead">Proteja seus links. Lucre com eles.</p>
          <hr />
          <p>
            Cole a sua URL abaixo, defina a taxa por clique e conecte sua
            carteira para proteger seu link com a tecnologia blockchain.
          </p>

          <div className="form-floating mb-3">
            <input
              type="text"
              id="url"
              className="form-control"
              value={url}
              onChange={onUrlChange}
            />
            <label htmlFor="url">Link:</label>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <div className="form-floating">
                <input
                  type="number"
                  id="fee"
                  className="form-control"
                  value={fee}
                  onChange={onFeeChange}
                />
                <label htmlFor="fee">Taxa por clique (wei):</label>
              </div>
            </div>
            <div className="col-6">
              <button
                type="button"
                className="btn btn-primary w-100 h-100"
                onClick={btnCreateClick}
              >
                <img
                  src="/metamask.svg"
                  width={32}
                  className="me-2"
                  alt="MetaMask"
                />
                Conectar e Criar Link
              </button>
            </div>
          </div>

          {message && (
            <div
              className="alert alert-success p-3 col-12 mt-3"
              role="alert"
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
