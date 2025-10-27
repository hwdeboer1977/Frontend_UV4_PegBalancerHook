'use client'

interface LPPoolStatsProps {
  lpPrice: string
  liquidity: string
  fee: string
  deadzoneUpper: string
  deadzoneLower: string
  spread: string
  inDeadzone: boolean
  isLoading: boolean
  error: string | null
}

export default function LPPoolStats({
  lpPrice,
  liquidity,
  fee,
  deadzoneUpper,
  deadzoneLower,
  spread,
  inDeadzone,
  isLoading,
  error
}: LPPoolStatsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">💱</span>
        Liquidity Pool Stats
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-slate-600 font-medium">LP Price</span>
          {isLoading ? (
            <span className="text-xl font-bold text-blue-400">Loading...</span>
          ) : (
            <span className="text-2xl font-bold text-blue-700">${lpPrice}</span>
          )}
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-600 font-medium">Total Liquidity</span>
          {isLoading ? (
            <span className="text-xl font-bold text-slate-400">Loading...</span>
          ) : (
            <span className="text-2xl font-bold text-slate-700">${liquidity}</span>
          )}
        </div>
        
        <div className={`flex justify-between items-center p-3 rounded-lg ${
          inDeadzone ? 'bg-green-50' : 'bg-amber-50'
        }`}>
          <span className="text-slate-600 font-medium">Current Fee</span>
          {isLoading ? (
            <span className="text-xl font-bold text-amber-400">Loading...</span>
          ) : (
            <span className={`text-2xl font-bold ${inDeadzone ? 'text-green-700' : 'text-amber-700'}`}>
              {fee}%
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-slate-600 font-medium">Deadzone Range</span>
          {isLoading ? (
            <span className="text-lg font-bold text-green-400">Loading...</span>
          ) : (
            <span className="text-lg font-bold text-green-700">
              ${deadzoneLower} - ${deadzoneUpper}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-slate-600 font-medium">Spread (LP vs NAV)</span>
          {isLoading ? (
            <span className="text-xl font-bold text-purple-400">Loading...</span>
          ) : (
            <span className="text-2xl font-bold text-purple-700">
              {parseFloat(spread) > 0 ? '+' : ''}{spread}%
            </span>
          )}
        </div>
      </div>
      
      <div className={`mt-4 p-3 rounded-lg text-center border-2 ${
        inDeadzone 
          ? 'bg-green-100 border-green-300' 
          : 'bg-amber-100 border-amber-300'
      }`}>
        <span className={`font-bold ${inDeadzone ? 'text-green-800' : 'text-amber-800'}`}>
          {inDeadzone ? '✓ Within Deadzone - Normal Fees' : '⚠ Outside Deadzone - Soft Peg Active'}
        </span>
      </div>
      
      <div className="mt-2 text-xs text-slate-500 text-center">
        Auto-refreshes every 10 seconds
      </div>
    </div>
  );
}
