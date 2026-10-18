export default function ArrasStar({ repository, stars }) {
  return <a className="ar-github-star" href={repository} rel="noopener" referrerPolicy="origin">
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></svg>
    <span>Star on GitHub</span>
    {stars != null && <span className="ar-star-count" aria-label={`${stars} stars`}>{new Intl.NumberFormat("en-US").format(stars)}</span>}
  </a>;
}
