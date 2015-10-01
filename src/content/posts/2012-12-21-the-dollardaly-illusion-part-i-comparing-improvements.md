---
title: 'The $/DALY Illusion: Part I - Comparing Improvements'
redirects:
    - blog/2012-12-21/the-daly-illusion-part-i-comparing-improvements
    - blog/2014-02-28/daly-illusion-part-i-comparing-improvements
    - blog/2012-12-22/the-daly-illusion-part-i-comparing-improvements
author: bastian-stern
slug: blog/2012-12-21/the-daly-illusion-part-i-comparing-improvements
date: '2012-12-21'
time: '10:26pm'
updatedDate: '2014-02-11'
updatedTime: '10:26pm'
---
Imagine the following situation: Two of your friends, Jack and Jill, are each about to donate $1000 to two different charities. You know that both of them are on their way to their closest letter box, with the intention of posting their cheques to those charities. Unfortunately, neither of them has heard of the idea of cost-effective giving, and you know that you only have time to call up one of them convince one of them of directing their donation to a more cost-effective charity instead before they have reached the letter box to and it is too late to do that. You know that is costs $1000 to avert a DALY by donating to Jack's preferred charity, A, and that the best charity you could convince him to donate to instead, B, would allow him to avert a DALY for only $50\. Jill's preferred charity, C, allows her to avert a DALY for $20, but you know of an even better charity, D, that would allow her to avert a DALY for only $10, and you have reason to believe that you could convince Jill to donate to D instead.

**Cost-effectiveness**
 **A** 1000 $/DALY
 **B** 50 $/DALY
 **C** 20 $/DALY
 **D** 10 $/DALY

## Who should you call up?

A tempting first guess is that you should call up Jack: The difference in A's and B's cost-effectiveness measured in $/DALY (1000 $/DALY- 50 $/DALY=$950 $/DALY) dwarfs that between C and D (20 $/DALY-10 $/DALY=10 $/DALY). (Call this the "linear method" of evaluating the relevant differences.)

This becomes particularly salient when we illustrate A-D's respective cost-effectiveness reported in $/DALY graphically:

![](/images/uploads/screen_shot_2012-12-22_at_1.54.26_am.png)

Whilst the chart makes the improvement from A to B appear huge, the difference between C and D is hardly discernible with the naked eye.

A tempting second guess would be to look at what we might call the proportional improvement in cost-effectiveness of the changes from A to B and from C to D. On the most natural understanding of this approach, the proportional improvement between A's and B' cost-effectiveness measured in $/DALY is (1000 $/DALY - 50 $/DALY)/(1000 $/DALY)=95% and the proportional difference in C's and D's cost-effectiveness measured in $/DALY is (20 $/DALY - 10 $/DALY)/(20 $/DALY)=50%. Again, this would seem to strongly suggest that calling up Jack is much better than calling up Jill. (Call this the "proportional method" of evaluating the relevant differences.)

## What do you think?

In fact, simple calculation shows that both lines of reasoning are mistaken. By donating the $1000 to A, Jack would avert 1000/1000=1 DALY, whereas donating to B would allow him to avert 1000/50= 20 DALY. This means that calling him up allows you to avert 19 additional DALY. In contrast, donating her $1000 to C would allow Jill to avert 1000/20=50 DALY, whereas by donating to D she could avert 1000/10=100 DALY. This means that calling her up allows you to avert 50 additional DALYs. Accordingly, calling up Jill allows you to have more than twice the positive impact!

What went wrong when we made our first and second guesses, which turned out to be so radically misleading? The answer is that when you are interested in how much good you can do by redirecting a given amount of money between different causes, you are interested in how many more DALYs you can avert by giving to one cause rather than another, i.e. differences in their cost-effectiveness reported DALY/$.

Where "x" is the cost-effectiveness of charity X reported in $/DALY, and "y" the cost-effectiveness of charity Y reported in $/DALY, the improvement in cost-effectiveness in moving from X to Y reported in terms of DALY/$ is given by (1/x)-(1/y), or, equivalently, by (y-x)/xy (which, as you can check for yourself, delivers the correct result in the case above, namely that the improvement in moving from C and D is 50/19≈2.6 times greater than that between A and B.)

This also shows what was wrong with our first two guesses. Our first guess was to evaluate the improvement from X to Y's cost-effectiveness as y-x (which I called the linear method), our second guess as the proportional improvement between y and x, i.e. as (y-x)/y (which I called the proportional method). However, these latter two functions evidently fail to be related in a strictly increasing way with (y-x)/xy (i.e. fail to be related in such a way that whenever (y-x)/xy increases, these latter functions increase, too), which is why both the linear and the proportional methods give the wrong answer.

The linear method misled us because it simply ignores the denominator of (y-x)/xy, xy, altogether. The proportional method misled us because it omits part of the denominator of (y-x)/xy, namely x. Both methods systematically overvalue improvements in cost-effectiveness between less effective charities (like A and B), and, by the same token, systematically undervalue improvements in cost-effectiveness between especially effective charities (like C and D).

Note that had we reported the cost-effectiveness estimates in DALY/$ from the outset, these complications would not have arisen.

Also note that there are cases in which straightforwardly taking the differences (i.e. using the linear method) does tell us what we are interested in. For instance, imagine that both Jack and Jill want to avert exactly one DALY (rather than spending a fixed amount of $1000), and your primary interest is to advise them so that they save as much money as possible. In that case, it really is the case that x-y is what you should be interested in. By averting 1 DALY by giving to B rather than A, Jack can save $950, and by averting 1 DALY by giving to D rather than C, Jill can only save $10, which would suggest that, in this altered scenario, you should call up Jack.

However, whilst this latter sort of situation is what we typically encounter when making day-to-day purchases (e.g. when you want to buy exactly one chocolate bar, and you are interested in comparing how much money you can save by choosing between various shops), it is clearly not the sort of situation donors are typically faced with in the context of charitable giving. Donors are usually interested in the differences in how much good they can do with a given amount of money, rather than the differences in how much money they can save for a given amount of good they want to do.

In the next post, I will discuss complications the $/DALY metric gives rise to when we talk about cost-effectiveness averages.

[1] The phenomenon I am about to describe is analogous to the well-known MPG Illusion: People tend to be misled about the value of improvements in car fuel efficiency when efficiency is reported in miles per gallon (instead of a unit that allows us to state efficiency in terms of volume per distance traveled, e.g. liters per 100 kilometers). Reporting efficiency in terms of MPG also gives rise to complications associated with evaluating average efficiency analogous to those I discuss below.

[2] The Disability-Adjusted Life Year (DALY) is a metric that is commonly used to quantify and compare the benefits of different interventions. DALYs are a measure of lost health due to illness. One DALY represents the equivalent to losing a year of life at full health. Each illness has a disability weight assigned to it, representing the amount it reduces a person's quality of life. For example, a year of life spent with blindness counts for 0.6 DALYs.

[3] I take this to be "most natural" given that basing one's comparison of two improvements in cost-effectiveness on the comparison of the corresponding reductions in cost per unit effect (which this "proportional method" amounts to) appears to be the best analogue of a mistake some people make when asked to compare the improvements in car fuel efficiency reported in MPG. In the latter case, people sometimes (mistakenly) think that, where the improvement comes about by moving from car A to car B, they need to calculate the "proportional improvement" given by (Efficiency(B)-Efficiency(A))/Efficiency(A), and compare improvements by comparing "proportional improvements". [Read more](http://www.sciencemag.org/content/suppl/2008/06/19/320.5883.1593.DC1/Larrick.SOM.pdf).