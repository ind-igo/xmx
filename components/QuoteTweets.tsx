import { createSignal, onMount, For, Show } from 'solid-js';

interface QuoteTweet {
  id: string;
  username: string;
  displayName: string;
  verified: boolean;
  avatar: string;
  text: string;
}

interface QuoteTweetsProps {
  tweetId: string;
}

const QuoteTweets = (props: QuoteTweetsProps) => {
  const [quotes, setQuotes] = createSignal<QuoteTweet[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  // Mock data fetch function
  const fetchQuoteTweets = async (tweetId: string): Promise<QuoteTweet[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data
    return [
      {
        id: "1",
        username: "user1",
        displayName: "User One",
        verified: true,
        avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM1ZDc0ODgiLz4KPC9zdmc+",
        text: "This is an interesting take on the topic!",
      },
      {
        id: "2",
        username: "user2",
        displayName: "User Two",
        verified: false,
        avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM1ZDc0ODgiLz4KPC9zdmc+",
        text: "I completely disagree with this perspective.",
      },
      {
        id: "3",
        username: "user3",
        displayName: "User Three",
        verified: true,
        avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM1ZDc0ODgiLz4KPC9zdmc+",
        text: "Has anyone else noticed this trend lately?",
      },
      {
        id: "4",
        username: "user4",
        displayName: "User Four",
        verified: false,
        avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM1ZDc0ODgiLz4KPC9zdmc+",
        text: "Great point, I hadn't thought of it this way.",
      },
    ];
  };

  const loadMoreQuotes = () => {
    const newQuotes = [
      {
        id: `${quotes().length + 1}`,
        username: `user${quotes().length + 1}`,
        displayName: `User ${quotes().length + 1}`,
        verified: Math.random() > 0.5,
        avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM1ZDc0ODgiLz4KPC9zdmc+",
        text: "Adding my thoughts to this conversation!",
      },
      {
        id: `${quotes().length + 2}`,
        username: `user${quotes().length + 2}`,
        displayName: `User ${quotes().length + 2}`,
        verified: Math.random() > 0.5,
        avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM1ZDc0ODgiLz4KPC9zdmc+",
        text: "I have a different perspective on this.",
      },
    ];
    setQuotes([...quotes(), ...newQuotes]);
  };

  onMount(async () => {
    try {
      const quoteTweets = await fetchQuoteTweets(props.tweetId);
      setQuotes(quoteTweets);
      setLoading(false);
    } catch (err) {
      setError("Could not load quote tweets");
      setLoading(false);
    }
  });

  const QuoteTweetItem = (props: { quote: QuoteTweet }) => (
    <div 
      class="p-3 px-4 relative"
      style={{ 
        "border-top": "1px solid rgb(47, 51, 54)",
        "transition": "background-color 0.2s"
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <div class="flex items-center mb-1">
        <img 
          src={props.quote.avatar} 
          alt={props.quote.displayName} 
          class="w-12 h-12 rounded-full mr-3"
        />
        <div class="flex flex-col flex-1">
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
    </div>
  );

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
      <Show when={loading()}>
        <div 
          class="p-4 text-[15px]"
          style={{ color: "rgb(113, 118, 123)" }}
        >
          Loading quote tweets...
        </div>
      </Show>

      {/* Error State */}
      <Show when={error()}>
        <div 
          class="p-4 text-[15px]"
          style={{ color: "rgb(113, 118, 123)" }}
        >
          {error()}
        </div>
      </Show>

      {/* Content */}
      <Show when={!loading() && !error()}>
        <Show 
          when={quotes().length > 0}
          fallback={
            <div 
              class="p-4 text-[15px]"
              style={{ color: "rgb(113, 118, 123)" }}
            >
              No quote tweets found
            </div>
          }
        >
          {/* Scrollable content area */}
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

          {/* Show more button */}
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
      </Show>
    </div>
  );
};

export default QuoteTweets; 