export type CollectionBannerProps = {
  first: string;
  second: string;
  imageSrc?: string;
  alt?: string;
  category?: string;
};

export function CollectionBanner({
  first,
  second,
  imageSrc = "",
  alt = "",
  category = "all",
}: CollectionBannerProps) {
  const hasImage = Boolean(imageSrc.trim());

  return (
    <header
      className={`collection-banner collection-banner--${category}`}
      aria-label={`${first} ${second}`.trim()}
    >
      {hasImage ? (
        <div className="collection-banner__media" aria-hidden={!alt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={alt} className="collection-banner__img" />
        </div>
      ) : null}
      <div className="collection-banner__shade" aria-hidden="true" />
      <h1 className="collection-banner__title">
        {first}{" "}
        <span className="collection-banner__title-accent">{second}</span>
      </h1>
    </header>
  );
}
