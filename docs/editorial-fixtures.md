# Editorial fixture policy

The Preview inventory is synthetic. Its scenarios are adapted from the
canonical specification's voice examples and exist only to validate product
behavior. They are not claims about current companies, products, or events.

Every fixture record:

- uses `fixture: true`;
- displays `SPECIMEN` instead of a live date;
- points back to the fixture explanation;
- carries a reviewed source line;
- stays separate from live event eligibility;
- includes provenance, prompt, model, and reference-dataset versions.

Production ingestion must never turn these records into current news. Live
events require real source records, verified claims, eligibility above 70, a
perspective score of at least 75, and the complete publish gate.
