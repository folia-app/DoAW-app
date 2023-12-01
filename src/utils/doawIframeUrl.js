import tokenIdtoEntropy from "./tokenIdtoEntropy"

export default function ({ tokenId, entropy, muted }) {
  entropy = entropy ?? tokenIdtoEntropy(tokenId)
  return `${import.meta.env.VITE_SERVER}/nft.html#${entropy}${muted ? '-' : ''}`
}