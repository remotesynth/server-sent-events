## Server Sent Event Examples

This project includes some simple examples of sending and consuming server sent events. There are two aspects to the project:

1. Server - This folder contains a simple Express server with API methods for each of the endpoints. There are three endpoints, one for ChatGPT (API key required), one for Mastodon (API key required), and one for DEV. The first two stream updates while the last one checks the API for new items on a periodic basis using `setInterval`.
2. Astro - This is a simple Astro site that consumes these endpoints using the EventSource API.

Why did I not just use Astro for both? Honestly, I tried and failed. I could not get the frontend to consume an Astro API function so, for lack of time, I scrapped that idea and just went with Express. However, there is an example using Astro [in this repo](https://github.com/MicroWebStacks/astro-examples/tree/main/03_sse-counter) that does simple events sent on a schedule with `setInterval`.

### Additional Resources

I have included a [PDF of my research notes](ServerSentEvents_ResearchNotes.pdf) as well as a PDF of my [slide deck with speaker notes](ServerSentEvents_Presentation.pdf).