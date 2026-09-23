export default function Brand({ brand, href = '#home', ariaLabel }) {
  return (
    <a className="brand" href={href} aria-label={ariaLabel}>
      <span className="mark" aria-hidden="true">
        {brand?.mark ?? '✳'}
      </span>
      <span>
        {brand?.name ?? 'Clinical Trial'}
        <br />
        <small>{brand?.suffix ?? 'ACCESS'}</small>
      </span>
    </a>
  );
}
