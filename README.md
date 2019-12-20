# twiter
A Twiter clone made for a class assignment

## API
|  name      |   type    |   example   |                description
-------------|-----------|-------------|---------------------------------------------
|    id      |  number   |     498     | The unique identification number assigned to the Tweet by the server database
|   type     |  string   |  "retweet"  | Specifies whether the Tweet is a regular tweet ("tweet"), a reply to another Tweet ("reply"), or a retweet of another Tweet ("retweet")<br /><br />Must be one of the following values: ["tweet", "retweet", "reply"]
|   body     |  string   | "This is what the user said" | The body text of the Tweet  |
   author    |  string   | "Aaron S."  | The first name and last initial of the user who posted the Tweet, as a string
  parentId   |  number   |     263     | If this Tweet is a reply or a retweet, this is the id of the referenced Tweet
|  parent    |  Tweet object |             | If this Tweet is a reply or a retweet and the referenced Tweet is available, then this is the referenced Tweet's data
|  isMine    |  boolean  |    false    | True if the Tweet was created by the current, logged in user
|  isLiked   |  boolean  |     true    | True if the Tweet is liked by the current, logged in user
retweetCount |  number   |      0      | The number of retweets for this Tweet
| replyCount |  number   |      1      | The number of replies for this Tweet
| likeCount  |  number   |      1      | The number of likes for this Tweet
| someLikes  | array of strings | ["Erin S."] | A non-exhaustive list of names of users who have liked this tweet
| replies    | array of Tweet objects |             | If available, this is an array of reply Tweets that were posted in response to this Tweet
| createdAt  | timestamp |             | The date and time at which the Tweet was posted
| updatedAt  | timestamp |             | The date and time at which the Tweet was last updated
    

## Screenshots
### Landing Page
![Landing Page](Screenshot_2019-12-20_0.png)

### Tweet Detailed View
![Tweet](Screenshot_2019-12-20_1.png)

### New Tweet View
![New Tweet](Screenshot_2019-12-20_2.png)