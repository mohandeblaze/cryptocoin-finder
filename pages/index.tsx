import { Box, Button, FormControl, FormLabel, IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import React, { useState } from "react";
import { fetchItems, coins } from "../fetcher";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react"
import { SettingsIcon } from "@chakra-ui/icons";

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export async function getServerSideProps(context) {
    if (coins.length == 0) {
        await fetchItems();
    }

    return {
        props: { coins },
    };
}

setInterval(fetchItems, 1000 * 60 * 30);

export default function Home(props) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minH="100vh" py="2">

            <Head>
                <title>Cryptocoin finder</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <SettingsModal />




            <Box as="main" display="flex" flexDirection="column" w="full" flex="1" px="20" textAlign="center">
                <Main coins={props.coins} />
            </Box>

            <Box as="footer" display="flex" alignItems="center" justifyContent="center" w="full" h="12" borderTop="1px solid grey" mt="8">
                <Box as="a"
                    display="flex" alignItems="center" justifyContent="center"
                    href="https://www.coingecko.com/en"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{" "}
                    <Box as="img" src="/coingecko.webp" alt="Coingecko Logo" h="8" ml="2" />
                </Box>
            </Box>
        </Box>
    );
}

function SettingsModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Box position="fixed" bottom="20px" right="20px">
                <IconButton
                    colorScheme="messenger"
                    aria-label="Open settings"
                    size="lg"
                    icon={<SettingsIcon />}
                    rounded="full"
                    onClick={onOpen}
                />
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false} closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Filter settings</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="filter-coins">
                            <FormLabel>MarketCap rank:</FormLabel>
                            <Select onChange={(e) => console.log(e.target.value)} placeholder="Select option">
                                <option value="top50">Top 50</option>
                                <option value="top100">Top 100</option>
                                <option value="top250">Top 250</option>
                                <option value="top500">Top 500</option>
                                <option value="top600">Top 600</option>
                                <option value="custom">Custom</option>
                            </Select>

                            <NumberInput mt="4" max={50} min={10}>
                                <NumberInputField />
                            </NumberInput>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="messenger" mr={3} onClick={onClose}>
                            Save
                        </Button>
                        <Button variant="ghost">Reset</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

function Main(props) {
    const [coinList, setCoinList] = useState(props.coins);
    const [lastSort, setLastSort] = useState({ key: "marketCapRank", ase: true });

    function onItemClick(key) {
        const sorted = [...props.coins].sort((a, b) =>
            soryBy(a, b, key, !(lastSort.key == key && lastSort.ase))
        );
        setCoinList(sorted);
        setLastSort({
            ase: !(lastSort.key == key && lastSort.ase),
            key: key,
        });
    }

    return (
        <Box gridGap="4" display="flex" flexDirection="column">
            <Row>
                <GridHeader sortBy="marketCapRank" onItemClick={onItemClick}>
                    MarketCap Rank
                </GridHeader>
                <GridHeader sortBy="name" onItemClick={onItemClick}>
                    Name
                </GridHeader>
                <GridHeader sortBy="currentPrice" onItemClick={onItemClick}>
                    Price
                </GridHeader>
                <GridHeader sortBy="marketCap" onItemClick={onItemClick}>
                    MarketCap
                </GridHeader>
                <GridHeader sortBy="circulatingSupply" onItemClick={onItemClick}>
                    Circulating Supply
                </GridHeader>
                <GridHeader sortBy="totalVolume" onItemClick={onItemClick}>
                    Total Volume
                </GridHeader>
                <GridHeader sortBy="ath" onItemClick={onItemClick}>
                    ATH
                </GridHeader>
            </Row>

            {coinList.map((x) => (
                <Row key={x.id}>
                    <GridItem>{x.marketCapRank}</GridItem>
                    <GridItem>{`${x.name} (${x.ticker.toUpperCase()})`}</GridItem>
                    <GridItem>{toFixed(x.currentPrice)}</GridItem>
                    <GridItem>{nFormatter(x.marketCap)}</GridItem>
                    <GridItem>{nFormatter(x.circulatingSupply)}</GridItem>
                    <GridItem>{nFormatter(x.totalVolume)}</GridItem>
                    <GridItem>{toFixed(x.ath)}</GridItem>
                </Row>
            ))}
        </Box>
    );
}

function Row(props) {
    return <div className="row">{props.children}</div>;
}

function Column(props) {
    return <div className="col">{props.children}</div>;
}

function GridHeader(props) {
    return (
        <Column>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xl"
                fontWeight="bold"
                cursor="pointer"
                _hover={{ color: "gray.500" }}
                onClick={() => props.onItemClick(props.sortBy)}
            >
                {props.children}
            </Box>
        </Column>
    );
}

function GridItem(props) {
    return (
        <Column>
            <div className="">{props.children}</div>
        </Column>
    );
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
        var e = parseInt(x.toString().split("e-")[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = "0." + new Array(e).join("0") + x.toString().substring(2);
        }
    } else {
        var e = parseInt(x.toString().split("+")[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += new Array(e + 1).join("0");
        }
    }

    if (x > 1) {
        return formatter.format(x);
    }

    return "$" + x.toString();
}

function abbreviateNumber(number) {
    // what tier? (determines SI symbol)
    var tier = (Math.log10(Math.abs(number)) / 3) | 0;

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
        return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
}
