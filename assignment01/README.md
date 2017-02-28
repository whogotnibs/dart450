Clear Canvas
By Thomas Bell

Drawing from the Past:

One of my earliest memories on the web is using, the now defunct blogging editor, Piczo to create a homepage for my early-2000’s self. Thekeysite.piczo.com was exciting for me because I was given easy-to-use tools for self-expression on the internet. In retrospect it was an aesthetically hideous webpage, but there is something positive to take away from this early experience of curating my identity on the internet. Since this early iteration I have reimagined my web personality several times using various tools. Other than reminding me how much I have changed overtime, I have found that it is useful to reflect on these old aesthetics to inform new ones. What worked? What didn’t? What god-awful colour scheme am I now never going to use again? That kind of thing.

With Clear Canvas, I have created an easy-to-use drawing interface with javascript. The concept is for anyone to be able to express themselves on the web with these tools. The more that they use the interface the more they will discover how to create stuff that they like with it. This idea of learning by process of experimentation, mirrors my own experience with self-expression on the web and is therefore appropriate for my homepage.

I implemented a drawing mechanic by placing 10x10px divs at the user’s mouse coordinates every few milliseconds as long as their mouse is down. By pressing ‘C’ the user runs a function to re-style the page’s css; leaving old marks in their original colour, but affecting the canvas colour and any new marks. Hopefully, as they play around and experiment with the brush and the many possible colour combinations, they are able to achieve something that they find cool. Furthermore, when the user goes to clear what they have drawn, its opacity fades but remains faint in the background, informing what they will create next. Clearing the page also triggers a css-animated flash of multiple divs (created using a loop, colour randomly selected from array, height randomly selected within the height of the window) as well as the optimistic words of an old British guy (ex. “what will you make now?”) using the responsiveVoice library.

** (a note about the music)
The music that I included on the website is there to immerse the user in the activity of drawing, but is also conceptually relevant. The song is an iPhone recording from 4 years back of a friend and I improvising on our instruments; synthesizer and drum machine. It is a soundtrack full of experimentation (“I had a chord that I couldn’t get”) and artistic expression, much like what I hope for my homepage to encourage.