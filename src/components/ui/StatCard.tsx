interface Props {
  label: string
  value: string | number
  icon: string
  change?: string
  up?: boolean
}

export function StatCard({ label, value, icon, change, up }: Props) {
  return (
    <div className="sc">
      <div className="sc-top">
        <div className="sc-ic">{icon}</div>
        <span className="sc-lbl">{label}</span>
      </div>
      <div className="sc-val">{value}</div>
      {change && (
        <div className={`sc-ch ${up ? 'up' : 'dn'}`}>
          {up ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  )
}
