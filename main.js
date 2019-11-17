/**
 * Course: COMP 426
 * Assignment: a09
 * Author: Hamzah Chaudhry
 */

/** Number of tweets to load at a time */
const TWEET_LIMIT = 20;

/**
 * Return a string-formatted date
 * 
 * @param {*} date Date object
 */
const formatDate = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
};

/**
 * Render HTML to display a dialog asking
 * the user to login
 */
const renderLoginModal = () => {
    return `<div class="modal is-active" data-tweet="-1">
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
const renderNewTweetModal = (id = -1, parentId = -1, reply = false, body = '') => {
    return `<div class="modal is-active" data-tweet="${id}" data-parent="${parentId}" ${reply ? 'reply' : ''}>
                <div class="modal-background"></div>

                <div class="modal-card">
                    <button id="close" class="delete" aria-label="close"></button>

                    <section class="modal-card-body">
                        <div class="field is-horizontal">
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <textarea id="tweet-body" class="textarea" placeholder="What's happening?" maxlength="280">${body}</textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer class="card-footer">
                        <div id="${body ? 'update' : 'tweet'}" class="card-footer-item action action-tweet">
                            <span>
                                ${body ? 'Update' : reply ? 'Reply' : 'Tweet'} <i class="mdi mdi-twitter"></i>
                            </span>
                        </div>
                    </footer>
                </div>
            </div>`;
}

/**
 * Render HTML to display the body and author of
 * a Tweet object
 * 
 * @param {*} tweet A Tweet object
 */
const renderTweet = (tweet) => {
    let retweetIndicator = '';
    if (tweet.type === 'retweet') {
        retweetIndicator = `<p class="body retweet-body is-size-6">
                                ${tweet.body}
                            </p>

                            <p class="subtitle retweet-author is-size-6">
                                <span class="icon">
                                    <i class="mdi mdi-twitter-retweet"></i>
                                </span>
                                by ${tweet.author}
                            </p>`;
    }

    return `<section class="tweet is-dark" data-tweet="${tweet.id}">
                <div class="columns is-large" data-tweet="${tweet.id}">
                    <div class="column is-four-fifths">
                        <div class="card has-text-centered">
                            <div class="card-content">
                                <p class="body is-size-4">
                                    ${tweet.type === 'retweet' && tweet.parent ? tweet.parent['body'] : tweet.body}
                                </p>

                                <p class="subtitle author is-size-5">
                                    ${tweet.type === 'retweet' && tweet.parent ? tweet.parent['author'] : tweet.author}
                                </p>

                                ${retweetIndicator}
                            </div>
                        </div>
                    </div>

                    <div class="column has-text-centered">
                        <div class="actions">
                            <div class="action ${tweet.isLiked ? 'action-liked' : 'action-like'} ${tweet.isMine ? 'is-hidden' : ''}" data-count="${tweet.likeCount}">
                                <span class="icon is-large">
                                    <i class="mdi mdi-heart mdi-48px"></i>
                                </span>
                            </div>

                            <div class="action action-retweet" data-count="${tweet.retweetCount}">
                                <span class="icon is-large">
                                    <i class="mdi mdi-twitter-retweet mdi-48px"></i>
                                </span>
                            </div>

                            <div class="action action-reply">
                                <span class="icon is-large">
                                    <i class="mdi mdi-reply mdi-48px"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>`;
};

/**
 * Render HTML to display a dialog for
 * the user to create a Tweet
 */
const renderTweetModal = (tweet) => {
    const createTime = new Date(tweet.createdAt);

    // show button only if has replies
    let replyIndicator = '';
    if (tweet.replyCount > 0) {
        replyIndicator = `<hr />
                          <div>
                            <div class="card-footer-item action action-view-replies">
                                <span>
                                    View Replies...
                                </span>
                            </div>
                          </div>`;
    }

    // indicate if tweet is a retweet
    let retweetIndicator = '';
    if (tweet.type === 'retweet') {
        retweetIndicator = `<h3 class="retweet-author is-size-6">
                                <span class="icon">
                                    <i class="mdi mdi-twitter-retweet"></i>
                                </span>
                                by ${tweet.author}           
                            </h3>

                            <p class="body retweet-body is-size-6">
                                ${tweet.body}
                            </p>`;
    }

    return `<div class="modal is-active" data-tweet="${tweet.id}" data-parent="${tweet.parentId ? tweet.parentId : '-1'}">
                <div class="modal-background"></div>

                <div class="modal-card">
                    <button id="close" class="delete" aria-label="close"></button>

                    <section class="modal-card-body">
                        ${retweetIndicator}

                        <p class="title body">
                            ${tweet.type === 'retweet' && tweet.parent ? tweet.parent['body'] : tweet.body}
                        </p>

                        <h3 class="subtitle author">
                            ${tweet.type === 'retweet' && tweet.parent ? tweet.parent['author'] : tweet.author}
                        </h3>
                        
                        <div class="tags">
                            <span class="tag is-dark">${tweet.likeCount} Likes</span>
                            <span class="tag is-dark">${tweet.retweetCount} Retweets</span>
                        </div>

                        <p class="date">
                            ${formatDate(createTime)}
                        </p>
                    </section>

                    <footer class="card-footer">
                        <div class="card-footer-item action action-edit ${!tweet.isMine ? 'is-hidden' : ''}">
                            <span>
                                Edit &nbsp;<i class="mdi mdi-pencil"></i>
                            </span>
                        </div>

                        <div class="card-footer-item action action-reply" data-count="${tweet.replyCount}">
                            <span>
                                Reply &nbsp;<i class="mdi mdi-reply"></i>
                            </span>
                        </div>

                        <div class="card-footer-item actions">
                            <div class="action ${tweet.isLiked ? 'action-liked' : 'action-like'} ${tweet.isMine ? 'is-hidden' : ''}" data-count="${tweet.likeCount}">
                                <span class="icon">
                                    <i class="mdi mdi-heart mdi-24px"></i>
                                </span>
                            </div>

                            <div class="action action-retweet" data-count="${tweet.retweetCount}">
                                <span class="icon">
                                    <i class="mdi mdi-twitter-retweet mdi-24px"></i>
                                </span>
                            </div>

                            <div class="action action-delete ${!tweet.isMine ? 'is-hidden' : ''}">
                                <span class="icon">
                                    <i class="mdi mdi-delete mdi-24px"></i>
                                </span>
                            </div>
                        </div>
                    </footer>

                    ${replyIndicator}
                </div>
            </div>`;
}

/**
 * 
 * @param {*} reply 
 */
const renderReply = (reply) => {
    // TODO
}

/**
 * 
 * @param {*} replies 
 */
const renderReplyModal = (replies) => {
    // TODO
}

/**
 * Add rendered Tweets to a jQuery element with a specified starting
 * index in a list of tweets and a specified number of tweets
 * 
 * @param {*} elmt The root element to append the rendered HTML of the tweets to
 * @param {*} tweets The list of Tweet objects 
 * @param {*} start The index to start in the list tweets
 * @param {*} limit The number of tweets to add
 */
const addTweets = (elmt, tweets) => {
    let numTweets = elmt.attr('data-num');

    // add tweets to page
    for (let i = 0; i < tweets.length; i++) {
        // TODO only append tweets not already in page
        elmt.append(renderTweet(tweets[i]));
        numTweets++;
    }

    // update attribute for number of tweets on page
    elmt.attr('data-num', numTweets);
}

/**
 * 
 * @param {*} elmt A jQuery element to append new elements too
 */
const getTweets = async (elmt, skip = 0, limit = TWEET_LIMIT) => {
    // retreive and display tweets
    const resp = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        params: {
            skip: skip,
            limit: TWEET_LIMIT,
            where: {
                type: ['tweet', 'retweet']
            }
        }
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
        // $(window).off();
        // $(window).scroll(() => {
        //     if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        //         const num = elmt.children().length;
        //         addTweets(elmt, tweets, num);
        //     }
        // });
    }
}

const invalidate = (elmt) => {
    elmt.empty();
    elmt.attr('data-num', 0);
    getTweets(elmt);
}

// set up on page load
$(document).ready(() => {
    // div to display tweets
    const $tweets = $('#tweets');
    let page = 0;

    // new tweet button hadnler
    $('button.action-tweet').on('click', (event) => {
        $tweets.append(renderNewTweetModal());
    });

    // tweet button handler
    $tweets.on('click', '#tweet', async (event) => {
        const body = $('#tweet-body').val();
        const parentId = parseInt($(event.currentTarget).parent().parent().parent().attr('data-parent'));
        const isReply = $(event.currentTarget).parent().parent().parent().attr('reply') === '';

        // return if no body in tweets and replies
        if ((isReply && !body) || (parentId === -1 && !body))
            return;

        // create object for request
        const data = {
            body: body
        };

        // set appropriate params on retweet
        if (parentId > -1) {
            data['type'] = 'retweet';
            data['parent'] = parentId;
        }

        // set appropriate parms on reply
        if (isReply && parentId > -1) {
            data['type'] = 'reply';
            data['parent'] = parentId;
        }

        // create request
        await axios({
            method: 'post',
            url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
            withCredentials: true,
            data: data
        }).then(() => { // update tweets
            console.log('Request successful!');
            invalidate($tweets);
        }).catch((err) => { // assume not logged in
            console.log(err);
            $tweets.append(renderLoginModal());
        });
    });

    // update button handler
    $tweets.on('click', '#update', async (event) => {
        const body = $('#tweet-body').val();
        const id = $(event.currentTarget).parent().parent().parent().attr('data-tweet');

        // if body contains val
        if (body) {
            const result = await axios({
                method: 'put',
                url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
                withCredentials: true,
                data: {
                    body: body
                },
            }).catch((err) => {
                // not logged in
                console.log(err);
                $tweets.append(renderLoginModal());
            });

            if (result) {
                $('div.modal').remove();
                $tweets.append(renderTweetModal(result.data));
            }
        }
    });

    // timeline tweet click handler
    $tweets.on('click', 'section.tweet .card', async (event) => {
        const $tgt = $(event.currentTarget);
        const id = $tgt.parent().parent().parent().attr('data-tweet');

        // retreive tweet info
        const result = await axios({
            method: 'get',
            url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
            withCredentials: true,
        }).catch((err) => {
            console.log(err);

            // tweet deleted
            if (err.toString().includes('404')) {
                invalidate($tweets);
                return;
            }

            // assume not logged in
            $tweets.append(renderLoginModal());
        });

        // show dialog
        if (result) {
            $tweets.append(renderTweetModal(result.data));
        }
    });

    // like tweet action click handler
    $tweets.on('click', 'div.action-like', async (event) => {
        const $tgt = $(event.currentTarget);
        const id = $tgt.parent().parent().parent().parent().attr('data-tweet');
        const count = parseInt($tgt.attr('data-count'));

        // like tweet
        const result = await axios({
            method: 'put',
            url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}/like`,
            withCredentials: true,
        }).catch((err) => {
            console.log(err);

            // tweet deleted
            if (err.toString().includes('404')) {
                invalidate($tweets);
                return;
            }

            // assume not logged in
            $tweets.append(renderLoginModal());
        });

        if (result) {
            $tgt.removeClass('action-like').addClass('action-liked');
            $tgt.attr('data-count', count + 1);
            $('.tag:first-of-type').text((count + 1) + ' Likes');
        }
    });

    // unlike tweet action click handler
    $tweets.on('click', 'div.action-liked', async (event) => {
        const $tgt = $(event.currentTarget);
        const id = $tgt.parent().parent().parent().parent().attr('data-tweet');
        const count = parseInt($tgt.attr('data-count'));

        // unlike tweet
        const result = await axios({
            method: 'put',
            url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}/unlike`,
            withCredentials: true,
        }).catch((err) => {
            console.log(err);

            // tweet deleted
            if (err.toString().includes('404')) {
                invalidate($tweets);
                return;
            }

            // assume not logged in
            $tweets.append(renderLoginModal());
        });

        if (result) {
            $tgt.removeClass('action-liked').addClass('action-like');
            $tgt.attr('data-count', count - 1);
            $('.tag:first-of-type').text((count - 1) + ' Likes');
        }
    });

    // delete tweet action click handler
    $tweets.on('click', 'div.action-delete', async (event) => {
        const $tgt = $(event.currentTarget);
        const id = $tgt.parent().parent().parent().parent().attr('data-tweet');

        // delete tweet
        const result = await axios({
            method: 'delete',
            url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
            withCredentials: true,
        }).catch((err) => {
            // assume not logged in
            console.log(err);
            $tweets.append(renderLoginModal());
        });

        if (result) {
            $('div.modal').remove();
            $(`[data-tweet=${id}]`).remove();
        }
    });

    // reply tweet action click handler
    $tweets.on('click', 'div.action-reply', (event) => {
        const $tgt = $(event.currentTarget);
        const parentId = $tgt.parent().parent().parent().attr('data-tweet');

        // show tweet dialog
        $tweets.append(renderNewTweetModal(-1, parentId, true));
    });
    
    // retweet action handler
    $tweets.on('click', 'div.action-retweet', async (event) => {
        const $tgt = $(event.currentTarget);
        const parentId = $tgt.parent().parent().parent().parent().attr('data-tweet');

        // show tweet dialog
        $tweets.append(renderNewTweetModal(-1, parentId));
    });

    // edit tweet action click handler
    $tweets.on('click', 'div.action-edit', async (event) => {
        const $tgt = $(event.currentTarget);
        const id = $tgt.parent().parent().parent().attr('data-tweet');
        const parentId = $tgt.parent().parent().parent().attr('data-parent');
        const body = $(`[data-tweet=${id}] section > p.body:first`).text().trim();

        // show tweet dialog
        $tweets.append(renderNewTweetModal(id, parentId, false, body));
    });

    // action hover handler
    // $tweets.on('mouseenter', 'div.action-like, div.action-retweet, div.action-reply', (event) => {
    //     console.log("hi");
    // }).on('mouseleave', 'div.action-like, div.action-retweet, div.action-reply', (event) => {
    //     console.log("bye");
    // });

    // modal close handler
    $tweets.on('click', '#close', async (event) => {
        const id = parseInt(event.currentTarget.parentNode.parentNode.getAttribute('data-tweet'));
        $('div.modal').remove();
        // invalidate($tweets);

        // retreive tweet info
        if (id >= 0) {
            const result = await axios({
                method: 'get',
                url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
                withCredentials: true,
            }).catch((err) => {
                console.log(err);

                // tweet deleted
                if (err.toString().includes('404')) {
                    invalidate($tweets);
                    return;
                }

                // assume not logged in
                $tweets.append(renderLoginModal());
            });

            // update tweet in feed
            if (result) {
                $(`[data-tweet=${id}]`).replaceWith(renderTweet(result.data));
            }
        }
    });

    // add more tweets on scroll
    $(window).scroll(() => {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            getTweets($tweets, page += TWEET_LIMIT);
        }
    });

    // update with recent tweets
    getTweets($tweets);
});