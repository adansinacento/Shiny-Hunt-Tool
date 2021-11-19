# Shiny Hunt Tool
Your shiny hunt companion. [Here is the link.](https://adansinacento.github.io/Shiny-Hunt-Tool/)    
This software is meant to be a tool and help you in the (sometimes) tedious shiny hunt. It can help you keep the count, calculate statistics and so much more.

## How to use?
Start by clicking the `Setup` tab. Define what pokemon you are looking for, on which generation and some aditional details that will help determine the shiny probability.  
Once you are done you can switch to the `Tracker` tab to begin the hunt.  
Just press the `+` button everytime you encounter a pokemon and the page will make the proper calculations and update the in-screen data.

## What does those numbers mean?
<table>
  <tr>
    <th>Binomial probability:</th>
    <td>
      This refers to the probability of a shiny encounter after certain given number of unsuccessful (non-shiny) encounters. 
      You can think of it as "What are the odds of me finding this shiny after this many encounters"
    </td>
  </tr>
  <tr>
    <th>Until 90%</th>
    <td>This is how many more pokemon you must encounter before the binomial probability hits 90%</td>
  </tr>
</table>

You must know that certain probability does not mean that the shiny **will** appear after certain number of encounters. Just that on each individual encounter you have
certain chance of a successful shiny encounter.
