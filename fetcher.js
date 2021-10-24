const CoinGecko = require('coingecko-api');
import tokenJson from './public/tokens.json';

const CoinGeckoClient = new CoinGecko();

export let coins = [];

export async function fetchItems() {
    let tokens = [];
    let page = 1;

    while (tokens.length < 1000) {
        console.log(`Fetching coins page: ${page}`)
        let items = await CoinGeckoClient.coins.markets({
            vs_currency: 'usd',
            per_page: 1000,
            page: page,
            ids: [],
            order: null,
            sparkline: false,
        });

        var data = items.data.map(x => ({
            id: x.id,
            name: x.name,
            ticker: x.symbol,
            currentPrice: x.current_price || 0,
            marketCapRank: x.market_cap_rank || 0,
            marketCap: x.market_cap || 0,
            circulatingSupply: x.circulating_supply,
            totalSupply: x.total_supply || 0,
            totalVolume: x.total_volume || 0,
            ath: x.ath || 0,
            athDate: x.ath_date,
            athChangePercentage: x.ath_change_percentage || 0,
        }));

        tokens = [...tokens, ...data];
        ++page;
    }

    coins = tokens;
}

