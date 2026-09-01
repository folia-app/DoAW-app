import store from './index'
import { ethers } from 'ethers'
import Contracts from 'nft-contracts'

const network = import.meta.env.VITE_NETWORK_NAME
const infuraKey = import.meta.env.VITE_INFURA_KEY

const infuraProvider = new ethers.providers.InfuraProvider(network, infuraKey)

const NFTContractDeploy = Contracts.DoAW

function getNftContract (provider) {
  return new ethers.Contract(NFTContractDeploy.networks[network].address, NFTContractDeploy.abi, provider)
}

async function getProvider({ name }) {
  let provider = infuraProvider
  name = name ?? import.meta.env.VITE_NETWORK_NAME

  // swap-in window provider if on correct network
  if (window.ethereum) {
    const windowProvider = new ethers.providers.Web3Provider(window.ethereum)

    try {
      const network = await windowProvider.getNetwork()
      if (network.name === name) {
        provider = windowProvider
      }
    } catch (e) {
      // console.error(e)
    }
  }
  return provider
}

/**
 * Historical log reads, which must not go through the visitor's wallet or Infura.
 *
 * Both listings used to call queryFilter(filter, 0) — every block since genesis
 * in one request — against InfuraProvider. Infura caps eth_getLogs at 10,000
 * blocks and answers `-32602: range NNN exceeds limit of 10000`, so both calls
 * threw, neither .then() ran, NFTS_LOADED and SHADOAWS_LOADED never committed,
 * and the grid sat empty with an unhandled rejection in the console. The DoAW
 * server hit the identical cap and stopped rendering GIFs for two years before
 * anyone noticed; this is the same bug in a second place.
 *
 * Chunking alone is not the answer. Against a 10k cap this range needs well over
 * a thousand sequential requests — minutes of page load, which is a worse bug
 * than the one being fixed. So the read goes to an endpoint that answers the
 * whole range at once (measured: 291 transfers in ~1.1s, one request), and
 * chunking exists only as the fallback when that endpoint is unavailable.
 *
 * VITE_READ_RPC overrides the endpoint. It is read-only and carries no key.
 */
const READ_RPC = import.meta.env.VITE_READ_RPC || 'https://mainnet.gateway.tenderly.co'
const readProvider = new ethers.providers.JsonRpcProvider(READ_RPC)
const DEPLOY_BLOCK = Number(import.meta.env.VITE_DEPLOY_BLOCK || 18000000)

async function scanLogs (address, abi, filterName) {
  const contract = new ethers.Contract(address, abi, readProvider)
  const filter = contract.filters[filterName]()
  try {
    return await contract.queryFilter(filter, 0)
  } catch (e) {
    // Range-capped endpoint: walk it, halving whenever the range is refused.
    console.warn('wide log query refused, falling back to chunked scan', e.message)
    const latest = await readProvider.getBlockNumber()
    const found = []
    let from = DEPLOY_BLOCK
    let chunk = 100000
    while (from <= latest) {
      const to = Math.min(from + chunk - 1, latest)
      try {
        found.push(...(await contract.queryFilter(filter, from, to)))
        from = to + 1
      } catch (err) {
        if (chunk <= 2000) throw err
        chunk = Math.floor(chunk / 2)
      }
    }
    return found
  }
}

async function init() {
  let provider = await getProvider({})
  let nftContract = getNftContract(provider)
  // let metadataContract = new ethers.Contract(Metadata.networks[network].address, Metadata.abi, provider)

  // get all previous Transfer events from NFTContract
  scanLogs(NFTContractDeploy.networks[network].address, NFTContractDeploy.abi, 'Transfer')
    .then((events) => {
      store.commit('NFTS_LOADED')
      events.forEach(processNFTTransfer)
    })
    .catch((e) => {
      // Commit regardless. Leaving the grid in a permanent loading state is how
      // this failure stayed invisible; an empty list and a console error at
      // least says something went wrong.
      console.error('failed to load DoAW transfers', e)
      store.commit('NFTS_LOADED')
    })

  // listen for transfers
  nftContract.on('Transfer', wrappedProcessNFTTransfer)

  // =======================================
  // shaDoAW
  // =======================================
  
  let shadoawContract = new ethers.Contract(Contracts.shaDoAW.networks[network].address, Contracts.shaDoAW.abi, provider)
  console.log(network, Contracts.shaDoAW.networks[network].address)

  // get all previous Transfer events from shaDoAW
  scanLogs(Contracts.shaDoAW.networks[network].address, Contracts.shaDoAW.abi, 'Transfer')
    .then((events) => {
      store.commit('SHADOAWS_LOADED')
      events.forEach(processShadoawTransfer)
    })
    .catch((e) => {
      console.error('failed to load shaDoAW transfers', e)
      store.commit('SHADOAWS_LOADED')
    })

  // listen for transfers
  // shadoawContract.on('Transfer', wrappedProcessNFTTransfer)

  // metadataContract.baseURI().then((baseURI) => {
  //   store.commit('BASE_URI', baseURI)
  // })
}

// helpers

function wrappedProcessNFTTransfer(...args) {
  processNFTTransfer({ args })
}

function processNFTTransfer(event) {
  var from = event.args[0]
  var to = event.args[1].toString()
  var tokenId = event.args[2].toString() // ethers.BigNumber.from(event.args[2])
  if (from === ethers.constants.AddressZero) {
    const nft = { tokenId, owner: to }
    store.commit('ADD_NFT', nft)
  } else {
    let nft = store.state.nfts.find(nft => nft.tokenId === tokenId.toString())
    nft.owner = to
    store.commit('UPDATE_NFT', nft)
  }
}

function processShadoawTransfer(event) {
  var from = event.args[0]
  var to = event.args[1].toString()
  var tokenId = event.args[2].toString() // ethers.BigNumber.from(event.args[2])
  if (from === ethers.constants.AddressZero) {
    const shadoaw = { tokenId, owner: to, captured: false }
    store.commit('ADD_SHADOAW', shadoaw)
  } else {
    const shadoaw = store.state.shadoaws.find(shadoaw => shadoaw.tokenId === tokenId.toString())
    shadoaw.owner = to
    shadoaw.captured = true
    store.commit('UPDATE_SHADOAW', shadoaw)
  }
}

export { init, getProvider, getNftContract, NFTContractDeploy }

