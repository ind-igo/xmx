interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  verified?: boolean;
}

interface TwitterQuoteTweet {
  id: string;
  text: string;
  author_id: string;
}

interface TwitterApiResponse {
  data?: TwitterQuoteTweet[];
  includes?: {
    users?: TwitterUser[];
  };
  meta?: {
    result_count: number;
    next_token?: string;
  };
}

export interface QuoteTweet {
  id: string;
  username: string;
  displayName: string;
  verified: boolean;
  avatar: string;
  text: string;
}

// New interface for the fetcher's response
export interface QuoteTweetsResponse {
  quotes: QuoteTweet[];
  nextToken?: string;
}

// Helper to generate mock tweets for development
let mockTweetCounter = 0;
const generateMockQuoteTweets = (count = 5, forPostId: string, currentNextToken?: string): QuoteTweetsResponse => {
  const quotes: QuoteTweet[] = [];
  const startId = mockTweetCounter * 100;
  for (let i = 0; i < count; i++) {
    mockTweetCounter++;
    const userId = `mockUser${mockTweetCounter}`;
    quotes.push({
      id: `mockTweet${startId + i}_for_${forPostId}`,
      username: userId,
      displayName: `Mock User ${mockTweetCounter}`,
      verified: Math.random() > 0.7,
      avatar: generateDefaultAvatar(userId),
      text: `This is mock quote tweet number ${mockTweetCounter} for post ${forPostId}. It mentions how ${currentNextToken ? 'pagination works with token ' + currentNextToken : 'this is the first page'}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
    });
  }
  // Simulate pagination: if this is not the first page, don't provide a next token for the 3rd mock page.
  const newNextToken = currentNextToken === 'mockNextTokenPage2' ? undefined : `mockNextTokenPage${(mockTweetCounter / count) +1}`;
  return { quotes, nextToken: newNextToken };
};

const fetchQuoteTweets = async (postId: string, nextToken?: string): Promise<QuoteTweetsResponse> => {
  try {
    const quoteTweetsUrl = new URL(`https://api.twitter.com/2/tweets/${postId}/quote_tweets`);
    quoteTweetsUrl.searchParams.set("tweet.fields", "id,text,author_id");
    quoteTweetsUrl.searchParams.set("user.fields", "name,profile_image_url,username,verified");
    quoteTweetsUrl.searchParams.set("expansions", "author_id");
    quoteTweetsUrl.searchParams.set("max_results", "10");

    if (nextToken) {
      quoteTweetsUrl.searchParams.set("pagination_token", nextToken);
    }
    
    const response = await fetch(quoteTweetsUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'default',
    });

    console.log("Response:", response); // TODO

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Twitter API Error Response:', errorBody);
      throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
    }

    const apiResponseData: TwitterApiResponse = await response.json();

    if (!apiResponseData.data || apiResponseData.data.length === 0) {
      return { quotes: [], nextToken: undefined };
    }

    const usersMap = new Map<string, TwitterUser>();
    if (apiResponseData.includes?.users) {
      apiResponseData.includes.users.forEach(user => {
        usersMap.set(user.id, user);
      });
    }

    const fetchedQuotes: QuoteTweet[] = apiResponseData.data.map(tweet => {
      const user = usersMap.get(tweet.author_id);
      return {
        id: tweet.id,
        username: user?.username || 'unknown',
        displayName: user?.name || 'Unknown User',
        verified: user?.verified || false,
        avatar: user?.profile_image_url?.replace('_normal', '_bigger') || generateDefaultAvatar(user?.username || 'unknown'),
        text: tweet.text
      };
    });

    return {
      quotes: fetchedQuotes,
      nextToken: apiResponseData.meta?.next_token
    };

  } catch (error) {
    console.error('Error fetching quote tweets:', error);
    if (import.meta.env.DEV) { // Check if in development mode
      console.warn('API call failed. Falling back to mock data for development.');
      // Reset mock counter for new post ID to allow consistent mock pagination per post
      if (!nextToken) mockTweetCounter = 0; 
      return generateMockQuoteTweets(5, postId, nextToken);
    }
    throw error; 
  }
};

// Generate a default avatar SVG for users without profile images
const generateDefaultAvatar = (username: string): string => {
  const colors = ['#1DA1F2', '#657786', '#AAB8C2', '#E1E8ED', '#F7F9FA'];
  const colorIndex = username.length % colors.length;
  const color = colors[colorIndex];
  
  const svg = `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill="${color}"/>
      <text x="24" y="30" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">
        ${username.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export default fetchQuoteTweets;