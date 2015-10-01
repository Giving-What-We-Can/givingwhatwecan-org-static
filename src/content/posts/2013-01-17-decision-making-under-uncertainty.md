---
title: 'Decision Making under Uncertainty'
redirects:
    - blog/2013-01-17/decision-making-under-uncertainty
author: ben-hoskin
slug: blog/2013-01-17/decision-making-under-uncertainty
date: '2013-01-17'
time: '10:01pm'
updatedDate: '2014-02-11'
updatedTime: '10:01pm'
---
![dice](/images/uploads/dice.jpg)Sadly, there are no certainties in life. In charity research, as in other decisions, we have to deal with the fact that we can only ever have 'probabilistic' knowledge: there is always some chance we might be wrong. Indeed, the available information on intervention cost-effectiveness leaves us with considerable uncertainty about the true figures.

A naive way of dealing with this would be to simply work out what the most likely outcome is, and focus on that. So if we think a drug will probably save a life, we count the drug as saving a life. If it probably won't, we consider it as not saving a life.

However, this is clearly a dangerous approach. My house probably won't burn down this year - but I still buy house insurance. I probably won't be hit by a car as I hit the road - but I should still check for cars. When the stakes are high enough, we definitely need to take into account low-probability events.

On the other hand we shouldn't simply fixate on the best or worst scenarios. We take reasonable precautions against being involved in a car accident - but we still cross the road. Instead, we need to take into account both the severity of the consequences of a possible outcome, and the likelihood of that consequence.

The mathematical procedure for doing this is using _expected values_. We multiply the probability of each outcome by its magnitude, add them together, and produce an expected value.

Expected Value = (Probability of outcome 1)*(Magnitude of outcome 1) + (Probability of outcome 2)*(Magnitude of outcome 2) + ... + (Probability of outcome n)*(Magnitude of outcome n)

This approach has many advantages; those interested in the mathematics should see the Wikipedia articles on [Expected Value](http://en.wikipedia.org/wiki/Expected_value) and [Expected Utility](http://en.wikipedia.org/wiki/Expected_utility_hypothesis).

### Credences

The Expected Value approach requires we be able to assign probabilities to each of the possible outcomes. But this can be very hard, or even seem impossible - how can we assign a probability to something that only occurs once, like the Duke of Wellington winning at Waterloo?

We deal with this by treating probabilities as _subjective credences_. A probability doesn't express something objective about the world like frequencies or propensities. Instead, it expresses a mental fact about our confidence in a proposition; a probability of 1 means utter certainty, and a probability of 0 means utter disbelief.

In practice we never have the infinite amounts of evidence requires to achieve total certainty - our probabilities lie between 0 and 1\. And this is exactly why we need to use expected values.

In some cases it's easy to assign a credence - if half the population is female, we can happily assign a 50% probability to a randomly chosen person being female. Some cases are more difficult - how can we put a probability on the Democrats winning the next US presidential election?

However, while this is hard, we just don't have a choice. We have to make decisions, and if we don't use probabilities - or something equivalent - we run the risk of behaving [inconsistently](http://en.wikipedia.org/wiki/Dutch_book). Our actions will always imply credences, even if we don't consciously hold them. While gut instinct works well for familiar everyday decisions about our local environment, or decisions that don't have big consequences, humans don't generally have well-trained intuitions for the effectiveness of different approaches. Using credences on the other hand and embracing the uncertainty that they make explicit, offers us the best chance to help the most people.