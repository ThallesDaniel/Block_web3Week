import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getLink, payLink } from "@/services/Web3Service";

interface LinkData {
  fee: string;
  url?: string;
}

interface RouteParams {
  [key: string]: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [link, setLink] = useState<LinkData>({ fee: "0" });

  const params = useParams<RouteParams>();

  useEffect(() => {
    setMessage("Buscando dados do link...aguarde...");
    getLink(params.linkId)
      .then((link: LinkData) => {
        setMessage("");
        if (link.url) {
          window.location.href = link.url;
        } else {
          setLink(link);
        }
      })
      .catch((err: Error) => setMessage(err.message));
  }, [params.linkId]);

  function btnAccessClick() {
    setMessage("Pagando pelo acesso...aguarde...");
    payLink(params.linkId, link.fee)
      .then(() => {
        setMessage("Pagamento realizado...redirecionando...");
        return getLink(params.linkId);
      })
      .then((link: LinkData) => {
        if (link.url) {
          window.location.href = link.url;
        }
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
            alt="Imagem protegida"
          />
        </div>
        <div className="col-6">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
            Link Protegido
          </h1>
          <p className="lead">Este link está protegido pela lnkPay.</p>
          <hr />
          <p>
            Para acessar o conteúdo original, conecte sua carteira abaixo e
            confirme o pagamento da taxa de{" "}
            <strong>{link.fee} wei</strong>.
          </p> 
          <div className="row mb-3">
            <div className="col-6">
              <button
                type="button"
                className="btn btn-primary w-100 h-100"
                onClick={btnAccessClick}
              >
                <img
                  src="/metamask.svg"
                  width={32}
                  className="me-2"
                  alt="MetaMask"
                />
                Pagar e Acessar Link
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