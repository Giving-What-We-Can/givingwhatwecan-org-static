---
title: 'The $/DALY Illusion: Part II - Averaging'
redirects:
    - blog/2013-01-03/the-daly-illusion-part-ii-averaging
    - blog/2014-02-28/daly-illusion-part-ii-averaging
author: false
slug: blog/2013-01-03/the-daly-illusion-part-ii-averaging
date: '2013-01-03'
time: '06:51pm'
updatedDate: '2014-02-11'
updatedTime: '06:51pm'
---
In the first post, I discussed how we can be misled when we compare improvements in cost-effectiveness between organisations whose cost-effectiveness is reported in $/DALY.

The $/DALY-DALY/$-contrast also becomes important when we start talking about averages. For instance, suppose that you want to consider how much better it is donate to, say, charity D, compared to spending equal proportions of one's money on charities C and D(1). In this case, you would want to compare C and D's average cost-effectiveness to the cost-effectiveness of D.

To obtain C and D's average cost-effectiveness, it is tempting to simply take the familiar arithmetic mean(2) (which is what we typically mean by "the" average) of the figures for C and D's cost-effectiveness in $/DALY reported in the table in the previous post (20 $/DALY and 10$/DALY respectively), to obtain (20 $/DALY+10 $/DALY)/2= 15 $/DALY

However, this would deliver the wrong result. To see why, suppose I donate $10 dollar to each of C and D. I would thereby avert $10/(10 $/DALY)+$10/(20 $/DALY)=1.5 DALY . Given that I donated $20 in total, the average cost-effectiveness of my donations would be (15 DALY)/$20=0.075 DALY/$, or, reported in $/DALY, ~13 $/DALY.

The reason for this in general is this: Suppose we want to average ratios (e.g. cost-effectiveness reported in $/DALY) across a number of instances (e.g. different charities, whose cost-effectiveness the ratios measure). In that case, the arithmetic mean must be used to average the ratios only when the denominator is held constant and the numerator variable across the different instances. For instance, this is the case when the ratios are reported in $/DALY, the amount of DALYs averted by each charity is meant to be held constant and the amount of $ donated to each charity variable . Accordingly, when we naively took the arithmetic mean between C's and D's cost-effectiveness reported in $/DALY, we were effectively calculating the effectiveness of splitting one's money between C and D in such a way that the amounts of DALYs that are averted by our donations to each of these charities are held constant (which is clearly not something we are typically interested in). But what we instead wanted to hold constant across instances was the amount of money that flows into the charities .

This problem can be remedied by taking the harmonic mean(3) rather than the arithmetic mean of C's and D's cost-effectiveness reported in $/DALY, i.e. 2/(1/(20 $/DALY)+1/(10 $/DALY))=~13 $/DALY.

In general, when we are averaging ratios across a number of instances, we have to use the harmonic mean exactly when the numerator is held constant and the denominator variable across the instances, e.g. when, as in our case above, the ratios are reported in $/DALY, the amount of $ donated to each charity is meant to be held constant across instances and the amount of DALYs averted by each charity is variable.

Note that effectively, taking the harmonic mean amounts to converting the cost-effectiveness estimates for C and D into DALY/$, taking their arithmetic mean, and then converting back into $/DALY. Accordingly, had we reported C's and D's cost-effectiveness in terms of DALY/$ at the outset, we would not have been misled in using the straightforward arithmetic mean.

What the considerations in post I and this post suggest is that it is usually wise to report cost-effectiveness in terms of DALY/$ rather than $/DALY, because then

1) the comparison of differences in cost-effectiveness that we are about are more conspicuous, as the differences could be obtained by simple subtraction and;

2) the most often relevant averages of cost-effectiveness could be reached simply by taking the familiar arithmetic mean, rather than the more cumbersome harmonic mean.

Accordingly, it would be helpful if it became conventional to report cost-effectiveness in terms of DALY/$ rather than $/DALY. Until this is the norm, we must take care not to be misled when averaging and comparing differences in cost-effectiveness estimates.

(1) Or similarly, that you are interested how much better D is then choosing between C and D at random, with an equal probability of choosing either. (2) The arithmetic mean of n values a1, a2, a3, … is given by ((a1+a2+⋯+an))/n. (3) The harmonic mean of n values a1, a2, …, an is given by n/(1/a1+1/a2…+1/an).