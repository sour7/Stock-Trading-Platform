"use client"

import { useEffect, useState } from "react"
import { LogOut, TrendingUp, DollarSign } from "lucide-react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { stocks } from "../services/api"
import { useAuthStore } from "../store/authStore"
import type { Stock } from "../types"


interface PortfolioStock {
  stockId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: string;
}


function Dashboard() {
  const [stocksList, setStocksList] = useState<Stock[]>([])
  const [portfolio, setPortfolio] = useState({holdings: [], balance: 0});
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  


  useEffect(() => {
    loadStocks()
  }, [])

  const loadStocks = async () => {
    try {
      const { data } = await stocks.getAll()
      setStocksList(data)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast.error("Failed to load stocks")
    }
  }


  const loadPortfolio = async () => {
    if (!user) return

    try {
      const { data } = await stocks.getPortfolio(user.id)
      console.log('data', data)
      setPortfolio(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to load portfolio")
    }
  }

  useEffect(() => {
    loadPortfolio()
  }, [])

console.log('portfolio', portfolio)

  const handleTrade = async (type: "buy" | "sell") => {
    if (!selectedStock || !user) return

    try {
      const tradeFunction = type === "buy" ? stocks.buy : stocks.sell

      // Create payload matching the required format
      const payload = {
        userId: user.id,
        stockId: selectedStock.id,
        quantity: quantity,
      }

      await tradeFunction(payload.userId, payload.stockId, payload.quantity)
      toast.success(`Successfully ${type === "buy" ? "bought" : "sold"} ${quantity} shares of ${selectedStock.symbol}`)
      loadStocks() // Refresh stocks list
      loadPortfolio()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(`Failed to ${type} stock`)
    }
  }

  const handleLogout = () => {
    setUser(null)
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Stock Trading Platform</span>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Stocks List */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Available Stocks</h3>
                <div className="mt-4">
                  <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Symbol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Change
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {stocksList.map((stock) => (
                                <tr key={stock.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {stock.symbol}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₹{stock.currentPrice.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span
                                      className={
                                        Number.parseFloat(stock.changePercentage) >= 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {Number.parseFloat(stock.changePercentage) >= 0 ? "+" : ""}
                                      {stock.changePercentage}%
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                      onClick={() => setSelectedStock(stock)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      Select
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trading Panel */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Trading Panel</h3>
                <div className="mt-4">
                  {selectedStock ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Selected Stock</h4>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {selectedStock.name} ({selectedStock.symbol}) - ₹{selectedStock.currentPrice.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value)))}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleTrade("buy")}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Buy
                        </button>
                        <button
                          onClick={() => handleTrade("sell")}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Sell
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Select a stock to trade</p>
                  )}
                </div>
              </div>
            </div>

            {/* Portfolio Section */}
           {/* Portfolio Section */}
<div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2">
  <div className="px-4 py-5 sm:p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Your Portfolio</h3>
      <h3 className="text-lg leading-6 font-medium text-gray-900">Balance: ₹{portfolio?.balance.toFixed(2) ?? 0}</h3>
    </div>
    <div className="mt-4">
      {portfolio.holdings.length > 0 ? (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit/Loss
                      </th>
                      {/* New column for Profit/Loss Percentage */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit/Loss %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {portfolio.holdings.map((item: PortfolioStock) => {
                      const profitLoss = (item.currentPrice - item.avgPrice) * item.quantity;
                      const profitLossPercentage = ((item.currentPrice - item.avgPrice) / item.avgPrice) * 100;
                      const isProfit = profitLoss >= 0;
                      return (
                        <tr key={item.stockId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{item.avgPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{item.currentPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{(item.currentPrice * item.quantity).toFixed(2)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                            {isProfit ? "+" : ""}
                            ₹{profitLoss.toFixed(2)}
                          </td>
                          {/* Display Profit/Loss Percentage */}
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${profitLossPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {profitLossPercentage >= 0 ? "+" : ""}
                            {profitLossPercentage.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No holdings in your portfolio</p>
      )}
    </div>
  </div>
</div>


          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
