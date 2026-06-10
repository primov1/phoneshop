const variants = {
  green:  'badge-green',
  red:    'badge-red',
  amber:  'badge-amber',
  blue:   'badge-blue',
  purple: 'badge-purple',
  gray:   'badge-gray',
}

interface Props {
  variant?: keyof typeof variants
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'gray', children, className = '' }: Props) {
  return <span className={`badge ${variants[variant]} ${className}`}>{children}</span>
}

export function statusBadge(status: string) {
  const map: Record<string, { label: string; variant: keyof typeof variants }> = {
    ACTIVE:      { label: 'Faol',          variant: 'green' },
    INACTIVE:    { label: 'Nofaol',        variant: 'gray' },
    SUSPENDED:   { label: 'Bloklangan',    variant: 'red' },
    BUSY:        { label: 'Band',          variant: 'amber' },
    PENDING:     { label: 'Kutilmoqda',    variant: 'amber' },
    CONFIRMED:   { label: 'Tasdiqlandi',   variant: 'blue' },
    SHIPPING:    { label: 'Yetkazilmoqda', variant: 'blue' },
    DELIVERED:   { label: 'Yetkazildi',    variant: 'green' },
    CANCELLED:   { label: 'Bekor qilindi', variant: 'red' },
    IN_PROGRESS: { label: 'Jarayonda',     variant: 'purple' },
    DONE:        { label: 'Tayyor',        variant: 'green' },
  }
  const cfg = map[status] || { label: status, variant: 'gray' as keyof typeof variants }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}
