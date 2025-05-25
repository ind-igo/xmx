import { createSignal, onMount, For, Show } from 'solid-js';
import fetchQuoteTweets from '~/lib/quoteFetcher';
import type { QuoteTweet, QuoteTweetsResponse } from '~/lib/quoteFetcher';
import VerifiedIcon from '~/assets/verified.svg';

interface QuoteTweetsProps {
  tweetId: string;
}

const QuoteTweets = (props: QuoteTweetsProps) => {
  const [quotes, setQuotes] = createSignal<QuoteTweet[]>([]);
  const [nextToken, setNextToken] = createSignal<string | undefined>(undefined);
  const [loading, setLoading] = createSignal(true);
  const [loadingMore, setLoadingMore] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const loadInitialQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: QuoteTweetsResponse = await fetchQuoteTweets(props.tweetId);
      setQuotes(response.quotes);
      setNextToken(response.nextToken);
    } catch (err) {
      console.error("Failed to load initial quote tweets:", err);
      setError("Could not load quote tweets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreQuotes = async () => {
    if (!nextToken() || loadingMore()) return;

    setLoadingMore(true);
    setError(null);
    try {
      const response: QuoteTweetsResponse = await fetchQuoteTweets(props.tweetId, nextToken());
      setQuotes(prevQuotes => [...prevQuotes, ...response.quotes]);
      setNextToken(response.nextToken);
    } catch (err) {
      console.error("Failed to load more quote tweets:", err);
      setError("Could not load more quote tweets. Please try again later."); 
      // You might want to display this error differently, e.g., near the "Show more" button
    } finally {
      setLoadingMore(false);
    }
  };

  onMount(() => {
    loadInitialQuotes();
  });

  const QuoteTweetItem = (props: { quote: QuoteTweet }) => {
    const tweetUrl = () => `https://x.com/${props.quote.username}/status/${props.quote.id}`;

    return (
      <a 
        href={tweetUrl()}
        rel="noopener noreferrer"
        class="block p-3 px-4 relative no-underline"
        style={{ 
          "border-top": "1px solid rgb(47, 51, 54)",
          "transition": "background-color 0.2s",
          color: "inherit"
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        <div class="flex items-center mb-2">
          <img 
            src={props.quote.avatar} 
            alt={props.quote.displayName} 
            class="w-12 h-12 rounded-full mr-3"
          />
          <div class="flex flex-col flex-1 ml-2">
            <div class="flex items-center">
              <span 
                class="font-bold text-[15px] mr-1"
                style={{ color: "rgb(231, 233, 234)" }}
              >
                {props.quote.displayName}
              </span>
              <Show when={props.quote.verified}>
                <svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" aria-label="Verified account">
                  <g>
                    <path 
                      fill="rgb(29, 155, 240)" 
                      d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"
                    />
                  </g>
                </svg>
              </Show>
            </div>
            <span 
              class="text-sm"
              style={{ color: "rgb(113, 118, 123)" }}
            >
              @{props.quote.username}
            </span>
          </div>
        </div>
        <div 
          class="text-[15px] leading-5 mt-1"
          style={{ color: "rgb(231, 233, 234)" }}
        >
          {props.quote.text}
        </div>
      </a>
    );
  };

  return (
    <div 
      id="quote-tweets-container" 
      class="rounded-2xl my-4 flex flex-col"
      style={{ 
        "max-height": "calc(100vh - 120px)",
        background: "rgb(22, 24, 28)",
        border: "1px solid rgb(47, 51, 54)"
      }}
    >
      {/* Custom scrollbar styles */}
      <style>{`
        #quote-tweets-container .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        #quote-tweets-container .overflow-y-auto::-webkit-scrollbar-track {
          background: rgb(22, 24, 28);
        }
        #quote-tweets-container .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgb(47, 51, 54);
          border-radius: 20px;
          border: none;
        }
        #quote-tweets-container .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: rgb(113, 118, 123);
        }
      `}</style>

      {/* Header */}
      <div 
        class="p-4"
        style={{ "border-bottom": "1px solid rgb(47, 51, 54)" }}
      >
        <h2 
          class="text-xl font-extrabold m-0"
          style={{ color: "rgb(231, 233, 234)" }}
        >
          Quote Tweets
        </h2>
      </div>

      {/* Loading State */}
      <Show when={loading() && quotes().length === 0}>
        <div 
          class="p-4 text-[15px]"
          style={{ color: "rgb(113, 118, 123)" }}
        >
          Loading quote tweets...
        </div>
      </Show>

      {/* Error State */}
      <Show when={error() && quotes().length === 0}>
        <div 
          class="p-4 text-[15px]"
          style={{ color: "rgb(113, 118, 123)" }}
        >
          {error()}
        </div>
      </Show>

      {/* Content */}
      <Show when={quotes().length > 0 || (!loading() && !error())}>
        <div 
          class="flex-1 overflow-y-auto" 
          style={{ "scrollbar-width": "thin", "scrollbar-color": "rgb(47, 51, 54) rgb(22, 24, 28)" }}
        >
          <div class="flex flex-col">
            <For each={quotes()}>
              {(quote) => <QuoteTweetItem quote={quote} />}
            </For>
          </div>
        </div>

        <Show when={nextToken() && !loadingMore()}>
          <div style={{ "border-top": "1px solid rgb(47, 51, 54)" }}>
            <a 
              href="#"
              class="block p-4 no-underline text-[15px] text-center font-medium transition-colors"
              style={{ 
                color: "rgb(29, 155, 240)",
                "text-decoration": "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.color = "rgb(26, 140, 216)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "rgb(29, 155, 240)";
              }}
              onClick={(e) => {
                e.preventDefault();
                loadMoreQuotes();
              }}
            >
              Show more
            </a>
          </div>
        </Show>
        <Show when={loadingMore()}>
          <div 
            class="p-4 text-[15px] text-center"
            style={{ color: "rgb(113, 118, 123)" }}
          >
            Loading more...
          </div>
        </Show>
        <Show when={!loading() && !nextToken() && quotes().length === 0}>
           <div 
              class="p-4 text-[15px]"
              style={{ color: "rgb(113, 118, 123)" }}
            >
              No quote tweets found for this post.
            </div>
        </Show>
      </Show>
    </div>
  );
};

export default QuoteTweets; 