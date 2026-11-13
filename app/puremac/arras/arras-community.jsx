import ArrasReviewCarousel from "./arras-review-carousel";

const thread = "https://www.reddit.com/r/macapps/comments/1x8yz99/os_arras_v25_native_macos_desktop_photo_widgets/";
const comments = [
  {
    author: "Stone-D",
    subreddit: "r/MacOSApps",
    quote: "I made a super basic widget to show a png of class schedules on my desktop on Rainmeter and this duplicates that functionality effortlessly.",
    url: "https://www.reddit.com/r/MacOSApps/comments/1u5bmnt/comment/paxutev/",
  },
  {
    author: "AceReviewer",
    subreddit: "r/MacOSApps",
    quote: "This is very nice. Thank you for making it free and accessible.",
    url: "https://www.reddit.com/r/MacOSApps/comments/1u5bmnt/comment/orjtccm/",
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
  {
    author: "_alanb",
    quote: "Cheers to your excellent work on this app.",
    url: "https://www.reddit.com/r/macapps/comments/1x8yz99/comment/phhata2/",
  },
  {
    author: "meuwop",
    subreddit: "r/MacOSApps",
    quote: "Nice work!",
    url: "https://www.reddit.com/r/MacOSApps/comments/1u5bmnt/comment/p5t01t9/",
  },
  {
    author: "BarisSayit",
    quote: "Looks nice. It being open source is another great point.",
    url: "https://www.reddit.com/r/macapps/comments/1x8yz99/comment/phihzw6/",
  },
  {
    author: "JeyK333",
    quote: "nice to see it notarized now. that gatekeeper warning puts a lot of people off open-source mac apps.",
    url: "https://www.reddit.com/r/macapps/comments/1x8yz99/comment/phi36nq/",
  },
  {
    author: "Sea_Confidence_57",
    quote: "always needed one !!",
    url: "https://www.reddit.com/r/macapps/comments/1x8yz99/comment/phgu5qr/",
  },
  {
    author: "iamgroad",
    subreddit: "r/MacOSApps",
    quote: "Very nice and thanks for Making it Open Source ❤️👍",
    url: "https://www.reddit.com/r/MacOSApps/comments/1u5bmnt/comment/orjjlku/",
  },
];

export default function ArrasCommunity() {
  return (
    <section className="ar-wrap ar-community" aria-labelledby="arras-community-heading">
      <div className="ar-community-heading">
        <h2 id="arras-community-heading">What people said on Reddit</h2>
        <a className="ar-text-link" href={thread}>Read the r/macapps discussion <span aria-hidden="true">↗</span></a>
      </div>
      <ArrasReviewCarousel count={comments.length}>
        {comments.map(({ author, quote, subreddit = "r/macapps", url }) => (
          <figure className="ar-review" key={url}>
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
