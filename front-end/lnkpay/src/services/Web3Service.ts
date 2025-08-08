import Web3 from "web3";

import ABI from "./ABI.json";

const CONTRACT_ADDRESS = "XXXXX";

interface AddLinkParams {
  url: string;
  linkId: string;
  feeInWei: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectContract(): Promise<any> {
  if (!window.ethereum) throw new Error("Sem MetaMask instalada");

  const web3 = new Web3(window.ethereum);
  const accounts: string[] = await web3.eth.requestAccounts();
  if (!accounts || !accounts.length) throw new Error("Carteira não permitida");

  return new web3.eth.Contract(ABI as any, CONTRACT_ADDRESS, {
    from: accounts[0],
  });
}

export async function addLink({
  url,
  linkId,
  feeInWei,
}: AddLinkParams): Promise<any> {
  const contract = await connectContract();
  return contract.methods.addLink(url, linkId, feeInWei).send();
}

export async function getLink(linkId: string): Promise<any> {
  const contract = await connectContract();
  return contract.methods.getLink(linkId).call();
}

export async function payLink(
  linkId: string,
  valueInWei: string
): Promise<any> {
  const contract = await connectContract();
  return contract.methods.payLink(linkId).send({
    value: valueInWei,
  });
}
