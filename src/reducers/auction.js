const auctionReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        auctions: action.payload.auctions,
        auctionCount: action.payload.auctionCount,
        filteredAuctionCount: action.payload.filteredAuctionCount,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const viewAuctionReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        auction: action.payload.auction,
        bids: action.payload.bids,
        winner: action.payload.winner,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const refundReducer = (state, action) => {
  switch (action.type) {
    case "REFUND_REQUEST":
      return { ...state, loading: true };
    case "REFUND_SUCCESS":
      return { ...state, loading: false };
    case "REFUND_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const auctionState = (state, action) => {
  switch (action.type) {
    case "STATE_REQUEST":
      return { ...state, loading: true };
    case "STATE_SUCCESS":
      return { ...state, loading: false, carStates: action.payload.carStates };
    case "STATE_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export { auctionReducer, viewAuctionReducer, refundReducer, auctionState };
