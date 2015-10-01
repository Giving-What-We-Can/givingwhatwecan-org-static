---
title: 'Estimating the Effectiveness of DCP2 - Post 2'
redirects:
    - blog/2012-11-01/estimating-the-effectiveness-of-dcp2-post-2
    - blog/2014-02-28/estimating-effectiveness-dcp2-post-2
    - blog/2012-11-01/estimating-the-effectiveness-of-dcp-2
author: michael-peyton-jones
slug: blog/2012-11-01/estimating-the-effectiveness-of-dcp2-post-2
date: '2012-11-01'
time: '02:03pm'
updatedDate: '2015-10-01'
updatedTime: '02:03pm'
---
Warning: We're now going to start assuming some serious statistics understanding! Not everyone will be able to follow the guts of the modelling, but the bottom line should still make sense. As before, we're using R to do most of the work, and the script is [attached](http://www.givingwhatwecan.org/sites/givingwhatwecan.org/files/dcpp-effectiveness-2.r).

In the previous post, I explained a simple statistical model for assessing the effectiveness of donating to DCP. In this post I would like to describe some improvements to the model. The most important of these is allowing for the possibility of error in DCP's assessment process. Some of the variation in the DCP's results are due not to real differences in the cost effectiveness of treatments, but rather simply measurement error on their part. We will run simulations where we vary how large this error is, and see how much it reduces the value of DCP's work. The conclusion is that given our guesses about the size of the errors and the money their research moves, DCP still appears much better to fund than the best treatment they identify. Some objections to this model are then noted.

To read the full post, please click [here](/files/dcpp_post_2.pdf).

**Update: the PDF has been corrected to fix some errors in the original.**

Read more on [our key sources here►](/where-to-give/methodology/our-sources)