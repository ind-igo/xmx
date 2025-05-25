const fetchQuoteTweets = async (postId: string) => {
  // https://api.twitter.com/2/tweets/1925299005191577921/quote_tweets
  const response = await fetch(
    `https://api.x.com/2/tweets/${postId}/quote_tweets`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export default fetchQuoteTweets;