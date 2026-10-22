export default function ArrasAnswer({ question, answer, sources = [], id }) {
  return (
    <details className="ar-answer" id={id}>
      <summary>{question}<span aria-hidden="true">+</span></summary>
      <div>{(Array.isArray(answer) ? answer : [answer]).map(text => <p key={text}>{text}</p>)}
        {sources.length > 0 && <p className="ar-answer-sources">{sources.map(source => <a key={source.href} href={source.href} referrerPolicy="origin">{source.label} ↗</a>)}</p>}
      </div>
    </details>
  );
}
