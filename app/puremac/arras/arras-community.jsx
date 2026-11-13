import ArrasReviewCarousel from "./arras-review-carousel";

const thread = "https://www.reddit.com/r/macapps/comments/1x8yz99/os_arras_v25_native_macos_desktop_photo_widgets/";
const comments = [
  {
    author: "Stone-D",
    subreddit: "r/MacOSApps",
    quote: "This is exactly what I was looking for, coming from Windows and Rainmeter.",
    url: "https://www.reddit.com/r/MacOSApps/comments/1u5bmnt/comment/paxutev/",
  },
  {
    author: "LostInInaka",
    quote: "Been using it since…sorry I forgot what the app used to be called before the name change to arras …but always been great!",
    url: "https://www.reddit.com/r/macapps/comments/1x8yz99/comment/phgwwfz/",
  },
  {
    author: "blazegreenhalgh",
    quote: "Cool app, such cozy vibes. Great work",
    url: "https://www.reddit.com/r/macapps/comments/1x8yz99/comment/phhexqf/",
  },
  {
    author: "21CenturyAD",
    quote: "This is such a good app! Thanks for making it free and open source!",
    url: "https://www.reddit.com/r/macapps/comments/1x8yz99/comment/phhj84g/",
  },
];

export default function ArrasCommunity() {
  return (
    <section className="ar-wrap ar-community" aria-labelledby="arras-community-heading">
      <div className="ar-community-heading">
        <h2 id="arras-community-heading">What people said on Reddit</h2>
        <a className="ar-text-link" href={thread}>Read the r/macapps discussion <span aria-hidden="true">↗</span></a>
      </div>
      <ArrasReviewCarousel>
        {comments.map(({ author, quote, subreddit = "r/macapps", url }) => (
          <figure className="ar-review" key={author}>
            <blockquote cite={url}><p>{quote}</p></blockquote>
            <figcaption>
              <a href={url}>u/{author} · {subreddit} <span aria-hidden="true">↗</span></a>
            </figcaption>
          </figure>
        ))}
      </ArrasReviewCarousel>
    </section>
  );
}
