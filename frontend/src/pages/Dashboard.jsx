import { useEffect, useState } from "react";
import api from "../services/api";

import StockCard from "../components/StockCard";
import MetricCard from "../components/MetricCard";

export default function Dashboard() {

    const [stock, setStock] = useState(null);

    const [ticker, setTicker] =
        useState("AAPL");

    useEffect(() => {

        fetchStock();

    }, []);

    const fetchStock = async () => {

        try {

            const res =
                await api.get(
                    `/stock/${ticker}`
                );

            setStock(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="p-10">

            <h1
                className="
                text-4xl
                font-bold
                mb-10
                "
            >
                QuantX Dashboard
            </h1>

            <div className="flex gap-4 mb-8">

                <input
                    value={ticker}
                    onChange={(e)=>
                        setTicker(
                            e.target.value
                        )
                    }
                    className="
                    p-3
                    text-black
                    rounded
                    "
                />

                <button
                    onClick={fetchStock}
                    className="
                    bg-blue-500
                    px-5
                    rounded
                    "
                >
                    Search
                </button>

            </div>

            {
                stock &&

                <>
                    <StockCard
                        stock={stock}
                    />

                    <div
                        className="
                        grid
                        grid-cols-3
                        gap-5
                        mt-6
                        "
                    >

                        <MetricCard
                            title="Close Price"
                            value={
                                stock.close
                            }
                        />

                        <MetricCard
                            title="Volume"
                            value={
                                stock.volume
                            }
                        />

                        <MetricCard
                            title="Ticker"
                            value={
                                stock.ticker
                            }
                        />

                    </div>

                </>
            }

        </div>

    );
}