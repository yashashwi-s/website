import Image from "next/image";
import { notFound } from "next/navigation";
import { getArrasLinks } from "../../arras-links";
import SupportPage, { supportMetadata } from "../../support-page";
import { comparisonDate, comparisons } from "../comparison-data";

export const revalidate = 3600;

export function generateStaticParams() {
  return Object.keys(comparisons).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!Object.hasOwn(comparisons, slug)) notFound();
  const { title, description, image } = comparisons[slug];
  return supportMetadata(`vs/${slug}`, `${title} | Arras`, description, {
    ogImage: `/puremac/arras/features/${image}.webp`,
  });
}

export default async function ComparisonPage({ params }) {
  const { slug } = await params;
  if (!Object.hasOwn(comparisons, slug)) notFound();
  const comparison = comparisons[slug];
  const links = await getArrasLinks();
  const displayDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(comparisonDate));
  const sectionLinks = [
    ["at-a-glance", "At a glance"],
    ...comparison.sections.map(([heading], index) => [`workflow-${index + 1}`, heading]),
    ["sources", "Sources"],
  ];

  return (
    <SupportPage links={links} active={`vs/${slug}`} label="Comparison" title={comparison.title}
      intro={comparison.description} sections={sectionLinks}>
      <p className="ar-fine">By Yashashwi Singhania, maker of Arras. Sources checked <time dateTime={comparisonDate}>{displayDate}</time>.</p>
      <section id="at-a-glance">
        <h2>At a glance</h2>
        <div className="ar-table-wrap">
          <table className="ar-comparison-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Arras</th>
                <th scope="col">{comparison.name}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map(([label, arras, other]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{arras}</td>
                  <td>{other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <figure className="ar-desktop-shot">
        <Image src={`/puremac/arras/features/${comparison.image}.webp`} width={1470} height={956}
          sizes="(max-width: 800px) calc(100vw - 40px), 720px" alt={comparison.imageAlt} />
        <figcaption>{comparison.caption}</figcaption>
      </figure>
      {comparison.sections.map(([heading, copy], index) => (
        <section id={`workflow-${index + 1}`} key={heading}><h2>{heading}</h2><p>{copy}</p></section>
      ))}
      <p><a href={`${links.home}${comparison.guide[0]}`}>{comparison.guide[1]} →</a></p>
      <p><a className="ar-button" href={`${links.home}#install`}>Get Arras for Mac <span aria-hidden="true">↗</span></a></p>
      <section id="sources">
        <h2>Sources</h2>
        {comparison.sources.map(([label, url]) => <p key={url}><a href={url} referrerPolicy={url.startsWith("https://github.com/yashashwi-s/Arras") ? "origin" : undefined}>{label} ↗</a></p>)}
      </section>
      <section>
        <h2>More comparisons</h2>
        {Object.entries(comparisons).filter(([key]) => key !== slug).map(([key, value]) => (
          <p key={key}><a href={`${links.home}vs/${key}`}>{value.title} →</a></p>
        ))}
      </section>
    </SupportPage>
  );
}
