import { Wallet } from 'lucide-react'

interface PaymentBreakdownProps {
  distribution: {
    method: string
    count: number
    percentage: number
  }[]
}

export function PaymentBreakdown({ distribution }: PaymentBreakdownProps) {
  return (
    <div className="p-6 rounded-xl bg-surface-dark border border-[#2b2824] shadow-md text-on-dark flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-xl font-normal tracking-tight text-on-dark">
            Metode Pembayaran
          </h3>
          <p className="text-xs text-on-dark-soft mt-0.5">
            Sebaran metode transfer manual & QRIS
          </p>
        </div>
        <Wallet className="size-5 text-primary" />
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {distribution.map((item) => (
          <div key={item.method} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-dark font-medium">{item.method}</span>
              <span className="text-on-dark-soft font-mono">
                {item.count} pesanan ({item.percentage}%)
              </span>
            </div>
            {/* Progress Track */}
            <div className="h-2 w-full rounded-full bg-surface-dark-elevated overflow-hidden border border-[#38342f]">
              <div
                style={{ width: `${item.percentage}%` }}
                className="h-full rounded-full bg-primary transition-all duration-500"
              />
            </div>
          </div>
        ))}

        {distribution.length === 0 && (
          <p className="text-xs text-on-dark-soft py-4 text-center">
            Belum ada transaksi pembayaran tercatat.
          </p>
        )}
      </div>
    </div>
  )
}
