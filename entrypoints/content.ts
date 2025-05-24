const relevantPeopleAnchor = 'aside[aria-label="Relevant people"]';
// const xPostUrlPattern = new MatchPattern(
const xPostUrlPattern = /.*x\.com\/([a-zA-Z0-9_]+)\/status\/(\d+)$/;

const parseXUrl = (url: string) => {
  const match = xPostUrlPattern.exec(url);
  if (!match) return null;
  const [, username, id] = match;
  return { username, id };
};

export default defineContentScript({
  matches: ["*://*.google.com/*", "*://x.com/*/status/*"],
  main(ctx) {
    console.log("IN CONTENT SCRIPT");
    let postId;
    ctx.addEventListener(window, "wxt:locationchange", ({ newUrl }) => {
      console.log("PARSING URL");
      // Return early if not on a post
      if (!xPostUrlPattern.test(newUrl.href)) return;
      // Extract post ID from URL
      postId = newUrl.pathname.split("/")[3];
    });

    console.log(postId);

    createIntegratedUi(ctx, {
      position: "inline",
      anchor: relevantPeopleAnchor,
      append: "before",
      onMount: (container) => {
        // return render(() => <QuoteBox />, container);
        console.log(container);
        return document.querySelector("p");
      },
    }).mount();
  },
});
