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
    <div className="p-6 rounded-2xl bg-surface-card border border-hairline shadow-2xs text-ink flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-xl font-normal tracking-tight text-ink">
            Metode Pembayaran
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Sebaran metode transfer manual & QRIS
          </p>
        </div>
        <div className="size-9 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-primary shrink-0">
          <Wallet className="size-4" />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {distribution.map((item) => (
          <div key={item.method} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink font-medium">{item.method}</span>
              <span className="text-muted font-mono">
                {item.count} pesanan ({item.percentage}%)
              </span>
            </div>
            {/* Progress Track */}
            <div className="h-2 w-full rounded-full bg-canvas overflow-hidden border border-hairline">
              <div
                style={{ width: `${item.percentage}%` }}
                className="h-full rounded-full bg-primary transition-all duration-500"
              />
            </div>
          </div>
        ))}

        {distribution.length === 0 && (
          <p className="text-xs text-muted py-4 text-center">
            Belum ada transaksi pembayaran tercatat.
          </p>
        )}
      </div>
    </div>
  )
}
