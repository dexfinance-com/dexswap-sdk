import { ChainId, Token, Pair, TokenAmount, WETH, Price } from '../src'

describe('Pair', () => {
  const MUSDT = new Token(ChainId.TESTNET, '0xa30439BDCb4Fc455723C21f2bbDF4C0d81E400C7', 18, 'USDC', 'USD Coin')
  const MUSDC = new Token(ChainId.TESTNET, '0x270E355e75F60Fb015c94561858cb719acafb90C', 18, 'DAI', 'DAI Stablecoin')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(MUSDT, '100'), new TokenAmount(WETH[ChainId.MAINNET], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(MUSDT, MUSDC)).toEqual('0xF395A49f98Ef550BAB63eeed5ce55B19Cae4E91F')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(MUSDT, '100'), new TokenAmount(MUSDC, '100')).token0).toEqual(MUSDC)
      expect(new Pair(new TokenAmount(MUSDC, '100'), new TokenAmount(MUSDT, '100')).token0).toEqual(MUSDC)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(MUSDT, '100'), new TokenAmount(MUSDC, '100')).token1).toEqual(MUSDT)
      expect(new Pair(new TokenAmount(MUSDC, '100'), new TokenAmount(MUSDT, '100')).token1).toEqual(MUSDT)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(MUSDT, '100'), new TokenAmount(MUSDC, '101')).reserve0).toEqual(
        new TokenAmount(MUSDC, '101')
      )
      expect(new Pair(new TokenAmount(MUSDC, '101'), new TokenAmount(MUSDT, '100')).reserve0).toEqual(
        new TokenAmount(MUSDC, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(MUSDT, '100'), new TokenAmount(MUSDC, '101')).reserve1).toEqual(
        new TokenAmount(MUSDT, '100')
      )
      expect(new Pair(new TokenAmount(MUSDC, '101'), new TokenAmount(MUSDT, '100')).reserve1).toEqual(
        new TokenAmount(MUSDT, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(MUSDT, '101'), new TokenAmount(MUSDC, '100')).token0Price).toEqual(
        new Price(MUSDC, MUSDT, '100', '101')
      )
      expect(new Pair(new TokenAmount(MUSDC, '100'), new TokenAmount(MUSDT, '101')).token0Price).toEqual(
        new Price(MUSDC, MUSDT, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(MUSDT, '101'), new TokenAmount(MUSDC, '100')).token1Price).toEqual(
        new Price(MUSDT, MUSDC, '101', '100')
      )
      expect(new Pair(new TokenAmount(MUSDC, '100'), new TokenAmount(MUSDT, '101')).token1Price).toEqual(
        new Price(MUSDT, MUSDC, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(MUSDT, '101'), new TokenAmount(MUSDC, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(MUSDC)).toEqual(pair.token0Price)
      expect(pair.priceOf(MUSDT)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(MUSDT, '100'), new TokenAmount(MUSDC, '101')).reserveOf(MUSDT)).toEqual(
        new TokenAmount(MUSDT, '100')
      )
      expect(new Pair(new TokenAmount(MUSDC, '101'), new TokenAmount(MUSDT, '100')).reserveOf(MUSDT)).toEqual(
        new TokenAmount(MUSDT, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(MUSDC, '101'), new TokenAmount(MUSDT, '100')).reserveOf(WETH[ChainId.MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(MUSDT, '100'), new TokenAmount(MUSDC, '100')).chainId).toEqual(ChainId.TESTNET)
      expect(new Pair(new TokenAmount(MUSDC, '100'), new TokenAmount(MUSDT, '100')).chainId).toEqual(ChainId.TESTNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(MUSDT, '100'), new TokenAmount(MUSDC, '100')).involvesToken(MUSDT)).toEqual(true)
    expect(new Pair(new TokenAmount(MUSDT, '100'), new TokenAmount(MUSDC, '100')).involvesToken(MUSDC)).toEqual(true)
    expect(
      new Pair(new TokenAmount(MUSDT, '100'), new TokenAmount(MUSDC, '100')).involvesToken(WETH[ChainId.MAINNET])
    ).toEqual(false)
  })
})
