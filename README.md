# Relevance Rationale

Relevance was a product to help combat the flood of AI-generated cold outreach. Our earlier work with Sharepage showed us how much bad AI-generated outreach was flooding people's inboxes, and Relevance was out attempt at an answer. 

Relevance monitored your gmail inbox and would identify new inbound messages; it would tag these, archive them, and generate an auto-response directing people to fill out a brief form in our app (`https://relevance.to`). When these were filled out, users would be notified and could decide if they wished to respond. This created a few benefits over cold outreach:

1. We moved responding to outreach out of your "checking your email flow" and into a new flow where you could block off 10-15minutes to focus solely on this. Initial interviews suggested that users _do_ want to read cold outreach, as it's a way to stay up-to-date on the market and new trends.
2. We could collect more information than what was reasonable to include in an email (like forcing sellers to verify with LinkedIn), longer form content, and links to additional content.
3. If a seller took the time to fill out the form, there was a higher likelihood the seller was worth considering.

This product was similar to Gated (which we learned about after we built our initial prototype). 

## Interested Technical Details

1. This product leverage Google Gmail APIs, both for monitoring a users email as well as supporting a way to respond in-app that would generate an email from our user to the seller. We had the system fully working, but a security review was required lest users saw a scary "This app is Univerified" screen; the full verification process requires an outside firm to audit and pentest our app. 
2. A core feature was publicly viewable pages, so we needed to support a url scheme that worked well for this. We landed on a scheme like `https://www.relevance.to/ryan-echternacht`, where `ryan-echternacht` was configurable by the user (and we made sure to prevent collisions). Overtime, we would probably have required non-paying users to use something like `ryan-echternacht-asdf123` (similar to how LinkedIn handles this).
