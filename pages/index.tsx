import Head from 'next/head'
import { useState } from 'react';
import { fetchItems, coins } from '../fetcher';

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export async function getServerSideProps(context) {
    if (coins.length == 0) {
        await fetchItems();
    }

    return {
        props: { coins },
    }
}

setInterval(fetchItems, 1000 * 60 * 30)

export default function Home(props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>Cryptocoin finder</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col w-full flex-1 px-20 text-center">
                <Main coins={props.coins} />
            </main>

            <footer className="flex items-center justify-center w-full h-12 border-t mt-8">
                <a
                    className="flex items-center justify-center"
                    href="https://www.coingecko.com/en"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <img src="/coingecko.webp" alt="Coingecko Logo" className="h-8 ml-2" />
                </a>
            </footer>
        </div>
    )
}

function Main(props) {
    const [coinList, setCoinList] = useState(props.coins);
    const [lastSort, setLastSort] = useState({ key: 'marketCapRank', ase: true });

    function onItemClick(key) {
        const sorted = [...props.coins].sort((a, b) => soryBy(a, b, key, !(lastSort.key == key && lastSort.ase)))
        setCoinList(sorted);
        setLastSort({
            ase: !(lastSort.key == key && lastSort.ase),
            key: key,
        })
    }

    return <div className="gap-4 flex flex-col">
        <Row>
            <GridHeader sortBy="marketCapRank" onItemClick={onItemClick}>MarketCap Rank</GridHeader>
            <GridHeader sortBy="name" onItemClick={onItemClick}>Name</GridHeader>
            <GridHeader sortBy="currentPrice" onItemClick={onItemClick}>Price</GridHeader>
            <GridHeader sortBy="marketCap" onItemClick={onItemClick}>MarketCap</GridHeader>
            <GridHeader sortBy="circulatingSupply" onItemClick={onItemClick}>Circulating Supply</GridHeader>
            <GridHeader sortBy="totalVolume" onItemClick={onItemClick}>Total Volume</GridHeader>
            <GridHeader sortBy="ath" onItemClick={onItemClick}>ATH</GridHeader>
        </Row>

        {coinList.map(x => (<Row key={x.id}>
            <GridItem>{x.marketCapRank}</GridItem>
            <GridItem>{`${x.name} (${x.ticker.toUpperCase()})`}</GridItem>
            <GridItem>{toFixed(x.currentPrice)}</GridItem>
            <GridItem>{nFormatter(x.marketCap)}</GridItem>
            <GridItem>{nFormatter(x.circulatingSupply)}</GridItem>
            <GridItem>{nFormatter(x.totalVolume)}</GridItem>
            <GridItem>{toFixed(x.ath)}</GridItem>
        </Row>
        ))}
    </div>
}

function Row(props) {
    return <div className="row">{props.children}</div>
}

function Column(props) {
    return <div className="col">{props.children}</div>
}

function GridHeader(props) {
    return <Column>
        <div
            className="flex items-center justify-center text-xl font-bold cursor-pointer hover:text-gray-500"
            onClick={() => props.onItemClick(props.sortBy)}>
            {props.children}
        </div>
    </Column>;
}

function GridItem(props) {
    return <Column>
        <div className="">{props.children}</div>
    </Column>;
}


function soryBy(a, b, key, ase) {
    if (ase) {
        return a[key] - b[key];
    } else {
        return b[key] - a[key];
    }
}

function toFixed(x) {
    if (!x) {
        return 0;
    }

    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += (new Array(e + 1)).join('0');
        }
    }

    if (x > 1) {
        return formatter.format(x);
    }

    return "$" + x.toString();
}


function abbreviateNumber(number) {

    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if (tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}

function nFormatter(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}
