import { ethers } from 'ethers'

export default function (tokenId) {
  // adapated from doaw.js in DoAW repo
  tokenId = ethers.BigNumber.from(tokenId)
  const entropyHex = tokenId.toHexString(16).replace('0x', '').padStart(32, '0')
  return entropyHex
}