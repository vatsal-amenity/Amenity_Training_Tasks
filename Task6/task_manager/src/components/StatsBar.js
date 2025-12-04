function StatsBar({total, completed, pending}){
    return(
        <div className="stats-container">
            <div className="stat-box">
                <span className="stat-number">{total}</span>
                <span className="stat-label">Total task</span>
            </div>

            <div className="stat-box completed">
                <span className="stat-number">{completed}</span>
                <span className="stat-label">completed</span>
            </div>

            <div className="stat-box pending">
                <span className="stat-number">{pending}</span>
                <span className="stat-label">pending</span>
            </div>
        </div>
    )
}

export default StatsBar;