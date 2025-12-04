function FilterBar({ filter , setFilter}){
    return(
        <div className="filter-container" style={{ display:'flex' , gap: '10px', marginBottom:'20px'}}>
            <button className={filter === 'All' ? 'active-filter': ''} onClick={()=> setFilter('All')}>All</button>
            <button className={filter === 'Pending' ? 'active-filter': ''} onClick={()=> setFilter('Pending')}>Pending</button>
            <button className={filter === 'Completed' ? 'active-filter': ''} onClick={()=> setFilter('Completed')}>Completed</button>
        </div>
    )
}

export default FilterBar;