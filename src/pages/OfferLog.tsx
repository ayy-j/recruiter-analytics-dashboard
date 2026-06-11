import OfferLogTable from '../components/OfferLogTable'

export default function OfferLog() {
  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Detailed Offer Log</h1>
        <span className="topbar-badge">Full Dataset</span>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Offer Events</h2>
        </div>
        <OfferLogTable />
      </div>
    </div>
  )
}
