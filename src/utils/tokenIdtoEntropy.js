export default function (tokenId) {
  return BigInt(tokenId).toString(16).padStart(16, '0')
}