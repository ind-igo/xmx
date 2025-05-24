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
    <div class="p-3 px-4 border-t border-[#2f3336] relative">
      <div class="flex items-center mb-1">
        <img 
          src={props.quote.avatar} 
          alt={props.quote.displayName} 
          class="w-12 h-12 rounded-full mr-3"
        />
        <div class="flex flex-col">
          <div class="flex items-center">
            <span class="font-bold text-[15px] mr-1">{props.quote.displayName}</span>
            <Show when={props.quote.verified}>
              <span class="inline-flex items-center justify-center bg-[#1d9bf0] text-white rounded-full w-4 h-4 text-xs">
                ✓
              </span>
            </Show>
          </div>
          <span class="text-[#71767b] text-sm">@{props.quote.username}</span>
        </div>
      </div>
      <button class="absolute top-3 right-4 bg-white text-black border-none rounded-full py-1.5 px-4 font-bold text-sm cursor-pointer hover:bg-gray-200 transition-colors">
        Follow
      </button>
      <div class="text-[15px] leading-5 mt-1">{props.quote.text}</div>
    </div>
  );

  return (
    <div 
      id="quote-tweets-container" 
      class="bg-black rounded-2xl my-4 text-white border border-[#2f3336] flex flex-col"
      style={{ "max-height": "500px" }}
    >
      {/* Custom scrollbar styles */}
      <style>{`
        #quote-tweets-container .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        #quote-tweets-container .overflow-y-auto::-webkit-scrollbar-track {
          background: #000;
        }
        #quote-tweets-container .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 20px;
          border: none;
        }
        #quote-tweets-container .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #444;
        }
      `}</style>

      {/* Header */}
      <h2 class="text-xl font-extrabold py-3 px-4 m-0 text-white">
        Quote Tweets
      </h2>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="p-4 text-[#71767b] text-[15px]">
          Loading quote tweets...
        </div>
      </Show>

      {/* Error State */}
      <Show when={error()}>
        <div class="p-4 text-[#71767b] text-[15px]">
          {error()}
        </div>
      </Show>

      {/* Content */}
      <Show when={!loading() && !error()}>
        <Show 
          when={quotes().length > 0}
          fallback={
            <div class="p-4 text-[#71767b] text-[15px]">
              No quote tweets found
            </div>
          }
        >
          {/* Scrollable content area */}
          <div class="flex-1 overflow-y-auto" style={{ "scrollbar-width": "thin", "scrollbar-color": "#333 #000" }}>
            <div class="flex flex-col">
              <For each={quotes()}>
                {(quote) => <QuoteTweetItem quote={quote} />}
              </For>
            </div>
          </div>

          {/* Show more button */}
          <a 
            href="#" 
            class="block p-4 text-[#1d9bf0] no-underline text-[15px] border-t border-[#2f3336] hover:bg-[rgba(255,255,255,0.03)] mt-auto transition-colors"
            onClick={(e) => {
              e.preventDefault();
              loadMoreQuotes();
            }}
          >
            Show more
          </a>
        </Show>
      </Show>
    </div>
  );
};

export default QuoteTweets; 