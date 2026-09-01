import { createStore } from 'vuex'
import { ethers } from 'ethers'
import { readProvider, anyOf } from './rpc'
import { MerkleTree } from 'merkletreejs';
import Contracts from 'nft-contracts'
import { init, getProvider, getNftContract, NFTContractDeploy } from './contracts'
import onboard from './onboard'
import networks from './networks'

init()

const network = import.meta.env.VITE_NETWORK_NAME
// Read-only access comes from the redundant keyless pool in ./rpc rather than a
// single keyed provider. See that file for why.
let provider = readProvider()
let nftContract = getNftContract(provider)

// this subscribes to the onboard.js state object and updates the vuex store anytime it changes
// this includes connecting, disconnecting or changing balance
// when connected to the correct network, it updates the contracts to be executable
// when connected to the wrong network or no network, it updates the contracts to be read-only
const state = onboard.state.select()
state.subscribe((update) => {
  // console.log('state update: ', update)

  const account = (update.wallets?.length && update.wallets[0]?.accounts[0]) ?? {}
  store.commit('ACCOUNT', { account })

  const wallet = update.wallets[0] ?? {}
  store.commit('WALLET', { wallet })

  const rightNetwork = wallet?.provider?.chainId === networks[network].id || wallet?.provider?.chainId === networks[network].hex

  if (wallet?.provider && rightNetwork) {
    const onboardProvider = wallet.provider
    const etherProvider = new ethers.providers.Web3Provider(onboardProvider, network)
    const signer = etherProvider.getSigner()
    updateContracts(signer)
  } else {
    const etherProvider = readProvider()
    updateContracts(etherProvider)
  }
})

const updateContracts = async (etherProvider) => {
  nftContract = getNftContract(etherProvider)
}

// load saved ensNames
let ensNames = {}
try {
  ensNames = JSON.parse(sessionStorage.getItem('ensNames')) || {}
  if (ensNames.length !== undefined) throw new Error('malformed ensNames')
} catch (_) {
  sessionStorage.removeItem('ensNames')
  ensNames = {}
}

const store = createStore({
  state() {
    return {
      network,
      baseURI: '',
      wallet: {},
      account: {},
      nfts: undefined,
      shadoaws: undefined,
      price: undefined,
      datePremint: undefined,
      datePublic: undefined,
      maxSupply: undefined,
      ensNames,
      pending: [
        // {
        //   txHash: 'asdf',
        //   name: 'mint',
        //   status: 'pending'
        // },
        // {
        // {
        //   txHash: 'asdfasdfasd',
        //   name: 'mint',
        //   status: 'success'
        // },
        // {
        //   txHash: 'asdf',
        //   name: 'mint',
        //   status: 'error'
        // },
      ]
    }
  },
  getters: {
    canWrite: (state, getters) => networks[getters.chainId]?.name === network,
    chainId: state => state.wallet?.chains?.length && networks[state.wallet?.chains[0]?.id].id,
    balance: (state) => state.account?.balance ?? null,
    address: (state) => state.account?.address || null,
    addrShort: () => (addr) => addr ? '0x' + addr.slice(2, 4).toUpperCase() + '-' + addr.slice(-4).toUpperCase() : '...',
    ethToWei: () => (eth) => ethers.utils.parseUnits(eth).toString() ?? '-',
    weiToETH: () => wei => ethers.utils.formatUnits(wei) ?? '...',
    mintCount: (state) => state.nfts?.length,
    isSoldOut: (state) => state.maxSupply && state.nfts?.length >= state.maxSupply,
    contractAddress: () => NFTContractDeploy.networks[network].address,
    etherscanLink: (state, getters) => ({ hash, address, tokenId }) => {
      let url = `https://${state.network != 'homestead' ? state.network + '.' : ''}etherscan.io`
      url += hash ? `/tx/${hash}`
        : address ? `/address/${address}`
          : tokenId ? `/nft/${getters.contractAddress}/${tokenId}`
            : `/address/${getters.contractAddress}`
      return url
    },
    openSeaLink: (state, getters) => ({ tokenId, account, contractAddress }) => {
      const domain = `https://${state.network == 'homestead' ? '' : 'testnets.'}opensea.io`
      contractAddress = contractAddress ?? getters.contractAddress
      if (tokenId) {
        return `${domain}/assets/${state.network === 'homestead' ? 'ethereum' : network}/${contractAddress}/${tokenId}`
      }
      return account ? `${domain}/${account}`
        : domain + '/collection/' + import.meta.env.VITE_OPENSEA_COLLECTION_NAME
    },
    meta: () => ({ title, descrip, img, video }) => {
      const meta = []
      // defaults
      const siteTitle = 'DoAW'
      const siteDescrip = 'Joan Heemskerk, 2023'
      const siteImg = '/doaw-swampneck.teal.jpeg'
      const siteVideo = '/doaw-video-swampneck-loop-720p.mp4'
      const twitterSite = '@foliafoliafolia'
      const twitterCreator = undefined
      
      const description = descrip ? descrip : siteDescrip

      title = title ? `${title} - ${siteTitle}` : siteTitle
      // use site video if no custom image, so doesn't override custom img
      video = img === undefined ? siteVideo : undefined
      
      // custom image
      const image = img === undefined ? siteImg : img

      meta.push({ name: 'og:url', content: window.location.href })
      meta.push({ name: 'og:type', content: 'website'})

      if (description) {
        ['description', 'twitter:description', 'og:description'].forEach(name => meta.push({
          name,
          content: description
        }))
      }
      if (image) {
        ['og:image', 'twitter:image'].forEach(name => meta.push({
          name,
          content: image
        }))
      }
      if (video) {
        ['og:video', 'twitter:video'].forEach(name => meta.push({
          name,
          content: video
        }))
      }
      if (video || image) {
        meta.push({
          name: 'twitter:card',
          content: 'summary_large_image'
        })
      }
      if (twitterSite) {
        meta.push({ name: 'twitter:site', content: twitterSite })
      }
      if (twitterCreator) {
        meta.push({ name: 'twitter:creator', content: twitterCreator })
      }

      setTimeout(() => { window.prerenderReady = true }, 100)
      
      // add
      return {
        htmlAttrs: {
          lang: 'en',
          amp: false,
        },
        title,
        meta
      }
    },
  },
  mutations: {
    WALLET(state, { wallet }) {
      state.wallet = wallet
    },
    ACCOUNT(state, { account }) {
      state.account = account
    },
    NFTS_LOADED (state) {
      state.nfts = []
    },
    ADD_NFT(state, nft) {
      if (state.nfts === undefined) {
        state.nfts = []
      }
      // add index of mint?
      nft.index = state.nfts.length + 1
      state.nfts.push(nft)
    },
    UPDATE_NFT(state, nft) {
      const index = state.nfts.findIndex(v => v.tokenId === nft.tokenId)
      state.nfts.splice(index, 1, nft)
    },
    SHADOAWS_LOADED (state) {
      state.shadoaws = []
    },
    ADD_SHADOAW(state, nft) {
      if (state.shadoaws === undefined) {
        state.shadoaws = []
      }
      state.shadoaws.push(nft)
    },
    UPDATE_SHADOAW(state, nft) {
      const index = state.shadoaws.findIndex(v => v.tokenId === nft.tokenId)
      state.shadoaws.splice(index, 1, nft)
    },
    BASE_URI(state, baseURI) {
      state.baseURI = baseURI
    },
    SET_PRICE(state, value) {
      state.price = value
    },
    SET_MAX_SUPPLY(state, value) {
      state.maxSupply = value
    },
    ADD_ENS_NAME(state, { addr, result }) {
      state.ensNames[addr.toLowerCase()] = result
      // save to session storage for future lookup
      sessionStorage.setItem('ensNames', JSON.stringify(state.ensNames))
    },
    ADD_PENDING_TX(state, pendingTx) {
      state.pending.push(pendingTx)
    },
    REMOVE_PENDING_TX(state, txHash) {
      const index = state.pending.findIndex(pendingTx => pendingTx.txHash === txHash)
      state.pending.splice(index, 1)
    },
    UPDATE_TX(state, { txHash, status }) {
      const index = state.pending.findIndex(pendingTx => pendingTx.txHash === txHash)
      state.pending[index].status = status
      // setTimeout(() => {
      //   const index = state.pending.findIndex(pendingTx => pendingTx.txHash === txHash)
      //   if (index > -1) {
      //     state.pending.splice(index, 1)
      //   }
      // }, 5000)
    },
    REMOVE_TX(state, txHash) {
      const index = state.pending.findIndex(pendingTx => pendingTx.txHash === txHash)
      if (index > -1) {
        state.pending.splice(index, 1)
      }
    },
    SET_DATE_PUBLIC (state, milliseconds) {
      state.datePublic = milliseconds
    },
    SET_DATE_PREMINT (state, milliseconds) {
      state.datePremint = milliseconds
    }
  },
  actions: {
    async ensName({ state, commit }, addr) {
      addr = addr.toLowerCase()

      if (state.ensNames[addr] !== undefined) {
        return state.ensNames[addr]
      }

      try {
        const mainnetProvider = await getProvider({ name: 'homestead' })
        const result = await mainnetProvider.lookupAddress(addr)
        commit('ADD_ENS_NAME', { addr, result }) // save even null
        return result
      } catch (_) { }
    },
    async checkNetwork({ getters, dispatch }) {
      if (!getters.canWrite && !getters.address) {
        await dispatch('connect')
      }
      const chainId = getters.chainId
      if (chainId !== networks[network].id && chainId !== networks[network].hex) {
        await onboard.setChain({ chainId: networks[network].id })
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    },
    async connect({ commit, dispatch }) {
      return onboard.connectWallet()
    },
    async disconnect({ state, commit, dispatch }) {
      if (!state.wallet.label) return
      // disconnect the first wallet in the wallets array
      await onboard.disconnectWallet({ label: state.wallet.label })
    },
    async getNFTBalance({ getters, commit, dispatch }) {
      return await nftContract.balanceOf(getters.address)
    },
    // async mintAllowList({ getters, commit, dispatch }, amount = 1) {
    //   if (amount == 1) {
    //     throw new Error("this version of the contract is not yet deployed")
    //   }
    //   await dispatch('checkNetwork')
    //   const price = await dispatch('getPrice')
    //   const value = price.mul(amount)
    //   const tree = new MerkleTree(merkleAddresses.map(ethers.utils.keccak256), ethers.utils.keccak256, { sortPairs: true })
    //   const hashedAddress = ethers.utils.keccak256(getters.address);
    //   const proof = tree.getHexProof(hashedAddress);
    //   await nftContract.mintAllowList(amount, proof, { value })
    // },
    async handlePendingTx({ commit, dispatch }, { name, tx, tokenId }) {
      const txHash = tx.hash
      const status = "pending"
      const pendingTx = { name, txHash, status, tokenId }

      commit('ADD_PENDING_TX', pendingTx)
      tx.wait()
        .then(() => {
          commit('UPDATE_TX', { txHash, status: "success" })
        })
        .catch((e) => {
          commit('UPDATE_TX', { txHash, status: "failed" })
          throw e
        })
    },
    async mint({ getters, dispatch }, { entropy, quantity = 1 }) {
      await dispatch('checkNetwork')
      const wei = await dispatch('getPrice')
      const value = wei.mul(quantity)
      let userBalance = getters.balance?.ETH

      if (!userBalance) {
        userBalance = (await anyOf((p) => p.getBalance(getters.address)))
      } else {
        userBalance = ethers.utils.parseEther(userBalance)
      }

      if (userBalance.lt(value)) {
        const missing = getters.weiToETH(value.sub(userBalance)).substring(0, 6)
        throw new Error(`Sorry, your wallet balance is ${missing.toString()}ETH too low to mint.`)
      }

      const paused = await nftContract.paused()
      if (paused) {
        throw new Error(`Sorry, minting is paused at the moment.\nPlease check back later or come to the discord for more information.`)
      }

      const now = Date.now()
      const datePublic = await dispatch('getDatePublic')
      const waitUntil = new Date(datePublic).toLocaleString()
      if (now < datePublic) {
        const datePremint = await dispatch('getDatePremint')
        if (!datePremint || now < datePremint) {
          throw new Error(`Sorry, minting is not yet open.`)
        } else {

          // NOTE: this is just to test the fake tree, TODO: remove before going live and replace with tree composed of merkleAddresses
          // const addresses = [
          //   '0xaF2CE0962D1a4B1AAB10f7faA62bBbcA40a8EA53',
          //   '0x2F5866D7215416Fa60beDF532856736Cd9a76acf',
          //   '0xFa398d672936Dcf428116F687244034961545D91'
          // ]
          // const tree = new MerkleTree(
          //   addresses.map(ethers.utils.keccak256),
          //   ethers.utils.keccak256,
          //   { sortPairs: true },
          // );
          // const fakeTreeRoot = "0x" + fakeTree.getRoot().toString('hex')

          const merkleAddresses = import.meta.env.VITE_DEV_MERKLEADDRESSES
            ? JSON.parse(import.meta.env.VITE_DEV_MERKLEADDRESSES.toLowerCase())
            : Contracts.merkleAddresses

          console.log({ merkleAddresses })

          const tree = new MerkleTree(
            merkleAddresses.map(ethers.utils.keccak256),
            ethers.utils.keccak256,
            { sortPairs: true },
          );
          console.log(tree)
          const hashedAddress = ethers.utils.keccak256(getters.address);
          console.log({hashedAddress})
          const hexProof = tree.getHexProof(hashedAddress);
          console.log({ hexProof })
          const allowed = await nftContract.allowListed(getters.address, hexProof)
          if (!allowed) {
            throw new Error(`Sorry, you are not on the allow list.\n Please wait until ${waitUntil}`)
          } else {
            // mintAllowlist
            try {
              console.log('mint allow list')
              const tx = await nftContract.mintAllowList(quantity, hexProof, { value })
              return dispatch('handlePendingTx', { name: 'mint', tx })
            } catch (e) {
              if (e.toString().indexOf("rejected transaction") > -1) {
                throw new Error(`cancelled transaction`)
              } else {
                throw e
              }
            }
          }
        }
      }

      try {
        let tx
        if (entropy) {
          console.log('mint public with entropy')
          tx = await nftContract['mintWithEntropy(address,uint256)'](getters.address, entropy, { value })
        } else {
          console.log('mint public random:', quantity)
          tx = await nftContract['mint(address,uint256)'](getters.address, quantity, { value })
        }
        return dispatch('handlePendingTx', { name: 'mint', tx })
      } catch (e) {
        console.error(e)
        if (e.toString().indexOf("rejected transaction") > -1) {
          throw new Error(`cancelled transaction`)
        } else {
          throw e
        }
      }
    },
    async getPrice({ state, commit }) {
      if (state.price) {
        return state.price
      }

      try {
        const price = await nftContract.price()
        commit('SET_PRICE', price)
        return price
      } catch (e) {
        console.error(e)
      }
    },
    async getMaxSupply ({ state, commit }) {
      if (state.maxSupply) {
        return state.maxSupply
      }

      try {
        const maxSupply = await nftContract['MAX_SUPPLY']()
        commit('SET_MAX_SUPPLY', Number(maxSupply))
        return maxSupply
      } catch (e) {
        console.error(e)
      }
    },
    async getDatePremint ({ state, commit }) {
      // skip lookup if already past
      if (state.datePremint !== undefined) {
        return state.datePremint
      }
      if (!nftContract.premint) {
        commit('SET_DATE_PREMINT', false)
        return false
      }

      try {
        const sec = await nftContract.premint()
        const date = sec.toNumber() * 1000
        commit('SET_DATE_PREMINT', date)
        return date
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async getDatePublic ({ state, commit }) {
      // skip lookup if already past
      if (state.datePublic) {
        return state.datePublic
      }
      try {
        const sec = await nftContract.startdate()
        const date = sec.toNumber() * 1000
        commit('SET_DATE_PUBLIC', date)
        return date
      } catch (e) {
        console.error(e)
        throw e
      }
    },
  }
})

export default store