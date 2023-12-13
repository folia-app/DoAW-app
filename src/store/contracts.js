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

async function init() {
  let provider = await getProvider({})
  let nftContract = getNftContract(provider)
  // let metadataContract = new ethers.Contract(Metadata.networks[network].address, Metadata.abi, provider)

  // get all previous Transfer events from NFTContract
  nftContract.queryFilter(nftContract.filters.Transfer(), 0)
    .then((events) => {
      store.commit('NFTS_LOADED')
      events.forEach(processNFTTransfer)
    })

  // listen for transfers
  nftContract.on('Transfer', wrappedProcessNFTTransfer)

  // =======================================
  // shaDoAW
  // =======================================
  
  let shadoawContract = new ethers.Contract(Contracts.shaDoAW.networks[network].address, Contracts.shaDoAW.abi, provider)
  console.log(network, Contracts.shaDoAW.networks[network].address)

  // get all previous Transfer events from NFTContract
  shadoawContract.queryFilter(shadoawContract.filters.Transfer(), 0)
    .then((events) => {
      console.log(events)
      store.commit('SHADOAWS_LOADED')
      events.forEach(processShadoawTransfer)
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

