---
title: 'The contagiousness modifier'
redirects:
    - blog/2013-02-26/the-contagiousness-modifier
    - blog/2013-02-26/contagiousness-modifier
author: false
slug: blog/2013-02-26/the-contagiousness-modifier
date: '2013-02-26'
time: '02:21pm'
updatedDate: '2014-02-11'
updatedTime: '02:21pm'
---
![none](http://biop.ox.ac.uk/www/lj2001/lea/lea-4.jpg)

_By Matt Griffiths**,** working Pro Bono for Costello Medical Consulting, and Robert Wiblin_

In order to understand the impact of any charitable intervention against a disease, it is imperative to have a full appreciation of the scope of the disease burden, both epidemiologically and economically. By 'scope of the disease burden', I am not only referring to a standard static measurement of the prevalence, treatment costs and morbidity; we also need to factor in the dynamic nature of the disease itself. For instance, imagine a choice between two treatments: programme A, which provides direct treatment to 100,000 sufferers of a poorly transmissible disease, or programme B, which cures just 10,000 patients suffering from a similarly painful disease that is renowned for its high transmissibility. The immediate impact of programme A will be higher, but ultimately programme B may represent the more cost-effective option, especially if further cases are hard to treat.

Without factoring in the contagiousness of a disease, we will probably underestimate the effect that curing someone with a given disease may have. [A] Furthermore, we won't appropriately prioritise highly contagious diseases.

One way of capturing the effect of the contagiousness of a disease on the impact of a cure/treatment might be to develop a quantitative measure unique to each disease, here termed the _contagiousness multiplier_. When I started searching I was hopeful that such a measure would exist amongst the epidemiological literature. The question is, after all, important for prioritising the provision of healthcare. My search was, admittedly, not systematic, but after exploring a number of search terms based around "contagiousness/transmissibility" of disease on Google and PubMed, I was disappointed to find nothing of obvious application to the problem.

I then decided to consider another phrasing of the problem: '_if someone with the disease is spontaneously cured, how many fewer people will catch the disease who otherwise would have?'_ This strongly reminded me of another measure I had heard of: the basic reproductive number, referred to as R<sub>0</sub>.

The basic reproductive number is defined as "the average number of secondary infections caused by a single infectious individual during their entire infectious lifetime". R<sub>0</sub> must be greater than 1 for a disease to persist in the population. It would certainly seem to be a promising tool for modelling contagiousness of different diseases, not least because this measure is well studied and because indicative values are already documented for a number of diseases (e.g. measles ~12-18<sup>1</sup>, influenza ~2-3<sup>2</sup>, HIV ~2-5 [among male homosexuals in England and Wales<sup>3</sup>]). So, can these values be used to directly generate contagiousness multipliers for comparing different diseases, and thereby allow us to determine the effect of a charitable intervention in terms of the total number of disease cases avoided over a given time period?

Unfortunately, R<sub>0</sub> is quite an imperfect measure. The basic reproductive number is not a characteristic of the disease alone, but of the disease in a specific population at a specific time. In particular, it is not possible for a disease to indefinitely have an R<sub>0</sub> far above 1, because eventually the number of people with the disease would exceed the entire population! There are several ways a disease with a high R<sub>0</sub> tends to see its basic reproductive number decline over time:

*   Someone who already has a disease can't 'double catch' it
*   Someone who has already had a disease often dies or becomes immune
*   We, as humans, respond and contain such diseases with artificial interventions.

Over the long run, a disease should reach an equilibrium in which the rate of new cases equals the rate at which people are cured. If this wasn't the case, curing a single person of a disease with a high R<sub>0</sub> would have an enormous impact in the long run!

If we had a good measure of the R<sub>0</sub> for a disease in a given time and place, this value would still take some interpretation for our purposes. R<sub>0</sub> represents the total number of people who are infected with a disease by a contagious individual, and so describes the value of curing someone before they become infectious. This is therefore a useful number when evaluating interventions for disease prevention, but not treatment. Many charities may not cause people to be treated who otherwise wouldn't have been, but instead may cause them to be treated earlier. In this case what matters is the 'rate of transmission per day', not the total number of people infected. If we know the average length of time that an infected person remains contagious, we can derive this number. [B]

Nonetheless, the factors influencing contagiousness of a pathogen are many and interacting: pathogen and host characteristics as well as overarching population dynamics all play a role, and are likely to differ between diseases. It is not practical for us to consider all of these factors individually and so it seems to me that a contagiousness multiplier must be derived from epidemiological measures that already exist. The basic reproductive number has provided a good starting point, and whilst the caveats associated with the use of R<sub>0</sub> limit its direct application as a contagiousness multiplier, the exploration of this tool has certainly highlighted to me some important points for consideration. I hope that in my further research the potential indirect applications of R<sub>0</sub> and other measures will become clearer.

[A] At least if we are using micro-level studies, rather than data looking at the prevalence of a disease across an entire region.

[B] A disease with a low probability of transmission, but a long infectious period, might have the same R<sub>0</sub> as a highly contagious disease with only a short infectious period, because the R<sub>0</sub> values will be calculated over the respective infectious periods of these diseases. As a result, when trying to model the impact of a charitable intervention over a given time period, the direct application of R<sub>0</sub> as a contagiousness multiplier is not appropriate.

### References

<sup>1</sup> http://practice.sph.umich.edu/micphp/epicentral/basic_reproduc_rate.php

<sup>2</sup> Mills CE, Robins JM and Lipsitch M, Transmissibility of 1918 pandemic influenza, _Nature_ **432** (7019): 904-6

<sup>3</sup> http://ocw.jhsph.edu/courses/publichealthbiology/PDFs/Lecture2.pdf