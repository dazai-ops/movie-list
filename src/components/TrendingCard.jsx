
function TrendingCard({movie, index}) {
  return (
    <li>
      <p>{index + 1}</p>
      <img src={movie.poster_url} alt={movie.title} />
    </li>
  )
}

export default TrendingCard
