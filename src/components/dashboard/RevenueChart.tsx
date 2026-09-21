import { useState } from 'react'
import { formatIDR } from '@/lib/utils'

interface RevenueChartProps {
  data: {
    date: string
    settled: number
    pending: number
  }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.settled, d.pending)),
    1000000
  )

  return (
    <div className="p-6 rounded-xl bg-surface-dark border border-[#2b2824] shadow-md text-on-dark flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-serif text-xl font-normal tracking-tight text-on-dark">
            Tren Pendapatan Harian
          </h3>
          <p className="text-xs text-on-dark-soft mt-0.5">
            Komparasi Pendapatan Terverifikasi vs Potensi Pipeline WhatsApp
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-primary" />
            <span className="text-on-dark-soft">Terverifikasi (Settled)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs bg-[#e8a55a]/60" />
            <span className="text-on-dark-soft">Pending WA</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative pt-6 pb-2">
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2">
          {data.map((item, idx) => {
            const settledHeight = Math.max((item.settled / maxVal) * 100, 4)
            const pendingHeight = Math.max((item.pending / maxVal) * 100, 4)
            const isHovered = hoverIndex === idx

            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 px-3 py-1.5 rounded-md bg-[#252320] border border-[#3f3b35] text-[11px] shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
                    <span className="font-medium text-on-dark block">{item.date}</span>
                    <span className="text-primary block font-mono">
                      Settled: {formatIDR(item.settled)}
                    </span>
                    <span className="text-status-amber block font-mono">
                      Pending: {formatIDR(item.pending)}
                    </span>
                  </div>
                )}

                {/* Bars */}
                <div className="w-full max-w-[28px] flex items-end gap-1 justify-center h-full">
                  {/* Settled Bar */}
                  <div
                    style={{ height: `${settledHeight}%` }}
                    className={`w-1/2 rounded-t-xs bg-primary transition-all duration-300 ${
                      isHovered ? 'brightness-110' : 'opacity-90'
                    }`}
                  />
                  {/* Pending Bar */}
                  <div
                    style={{ height: `${pendingHeight}%` }}
                    className={`w-1/2 rounded-t-xs bg-status-amber/60 transition-all duration-300 ${
                      isHovered ? 'bg-status-amber/90' : 'opacity-80'
                    }`}
                  />
                </div>

                {/* Date Label */}
                <span className="text-[11px] font-mono text-on-dark-soft mt-3 group-hover:text-on-dark transition-colors">
                  {item.date}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
