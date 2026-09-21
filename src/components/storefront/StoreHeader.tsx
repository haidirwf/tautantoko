import React from 'react'
import { ExternalLink, Share2, Check } from 'lucide-react'
import type { Store, StoreLink } from '@/types'

interface StoreHeaderProps {
  store: Store
  links: StoreLink[]
}

export function StoreHeader({ store, links }: StoreHeaderProps) {
  const [copied, setCopied] = React.useState(false)

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <header className="flex flex-col items-center text-center pt-8 pb-6 px-4 max-w-lg mx-auto">
      {/* Store Avatar */}
      <div className="relative mb-4 group">
        <div className="size-24 rounded-full overflow-hidden border-2 border-hairline shadow-sm bg-surface-card flex items-center justify-center">
          {store.avatar_url ? (
            <img
              src={store.avatar_url}
              alt={store.name}
              className="size-full object-cover"
            />
          ) : (
            <span className="font-serif text-3xl text-ink font-medium">
              {store.name.charAt(0)}
            </span>
          )}
        </div>
        <button
          onClick={handleShare}
          className="absolute bottom-0 right-0 p-1.5 rounded-full bg-canvas border border-hairline shadow-xs text-muted hover:text-ink transition-colors"
          title="Bagikan Tautan Toko"
        >
          {copied ? <Check className="size-3.5 text-status-success" /> : <Share2 className="size-3.5" />}
        </button>
      </div>

      {/* Store Name & Tagline */}
      <h1 className="font-serif text-3xl font-medium text-ink tracking-tight sm:text-4xl">
        {store.name}
      </h1>
      {store.tagline && (
        <p className="text-sm text-muted mt-2 max-w-sm leading-relaxed">
          {store.tagline}
        </p>
      )}

      {/* External Social / Bio Links */}
      {links.length > 0 && (
        <div className="w-full flex flex-col gap-2.5 mt-5">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-surface-card hover:bg-surface-soft border border-hairline text-ink text-sm font-medium transition-all shadow-2xs group"
            >
              <span className="truncate">{link.title}</span>
              <ExternalLink className="size-3.5 text-muted group-hover:text-primary transition-colors shrink-0 ml-2" />
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
