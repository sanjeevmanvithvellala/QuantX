export default function StockCard({ stock }) {

    return (
        <div className="bg-slate-800 p-6 rounded-xl">

            <h2 className="text-2xl font-bold">
                {stock.ticker}
            </h2>

            <p className="mt-3">
                Price: ${stock.close}
            </p>

            <p>
                Volume: {stock.volume}
            </p>

        </div>
    );
}