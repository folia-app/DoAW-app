export default function ({ tokenId, entropy, muted }) {
  entropy = entropy ?? BigInt(tokenId).toString(16).padStart(16, '0')
  return `${import.meta.env.VITE_SERVER}/nft.html#${entropy}${muted ? '-' : ''}`
}