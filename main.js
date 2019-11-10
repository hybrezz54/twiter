/**
 * Course: COMP 426
 * Assignment: a09
 * Author: Hamzah Chaudhry
 */

/** Maximum number of tweets to display */
const MAX_TWEETS = 5;

/**
 * Render HTML to display the body and author of
 * a Tweet object
 * 
 * @param {*} tweet A Tweet object
 */
export const renderTweet = (tweet) => {
    return `<section class="tweet is-dark" data-tweet="${tweet.id}">
                <div class="columns is-large">
                    <div class="column is-four-fifths">
                        <div class="card has-text-centered">
                            <div class="card-content">
                                <p class="is-size-4">
                                    ${tweet.body}
                                </p>
                                <p class="subtitle is-size-6">
                                    ${tweet.author}
                                </p>
                            </div>

                            <!-- <footer class="card-footer">
                                
                            </footer> -->
                        </div>
                    </div>

                    <div class="column has-text-centered">
                        <div class="actions">
                            <div class="action action-like">
                                <span class="icon is-large">
                                    <i class="mdi mdi-heart mdi-48px"></i>
                                </span>
                            </div>

                            <div class="action action-retweet">
                                <span class="icon is-large">
                                    <i class="mdi mdi-twitter-retweet mdi-48px"></i>
                                </span>
                            </div>

                            <div class="action action-delete">
                                <span class="icon is-large">
                                    <i class="mdi mdi-delete mdi-48px"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>`;
};

/**
 * Render HTML to display a dialog asking
 * the user to login
 */
export const renderLoginModal = () => {
    return `<div class="modal is-active">
                <div class="modal-background"></div>

                <div class="modal-content">
                    <a class="button is-info is-medium" href="login">
                        Log in
                    </a>

                    <button id="close" class="delete action" aria-label="close"></button>
                </div>
            </div>`;
};

/**
 * Render HTML to display a dialog for
 * the user to create a Tweet
 */
export const renderNewTweetModal = () => {
    return `<div class="modal is-active">
                <div class="modal-background"></div>

                <div class="modal-card">
                    <button id="close" class="delete" aria-label="close"></button>

                    <section class="modal-card-body">
                        <div class="field is-horizontal">
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <textarea id="tweet-body" class="textarea" placeholder="What's happening?" maxlength="280"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer class="card-footer">
                        <div id="tweet" class="card-footer-item action action-tweet">
                            <span>
                                Tweet <i class="mdi mdi-twitter"></i>
                            </span>
                        </div>
                    </footer>
                </div>
            </div>`;
}

/**
 * Render HTML to display a dialog for
 * the user to create a Tweet
 */
export const renderTweetModal = (tweet) => {
    return `<div class="modal is-active">
                <div class="modal-background"></div>

                <div class="modal-card">
                    <button id="close" class="delete" aria-label="close"></button>

                    <section class="modal-card-body">
                        <div class="field is-horizontal">
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <textarea class="textarea" placeholder="What's happening?" maxlength="280"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer class="card-footer">
                        <div class="card-footer-item action action-edit">
                            <span>
                                Edit &nbsp; <i class="mdi mdi-pencil"></i>
                            </span>
                        </div>

                        <div class="card-footer-item actions">
                            <div class="action action-like">
                                <span class="icon">
                                    <i class="mdi mdi-heart mdi-24px"></i>
                                </span>
                            </div>

                            <div class="action action-retweet">
                                <span class="icon">
                                    <i class="mdi mdi-twitter-retweet mdi-24px"></i>
                                </span>
                            </div>

                            <div class="action action-delete">
                                <span class="icon">
                                    <i class="mdi mdi-delete mdi-24px"></i>
                                </span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>`;
}

/**
 * Add rendered Tweets to a jQuery element with a specified starting
 * index in a list of tweets and a specified number of tweets
 * 
 * @param {*} elmt The root element to append the rendered HTML of the tweets to
 * @param {*} tweets The list of Tweet objects 
 * @param {*} start The index to start in the list tweets
 */
export const addTweets = (elmt, tweets, start = 0) => {
    let size = (tweets.length > MAX_TWEETS) ? MAX_TWEETS : tweets.length;

    for (let i = start; i < (start + size); i++) {
        elmt.append(renderTweet(tweets[i]));
    }
}

/**
 * 
 * @param {*} elmt 
 */
export const getTweets = async (elmt) => {
    // retreive and display tweets
    const resp = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
    }).catch((err) => {
        // not logged in
        console.log(err);
        elmt.append(renderLoginModal());
    });

    // process tweets
    if (resp) {
        // add first few tweets to page
        const tweets = resp.data;
        addTweets(elmt, tweets);

        // add more tweets on scroll
        $(window).off();
        $(window).scroll(() => {
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                const num = elmt.children().length;
                addTweets(elmt, tweets, num);
            }
        });
    }
}

// set up on page load
$(document).ready(() => {
    // div to display tweets
    const $tweets = $('#tweets');

    // new tweet button hadnler
    $('button.action-tweet').on('click', (event) => {
        $tweets.append(renderNewTweetModal());
    });

    // tweet button handler
    $tweets.on('click', '#tweet', async (event) => {
        const body = $('#tweet-body').val();
        const result = await axios({
            method: 'post',
            url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
            withCredentials: true,
            data: {
                body: body
            }
        }).catch((err) => {
            console.log(err);
        });

        // update tweets
        if (result) {
            $tweets.empty();
            getTweets($tweets);
        }
    });

    // modal close handler
    $tweets.on('click', '#close', (event) => {
        $('div.modal').remove();
    });

    // update with 50 recent tweets
    getTweets($tweets);
});