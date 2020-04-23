type Channel = {
    AUTH: 'auth',
    BALANCES: 'balances',
    HEARTBEAT: 'heartbeat',
    MARKET_L2: 'l2',
    MARKET_L3: 'l3',
    PRICES: 'prices',
    SYMBOLS: 'symbols',
    TICKER: 'ticker',
    TRADES: 'trades',
    TRADING: 'trading',
  }

  type OrderType = {
    LIMIT: 'limit',
    MARKET: 'market',
    STOP: 'stop',
    STOP_LIMIT: 'stopLimit'
  }

  type OrderStatus = {
    CANCELLED: 'cancelled'
    EXPIRED: 'expired'
    OPEN: 'open',
    PARTIAL: 'partial',
    PENDING: 'pending',
    REJECTED: 'rejected',
  }

  type OrderTimeInForce = {
    GOOD_TILL_CANCEL: 'GTC',
    GOOD_TILL_DATE: 'GTD',
    FILL_OR_KILL: 'FOK',
    IMMEDIATE_OR_CANCEL: 'IOC'
  }

  type ChannelAction = {
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe'
  }

  type ChannelEvent = {
    SUBSCRIBED: 'subscribed',
    UNSUBSCRIBED: 'unsubscribed',
    REJECTED: 'rejected',
    SNAPSHOT: 'snapshot',
    UPDATED: 'updated'
  }

interface BaseResponse {
    seqnum: number
    event: ChannelEvent,
    channel: Channel,
    timestamp?: Date | string
}

interface BaseSubscribeRequest {
    action: 'subscribe',
    channel: Channel
}

interface BaseUnsubscribeRequest {
    action: 'unsubscribe',
    channel: Channel
}

interface HeartbeatResponse extends BaseResponse { } 

interface MarketL2SubscribeRequest extends BaseSubscribeRequest {
    symbol: string
}

type RestingOrder = {
    px: number,
    qty: number,
    num: number
}

interface MarketL2Response extends BaseResponse {
    symbol: string,
    bids: RestingOrder[],
    asks: RestingOrder[]
}

interface MarketL3SubscribeRequest extends MarketL2SubscribeRequest {}

interface MarketL3Response extends MarketL2Response {}

interface PricesSubscribeRequest extends BaseSubscribeRequest {
    symbol: string,
    granularity: 60 | 300 | 900 | 3600 | 21600 | 86400
}

// The price data is an array consisting of [timestamp, open, high, low, close, volume]
// this was added to the prices key
// the other values were broken down as separate keys for convenience
interface PriceResponse extends BaseResponse { 
    symbol: string,
    prices: number[],
    timestamp: Date | string
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number
} 

type SymbolProps = {
    base_currency: string, 
    base_currency_scale: number,
    counter_currency: string, 
    counter_currency_scale: number,
    min_price_increment: number,
    min_price_increment_scale: number,
    min_order_size: number,
    min_order_size_scale: number,
    max_order_size: 0,
    max_order_size_scale: number,
    lot_size: number,
    lot_size_scale: number,
    status: 'open' | 'close' | 'suspend' | 'halt' | 'halt-freeze',
    id: number,
    auction_price: number,
    auction_size: number,
    auction_time: string,
    imbalance: number
}

interface SymbolResponse extends BaseResponse {
    symbols: {
        [symbol: string]: SymbolProps
    }
}

interface TickerSubscribeRequest extends BaseSubscribeRequest {
    symbol: string
}

interface TickerResponse extends BaseResponse {
    symbol: string,
    price_24h: number,
    volume_24h: number,
    last_trade_price: number
}

interface TradesSubscribeRequest extends BaseSubscribeRequest {
    symbol: string
}

interface TickerResponse extends BaseResponse {
    symbol: string,
    timestamp: Date | string
    side: OrderSide,
    qty: number,
    price: number,
    trade_id: string
}

type OrderSide = 'buy' | 'sell'

interface TradesSubscribeRequest extends BaseSubscribeRequest {
    symbol: string
}

interface AuthenticatedSubscribeRequest extends BaseSubscribeRequest {
    token: string,
}

type Order = {
    orderID: string,
    clOrdID: string,
    symbol: string,
    side: OrderSide,
    ordType: OrderType,
    orderQty: number,
    leavesQty: number,
    cumQty: number,
    avgPx: number,
    ordStatus: OrderStatus,
    timeInForce: OrderTimeInForce,
    text?: string,
    execType: string,
    execID: string,
    transactTime: Date | string,
    msgType: number,
    lastPx: number,
    lastShares: number,
    tradeId: string,
    price: number
}

interface BaseOrderCreationRequest {
    action: 'NewOrderSingle',
    channel: 'trading',
    clOrdID: string,
    orderQty: number,
    ordType: OrderType,
    side: OrderSide,
}

interface MarketOrderCreationRequest extends BaseOrderCreationRequest {
    timeInForce?: OrderTimeInForce,
    minQty?: number
}

interface LimitOrderCreationRequest extends BaseOrderCreationRequest {
    execInst?: 'ALO'
    expireDate?: Date | string,
    minQty?: number
    price: number,
    timeInForce: OrderTimeInForce,
}

interface StopOrderCreationRequest extends BaseOrderCreationRequest {
    timeInForce: OrderTimeInForce,
    stopPx: number
}

interface StopLimitOrderCreationRequest extends BaseOrderCreationRequest {
    timeInForce: OrderTimeInForce,
    price: number,
    stopPx: number
}

type OrderCreationRequest = 
    MarketOrderCreationRequest |
    LimitOrderCreationRequest |
    StopOrderCreationRequest |
    StopLimitOrderCreationRequest;

type CancelOrderRequest = {
    action: 'CancelOrderRequest',
    channel: 'trading',
    orderID: string  
}

type Balance = {
    currency: string,
    balance: number,
    available: number,
    balance_local: number,
    available_local: number,
    rate: number
}

interface BalancesResponse extends BaseResponse {
    balances: Balance[]
    total_available_local: number,
    total_balance_local: number
}
