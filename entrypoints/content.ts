import QuoteTweets from '~/components/QuoteTweets';

const sidebarAnchor = '[data-testid="sidebarColumn"]';
// const trendingAnchor = 'div[aria-label="Trending"]';
const xPostUrlPattern = /.*x\.com\/([a-zA-Z0-9_]+)\/status\/(\d+)$/;

const parseXUrl = (url: string) => {
  const match = xPostUrlPattern.exec(url);
  if (!match) return null;
  const [, username, id] = match;
  return { username, id };
};

export default defineContentScript({
  matches: ["*://x.com/*/status/*"],
  main(ctx) {
    console.log("XMX Quote Tweets - Content Script Loaded");
    
    let currentPostId: string | null = null;
    let uiInstance: any = null;

    const initializeQuoteTweets = (postId: string) => {
      // Clean up existing UI if it exists
      if (uiInstance) {
        uiInstance.remove();
        uiInstance = null;
      }

      currentPostId = postId;
      console.log("Initializing Quote Tweets for post:", postId);

      // Create UI for the trending section
      uiInstance = createIntegratedUi(ctx, {
        position: "inline",
        anchor: sidebarAnchor,
        append: "replace",
        onMount: (container) => {
          // Style the container to make it sticky and blend with X's UI
          container.style.cssText = `
            display: block;
            width: 100%;
            position: sticky;
            top: 20px;
            height: calc(100vh - 40px);
            overflow: hidden;
          `;
          
          // Create a wrapper div for better positioning
          const wrapper = document.createElement('div');
          wrapper.style.cssText = `
            position: relative;
            z-index: 1;
            height: 100%;
            overflow: hidden;
            padding-left: 15px;
          `;
          container.appendChild(wrapper);

          // Render the SolidJS component
          const dispose = render(() => QuoteTweets({ tweetId: postId }), wrapper);
          
          return dispose;
        },
      });

      uiInstance.mount();
    };

    // Handle initial page load
    const initialUrl = window.location.href;
    const initialParsed = parseXUrl(initialUrl);
    if (initialParsed) {
      // Delay initialization to ensure X's UI is loaded
      setTimeout(() => initializeQuoteTweets(initialParsed.id), 1000);
    }

    // Handle navigation changes (X's SPA routing)
    ctx.addEventListener(window, "wxt:locationchange", ({ newUrl }) => {
      console.log("URL changed:", newUrl.href);
      
      const parsed = parseXUrl(newUrl.href);
      if (parsed && parsed.id !== currentPostId) {
        // Delay to ensure X's UI has updated
        setTimeout(() => initializeQuoteTweets(parsed.id), 1000);
      } else if (!parsed && uiInstance) {
        // Not on a tweet page, clean up
        uiInstance.remove();
        uiInstance = null;
        currentPostId = null;
      }
    });
  },
});
