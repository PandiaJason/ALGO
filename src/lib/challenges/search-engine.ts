// src/lib/challenges/search-engine.ts
import { ChallengeData } from "./types";

export const searchEngineChallenge: ChallengeData = {
  slug: "search-engine",
  number: "17",
  title: "Inverted-Index Search Engine",
  subtitle: "From inverted index postings lists to BM25 probabilistic relevance ranking and positional phrase matching.",
  badge: "DATA INFRASTRUCTURE CAPSTONE",
  domain: "AI_SYSTEMS",
  inspiredBy: "Lucene, Elasticsearch, Meilisearch",
  whatStudentsBuild: "Inverted-index full-text search engine",
  mainSkill: "Indexing, ranking, text processing",
  signatureQuestion: "Can you search millions of documents quickly?",
  overview:
    "In this engineering challenge, you construct a high-throughput full-text search engine from first principles — inspired by the information retrieval architectures of Apache Lucene, Elasticsearch, and Meilisearch. Rather than using sqlite FTS or regex grep, you build raw text tokenizers, inverted index postings lists, fast boolean query intersections, Okapi BM25 statistical ranking, positional phrase proximity matchers, and immutable segment compaction.",
  whyItMatters:
    "Information retrieval powers every modern product: search bars, logging platforms, log observability (ELK), and vector databases. A naive search does O(N) regex scans across terabytes of text. Understanding postings lists, BM25 saturation, and segment merging is fundamental for high-performance data systems.",
  finalOutcome:
    "Upon completing all 6 levels, you have engineered a production-grade search engine supporting inverted index construction, fast boolean query intersections, BM25 probabilistic relevance ranking, positional phrase matching, and immutable segment compaction.",
  philosophy: "Encounter real information retrieval problems: vocabulary growth, postings list intersections, term frequency saturation curves, and positional proximity matching.",
  architectureDiagram: `                     DOCUMENT CORPUS
                            │
               ┌────────────┴────────────┐
               │  Tokenizer & Normalizer │
               └────────────┬────────────┘
                            │
                     Inverted Index
                            │
         Term ────────► Posting List with Doc IDs
        "engine"  ──► [ Doc 1, Doc 4, Doc 9 ]
        "redis"   ──► [ Doc 1, Doc 2 ]
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
       Boolean Query                 BM25 Scorer
     (AND / OR / NOT)             (TF-IDF Relevance)`,
  levelRoadmap: [
    { level: 1, whatWeBuild: "Inverted index & text tokenizer", mainConcept: "Alphanumeric normalization, vocabulary dictionary, sorted posting lists" },
    { level: 2, whatWeBuild: "Boolean query evaluator", mainConcept: "Two-pointer sorted posting list intersection (AND) and union (OR) without intermediate sets" },
    { level: 3, whatWeBuild: "TF-IDF vector relevance", mainConcept: "Term frequency (TF) and inverse document frequency (IDF) relevance scoring" },
    { level: 4, whatWeBuild: "Okapi BM25 ranking engine", mainConcept: "Term frequency saturation curve (k1) and document length normalization (b)" },
    { level: 5, whatWeBuild: "Positional postings & phrase search", mainConcept: "Word offset indexing, sliding-window exact phrase and proximity queries" },
    { level: 6, whatWeBuild: "LSM segment merging & compaction", mainConcept: "Immutable mini-segments, tombstone filtering, tiered background compaction" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Inverted Index & Tokenizer",
      focus: "Term-to-Document Posting Lists",
      description: "Extracts terms from raw document text, normalizes tokens, and constructs sorted inverted posting lists.",
      realWorldTech: "Lucene StandardTokenizer and PostingList data structure",
    },
    {
      number: 2,
      name: "Boolean Query Evaluator",
      focus: "Postings Intersection & Union",
      description: "Executes AND, OR, and NOT queries by merging sorted posting lists with two-pointer linear scans.",
      realWorldTech: "Lucene ConjunctionDISI and DisjunctionScorer",
    },
    {
      number: 3,
      name: "TF-IDF Vector Relevance",
      focus: "Term Frequency & Inverse Document Frequency",
      description: "Scores matching documents using term frequency and corpus rarity weights to bubble relevant hits to the top.",
      realWorldTech: "Classic Lucene TF-IDF Similarity",
    },
    {
      number: 4,
      name: "Okapi BM25 Ranking Engine",
      focus: "Term Saturation & Length Normalization",
      description: "Calculates probabilistic relevance ranking with term frequency saturation curves and document length penalties.",
      realWorldTech: "Elasticsearch default BM25Similarity (k1=1.2, b=0.75)",
    },
    {
      number: 5,
      name: "Positional Postings & Phrase Search",
      focus: "Sliding Window Offset Proximity",
      description: "Records precise word offsets per document to evaluate exact phrase matches and proximity distance queries.",
      realWorldTech: "Lucene PhraseQuery and SloppyPhraseScorer",
    },
    {
      number: 6,
      name: "Segment Merging & Compaction",
      focus: "LSM-Style Immutable Commit Points",
      description: "Writes documents to immutable mini-segments and executes background compaction merges to eliminate tombstoned records.",
      realWorldTech: "Lucene TieredMergePolicy and Elasticsearch segment consolidation",
    },
  ],
  levels: {
    1: {
      level: 1,
      shortTitle: "Inverted Index & Postings",
      title: "Tokenizer & Inverted Index Postings",
      difficulty: "Easy",
      tagline: "Tokenize input text into lowercase terms. Build an inverted index mapping each term to sorted document IDs.",
      whatAreYouBuilding: `You are going to build an inverted index. Think of it as the index at the back of a cookbook. Instead of reading every single recipe page to find 'chicken', you look up the word 'chicken' in the back and it instantly gives you a list of page numbers.

For example:
INDEX d1 Hello World
POSTINGS hello

Your search engine looks up 'hello' and instantly returns the documents containing it:
POSTINGS hello d1`,
      howItWorks: `When a document is indexed:
1. Convert the entire text into lowercase so 'Hello' and 'hello' match.
2. Split the text into individual words (tokens).
3. For each word, add the document's ID to a list associated with that specific word.
4. Ensure that the list of document IDs for each word is sorted alphabetically.

When a search runs:
1. Find the exact word in your dictionary.
2. Return its pre-sorted list of document IDs.`,
      technicalTerms: [
        {
          "term": "Inverted Index",
          "definition": "A data structure mapping content (like words) to its locations in a database, exactly like the index of a book."
        },
        {
          "term": "Tokenization",
          "definition": "The process of breaking a raw string of text into smaller, standardized pieces (tokens or words)."
        },
        {
          "term": "Postings List",
          "definition": "The sorted array of document IDs that contain a specific term."
        }
],
      description: `Searching by scanning every document from start to finish is fine for 10 files, but impossible for 10 million files (like the entire internet). It requires O(N) time complexity where N is the total amount of text.

An Inverted Index flips the relationship. It analyzes documents ahead of time and builds a dictionary mapping every unique word to the documents that contain it. This reduces search time from a massive linear scan down to O(1) instantaneous dictionary lookup, forming the foundation of every major search engine in the world.`,
      implementationGuide: [
        "Initialize a global dictionary (hash map) where keys are string terms and values are Sets (or Arrays) of string doc_ids.",
        "On 'INDEX <doc_id> <words...>', convert all words to lowercase.",
        "For each lowercase word, add the doc_id to that word's list in the dictionary.",
        "Keep track of the total number of unique documents indexed. Print 'INDEXED <doc_id> <term_count>'.",
        "On 'DOC_COUNT', print 'DOCS <total_unique_documents>'.",
        "On 'POSTINGS <term>', look up the term. If it doesn't exist, print 'NOT_FOUND'. Otherwise, sort the doc_ids alphabetically and print 'POSTINGS <term> <doc1> <doc2>...'"
],
      diagram: `DOCUMENT INPUT                            INDEXING ENGINE                 INVERTED POSTINGS
INDEX d1 Hello World          ──► tokenize ["hello", "world"] ──► INDEXED d1 2
INDEX d2 Hello Systems        ──► tokenize ["hello", "systems"]──► INDEXED d2 2
POSTINGS hello                ──► lookup inverted dictionary ──► POSTINGS hello d1 d2
POSTINGS world                ──► lookup inverted dictionary ──► POSTINGS world d1`,
      importantChallenge: {
        title: "Linear Document Grep vs Inverted Postings",
        description:
          "Searching documents by scanning every word of every document is O(D * L), which grinds to a halt on corpora with millions of pages. An inverted index constructs a dictionary of unique vocabulary terms pointing directly to pre-sorted document IDs, reducing keyword lookups from linear scans to O(1) hash lookups.",
        codeOrFormat: "Dictionary: 'hello' -> [d1, d2]\nDictionary: 'world' -> [d1]\nDictionary: 'systems' -> [d2]",
      },
      endGoalDemonstration: `INDEX d1 Hello World
INDEXED d1 2
INDEX d2 Hello Systems
INDEXED d2 2
DOC_COUNT
DOCS 2
POSTINGS hello
POSTINGS hello d1 d2
POSTINGS world
POSTINGS world d1`,
      nextLevelTeaser:
        "In Level 2, we implement Boolean Query Evaluation using two-pointer sorted postings list intersection (AND) and union (OR) without allocating high-overhead intermediate sets.",
      learningLoop: {
        bottleneck: "Scanning documents sequentially is O(D * L). An inverted index flips the relationship, allowing immediate O(1) lookup of docs containing a word.",
        whatYouUnderstand: [
          "Tokenizing strings into lowercase alphanumeric tokens.",
          "Building inverted postings: term -> set of doc_ids.",
          "Sorting posting lists ascending by document ID for efficient set operations.",
        ],
        productionParity: "The foundational inverted index structure in Apache Lucene and Elasticsearch.",
        outcomeSummary: "You implement inverted indexing and postings list retrieval.",
      },
      operations: [
        { cmd: "INDEX <doc_id> <words...>", desc: "Tokenizes words into lowercase terms and indexes document. Returns 'INDEXED <doc_id> <term_count>'." },
        { cmd: "DOC_COUNT", desc: "Returns 'DOCS <count>'." },
        { cmd: "POSTINGS <term>", desc: "Returns 'POSTINGS <term> <doc_id1> <doc_id2>...' or 'NOT_FOUND'." },
      ],
      examples: [
        {
          title: "Build Inverted Index",
          input: "INDEX d1 Hello World\nINDEX d2 Hello Systems\nDOC_COUNT\nPOSTINGS hello\nPOSTINGS world",
          output: "INDEXED d1 2\nINDEXED d2 2\nDOCS 2\nPOSTINGS hello d1 d2\nPOSTINGS world d1",
        },
      ],
      constraints: ["Terms are lowercased and stripped of punctuation", "Doc IDs in POSTINGS are sorted alphabetically"],
      cases: [
        {
          name: "Case 1: Multiple Docs Inverted Postings",
          input: "INDEX d1 Hello World\nINDEX d2 Hello Systems\nDOC_COUNT\nPOSTINGS hello\nPOSTINGS world",
          expected: "INDEXED d1 2\nINDEXED d2 2\nDOCS 2\nPOSTINGS hello d1 d2\nPOSTINGS world d1",
        },
        {
          name: "Case 2: Postings for Nonexistent Term",
          input: "INDEX d1 test document\nPOSTINGS missing",
          expected: "INDEXED d1 2\nNOT_FOUND",
        },
        {
          name: "Case 3: Deduplication of Tokens in Single Doc",
          input: "INDEX d1 cat cat cat dog\nPOSTINGS cat",
          expected: "INDEXED d1 2\nPOSTINGS cat d1",
        },
        {
          name: "Case 4: Case Insensitive Normalization",
          input: "INDEX doc1 Redis ENGINE\nPOSTINGS redis\nPOSTINGS engine",
          expected: "INDEXED doc1 2\nPOSTINGS redis doc1\nPOSTINGS engine doc1",
        },
        {
          name: "Case 5: Empty Corpus Postings",
          input: "DOC_COUNT\nPOSTINGS query",
          expected: "DOCS 0\nNOT_FOUND",
        },
      ],
    },
    2: {
      level: 2,
      shortTitle: "Boolean Search (AND/OR)",
      title: "Boolean Query Evaluator",
      difficulty: "Medium",
      tagline: "Execute multi-term boolean queries. Implement sorted postings intersection (AND) and union (OR).",
      whatAreYouBuilding: `You are going to build a Boolean search evaluator. Think of looking at the cookbook index for recipes containing BOTH 'chicken' AND 'garlic'. You find the list of pages for 'chicken', and the list for 'garlic', and you compare them to find the pages that appear in both lists.

For example:
SEARCH_AND distributed systems

Your engine will find the intersection of documents containing both terms and print:
MATCHES d1`,
      howItWorks: `When an AND search runs:
1. Retrieve the sorted postings lists for all terms in the query.
2. If any term has an empty list, immediately stop and return NO_MATCH (short-circuiting).
3. Compare the sorted lists using a 'two-pointer' technique: step through them side-by-side.
4. Keep only the document IDs that are present in every single list.

When an OR search runs:
1. Retrieve all the lists.
2. Combine them together, ensuring no duplicate document IDs are returned.`,
      technicalTerms: [
        {
          "term": "Boolean Query",
          "definition": "A search using logical operators like AND, OR, and NOT to combine multiple keywords."
        },
        {
          "term": "Intersection (AND)",
          "definition": "A mathematical set operation that returns only the items that exist in all the sets being compared."
        },
        {
          "term": "Two-Pointer Merge",
          "definition": "An efficient algorithm that finds matching items in two sorted lists by marching through them side-by-side in a single pass."
        }
],
      description: `Users rarely search for a single word. They type multiple keywords and expect the search engine to find documents containing all of them. 

Because we built our postings lists as alphabetically sorted arrays in Level 1, we don't need to load massive amounts of data into memory to intersect them. We can use a highly optimized two-pointer merge algorithm that scans through the sorted lists simultaneously, finding matches in O(A + B) time without ever allocating intermediate memory sets.`,
      implementationGuide: [
        "On 'SEARCH_AND <t1> <t2>...', fetch the postings lists for every term.",
        "If any term is missing from the dictionary, immediately print 'NO_MATCH'.",
        "Start with the postings list of the first term as your 'current matches'.",
        "For each subsequent term's list, perform an intersection: keep only the doc_ids that exist in both your 'current matches' and the new list.",
        "On 'SEARCH_OR <t1> <t2>...', fetch all postings lists. Combine all doc_ids into a single unique Set.",
        "For both commands, sort the final matching doc_ids alphabetically. If the final list is empty, print 'NO_MATCH', otherwise print 'MATCHES <doc1> <doc2>...'"
],
      diagram: `BOOLEAN QUERY                             INVERTED POSTING LISTS                 SET OPERATION / MATCH
SEARCH_AND distributed systems            ┌──────────────────────────────┐
       │                                  │ distributed: [ d1, d2 ]      │ ──► Two-Pointer Intersect
       ▼                                  │ systems:     [ d1 ]          │     [d1, d2] ∩ [d1]
MATCHES d1                                └──────────────────────────────┘     ──► MATCHES d1
                                          ┌──────────────────────────────┐
SEARCH_OR algorithms design               │ algorithms:  [ d1 ]          │ ──► Sorted Union
       │                                  │ design:      [ d3 ]          │     [d1] ∪ [d3]
       ▼                                  └──────────────────────────────┘     ──► MATCHES d1 d3
MATCHES d1 d3`,
      learningLoop: {
        bottleneck: "Naive set intersection takes high memory. Merging two sorted postings lists using two-pointers runs in O(P1 + P2) time.",
        whatYouUnderstand: [
          "Two-pointer sorted list intersection for AND queries.",
          "Sorted list union for OR queries.",
          "Short-circuiting: If any term in an AND query has 0 postings, the query returns immediately.",
        ],
        productionParity: "Lucene ConjunctionDISI boolean query evaluation.",
        outcomeSummary: "You implement high-speed sorted postings merge algorithms for boolean search.",
      },
      operations: [
        { cmd: "INDEX <doc_id> <words...>", desc: "Indexes document tokens into inverted postings lists (from L1)." },
        { cmd: "SEARCH_AND <t1> <t2>...", desc: "Intersects postings for all terms. Returns 'MATCHES <doc1> <doc2>...' or 'NO_MATCH'." },
        { cmd: "SEARCH_OR <t1> <t2>...", desc: "Unions postings for all terms. Returns 'MATCHES <doc1> <doc2>...' or 'NO_MATCH'." },
      ],
      examples: [
        {
          title: "Boolean AND & OR Search",
          input: "INDEX d1 distributed systems algorithms\nINDEX d2 distributed databases\nINDEX d3 graphic design\nSEARCH_AND distributed systems\nSEARCH_OR algorithms design",
          output: "INDEXED d1 3\nINDEXED d2 2\nINDEXED d3 2\nMATCHES d1\nMATCHES d1 d3",
        },
      ],
      constraints: ["Matches returned in sorted alphabetical doc_id order"],
      cases: [
        {
          name: "Case 1: AND Query Filters Results",
          input: "INDEX d1 distributed systems algorithms\nINDEX d2 distributed databases\nINDEX d3 graphic design\nSEARCH_AND distributed systems\nSEARCH_OR algorithms design",
          expected: "INDEXED d1 3\nINDEXED d2 2\nINDEXED d3 2\nMATCHES d1\nMATCHES d1 d3",
        },
        {
          name: "Case 2: AND Query With Missing Term Fails",
          input: "INDEX d1 apple banana\nINDEX d2 apple cherry\nSEARCH_AND apple date",
          expected: "INDEXED d1 2\nINDEXED d2 2\nNO_MATCH",
        },
        {
          name: "Case 3: Multi-Term Union",
          input: "INDEX d1 a\nINDEX d2 b\nINDEX d3 c\nSEARCH_OR a b c",
          expected: "INDEXED d1 1\nINDEXED d2 1\nINDEXED d3 1\nMATCHES d1 d2 d3",
        },
        {
          name: "Case 4: Single Term Search",
          input: "INDEX d1 rust lang\nINDEX d2 go lang\nSEARCH_AND rust",
          expected: "INDEXED d1 2\nINDEXED d2 2\nMATCHES d1",
        },
        {
          name: "Case 5: Search Nonexistent Terms",
          input: "SEARCH_AND nowhere\nSEARCH_OR nowhere",
          expected: "NO_MATCH\nNO_MATCH",
        },
      ],
    },
    3: {
      level: 3,
      shortTitle: "TF-IDF Relevance Scoring",
      title: "TF-IDF Vector Relevance Ranking",
      difficulty: "Medium",
      tagline: "Score and rank documents by term relevance using Term Frequency and Inverse Document Frequency.",
      whatAreYouBuilding: `You are going to build a TF-IDF relevance scorer. Think of the cookbook again. If you search for 'chicken', a recipe that mentions 'chicken' 10 times is probably a chicken-focused dish, while a recipe mentioning it once is just a side note. Also, finding a rare word like 'saffron' is more significant than finding a common word like 'salt'.

For example:
TFIDF redis

Your engine scores matching documents based on frequency and prints them in ranked order:
RANKED d1:2.81 d2:1.41`,
      howItWorks: `When calculating a score:
1. Count how many times the term appears in the specific document (Term Frequency - TF). Higher is better.
2. Count how many total documents in the entire database contain the term. If it's in a lot of documents, it's a common word, so reduce its value (Inverse Document Frequency - IDF).
3. Multiply TF by IDF to get the final score.
4. Sort all matching documents by this score from highest to lowest.`,
      technicalTerms: [
        {
          "term": "Term Frequency (TF)",
          "definition": "The raw count of how many times a specific keyword appears inside a single document."
        },
        {
          "term": "Inverse Document Frequency (IDF)",
          "definition": "A mathematical penalty applied to very common words (like 'the' or 'and') so they don't overpower rare, meaningful keywords."
        },
        {
          "term": "Relevance Ranking",
          "definition": "Sorting search results mathematically so the most useful documents appear at the very top of the list."
        }
],
      description: `Boolean logic is binary: a document either matches or it doesn't. If a search for 'database' returns 10,000 matches, which one should be shown on page one?

The Vector Space Model solves this using TF-IDF. It assumes that if a term appears frequently in a document (TF), that document is highly relevant. However, to prevent common words from destroying the search results, it mathematically penalizes terms that appear in too many documents across the corpus (IDF). By multiplying these together, highly relevant hits bubble perfectly to the top.`,
      implementationGuide: [
        "You must now track how many times a term appears in each document. Update your index to store TF (count) per term per document.",
        "On 'TFIDF <term>', find all documents containing the term. If none, print 'NO_MATCH'.",
        "Calculate IDF: math.log(total_documents_in_corpus / docs_containing_term) + 1.0.",
        "For each matching document, calculate its score: TF_for_this_doc * IDF.",
        "Sort the matching documents by score (descending). If scores are exactly equal, tie-break by sorting doc_id alphabetically (ascending).",
        "Print 'RANKED ' followed by '<doc_id>:<score>' rounded to exactly 2 decimal places."
],
      diagram: `RELEVANCE QUERY (TF-IDF)                  CORPUS TERM FREQUENCIES                RANKED OUTPUT
TFIDF redis                               ┌──────────────────────────────┐
       │                                  │ N = 3 docs, df(redis) = 2    │
       ▼                                  │ IDF = ln(3/2) + 1.0 = 1.405  │
Calculate: TF(t,d) * IDF                  ├──────────────────────────────┤
  • d1: TF=2 ──► 2 * 1.405 = 2.81         │ d1: "redis redis cache" (TF=2│ ──► RANKED d1:2.81 d2:1.41
  • d2: TF=1 ──► 1 * 1.405 = 1.41         │ d2: "redis database"    (TF=1│     (Sorted by Score Desc,
  • d3: TF=0 ──► (No Match)               │ d3: "postgresql db"     (TF=0│      Tie-break by Doc ID)
                                          └──────────────────────────────┘`,
      learningLoop: {
        bottleneck: "Boolean queries treat all matching documents equally. A document where a term appears 10 times is far more relevant than one where it appears once.",
        whatYouUnderstand: [
          "Term Frequency: TF(t, d) = count(t in d).",
          "Inverse Document Frequency: IDF(t) = log(total_docs / doc_freq(t)) + 1.0.",
          "Score = TF * IDF. Ranking documents by score descending, tie-breaking by doc_id ascending.",
        ],
        productionParity: "The classic vector space model scoring algorithm.",
        outcomeSummary: "You implement document relevance scoring and rank ordering.",
      },
      operations: [
        { cmd: "INDEX <doc_id> <words...>", desc: "Indexes document tokens into inverted postings lists (from L1)." },
        { cmd: "TFIDF <term>", desc: "Ranks matching documents by TF * IDF score. Returns 'RANKED <doc_id>:<score>...' rounded to 2 decimals or 'NO_MATCH'." },
      ],
      examples: [
        {
          title: "TF-IDF Ranking",
          input: "INDEX d1 redis redis cache\nINDEX d2 redis database\nINDEX d3 postgresql database\nTFIDF redis",
          output: "INDEXED d1 2\nINDEXED d2 2\nINDEXED d3 2\nRANKED d1:2.81 d2:1.41",
        },
      ],
      constraints: ["Use natural log for IDF: math.log(N / df) + 1.0", "Format score to 2 decimal places"],
      cases: [
        {
          name: "Case 1: Higher TF Scores Higher",
          input: "INDEX d1 redis redis cache\nINDEX d2 redis database\nINDEX d3 postgresql database\nTFIDF redis",
          expected: "INDEXED d1 2\nINDEXED d2 2\nINDEXED d3 2\nRANKED d1:2.81 d2:1.41",
        },
        {
          name: "Case 2: Rare Term Has Higher Weight",
          input: "INDEX d1 rust memory\nINDEX d2 java memory\nINDEX d3 python memory\nINDEX d4 rust compiler\nTFIDF rust",
          expected: "INDEXED d1 2\nINDEXED d2 2\nINDEXED d3 2\nINDEXED d4 2\nRANKED d1:1.69 d4:1.69",
        },
        {
          name: "Case 3: No Match Returns NO_MATCH",
          input: "INDEX d1 hello world\nTFIDF missing",
          expected: "INDEXED d1 2\nNO_MATCH",
        },
        {
          name: "Case 4: Equal Score Sorted by Doc ID",
          input: "INDEX doc-b search\nINDEX doc-a search\nTFIDF search",
          expected: "INDEXED doc-b 1\nINDEXED doc-a 1\nRANKED doc-a:1.00 doc-b:1.00",
        },
        {
          name: "Case 5: Single Document Corpus",
          input: "INDEX d1 solo\nTFIDF solo",
          expected: "INDEXED d1 1\nRANKED d1:1.00",
        },
      ],
    },
    4: {
      level: 4,
      shortTitle: "Okapi BM25 Ranking",
      title: "Okapi BM25 Probabilistic Ranking",
      difficulty: "Hard",
      tagline: "Implement Okapi BM25 ranking. Apply term frequency saturation (k1=1.2) and document length normalization (b=0.75).",
      whatAreYouBuilding: `You are going to build an Okapi BM25 ranking engine. Think of the cookbook's relevance, but smarter. If a recipe says 'chicken' 100 times, it doesn't mean it's 10 times better than a recipe that says it 10 times. BM25 applies a 'diminishing returns' curve. It also penalizes incredibly long recipes where the word 'chicken' might just be a passing mention buried in a huge block of text.

For example:
BM25 kafka

Your engine uses the BM25 formula to return a highly accurate ranking:
BM25 d2:0.35 d1:0.25`,
      howItWorks: `When calculating a BM25 score:
1. Calculate the BM25-specific IDF (which handles common words even better than standard TF-IDF).
2. Calculate the 'saturation' curve. As Term Frequency goes up, its value flattens out, controlled by a constant called k1.
3. Calculate 'length normalization'. Shorter documents get a slight boost, while massive documents get a penalty, controlled by a constant called b.
4. Combine them into the final BM25 formula and sort the results.`,
      technicalTerms: [
        {
          "term": "BM25",
          "definition": "Best Matching 25. A probabilistic search algorithm that is the industry standard for full-text search relevance."
        },
        {
          "term": "Term Saturation",
          "definition": "The mathematical concept that the 1st mention of a keyword is highly important, but the 100th mention adds almost no extra value."
        },
        {
          "term": "Length Normalization",
          "definition": "Adjusting scores based on document length to prevent massive documents from unfairly winning just by having more total text."
        }
],
      description: `TF-IDF has two fatal flaws. First, it allows 'keyword stuffing': if you repeat a word 1,000 times, your score explodes linearly to the top. Second, it favors long documents, because longer documents simply contain more words.

Okapi BM25 is the modern, production default ranking algorithm used by Elasticsearch and Lucene. It solves keyword stuffing via a non-linear asymptotic saturation curve (k1). It solves the length problem by dynamically penalizing documents that are significantly longer than the average document length in the corpus (b).`,
      implementationGuide: [
        "You must now track the length (total words) of every document you index, and maintain the average document length across the entire corpus.",
        "On 'BM25 <term>', calculate BM25 IDF: math.log(((N - df + 0.5) / (df + 0.5)) + 1.0) where N is total docs and df is docs containing the term.",
        "For each matching document, calculate length normalization: len_norm = 1.0 - 0.75 + 0.75 * (doc_length / average_doc_length).",
        "Calculate final score: IDF * (TF * (1.2 + 1)) / (TF + 1.2 * len_norm).",
        "Sort by score (descending), tie-break by doc_id (ascending). Print 'BM25 ' followed by '<doc_id>:<score>' rounded to 2 decimal places."
],
      diagram: `QUERY (OKAPI BM25)                        SATURATION & LENGTH PENALTY            PROBABILISTIC RANK
BM25 kafka                                ┌──────────────────────────────┐
       │                                  │ Saturation: k1 = 1.2         │
       ▼                                  │ Doc Length Norm: b = 0.75    │
Score Formula:                            ├──────────────────────────────┤
IDF * (TF*(k1+1)) / (TF + k1*len_norm)    │ d2: "kafka kafka kafka"      │ ──► BM25 d2:0.35 d1:0.25
                                          │     len=3, TF=3 (Saturated)  │     (Diminishing returns
                                          │ d1: "kafka streaming msg q"  │      for repeated terms)
                                          │     len=4, TF=1              │
                                          └──────────────────────────────┘`,
      learningLoop: {
        bottleneck: "TF-IDF allows keyword stuffing: repeating 'shoes' 1,000 times inflates score 1,000x. BM25 uses an asymptotic saturation curve so extra mentions yield diminishing returns.",
        whatYouUnderstand: [
          "BM25 IDF: ln((N - n + 0.5) / (n + 0.5) + 1.0).",
          "Length normalization: len_norm = 1.0 - b + b * (doc_len / avg_doc_len).",
          "BM25 term score: IDF * (tf * (k1 + 1)) / (tf + k1 * len_norm).",
        ],
        productionParity: "The modern production default ranking algorithm in Elasticsearch and Lucene.",
        outcomeSummary: "You master modern probabilistic information retrieval ranking.",
      },
      operations: [
        { cmd: "INDEX <doc_id> <words...>", desc: "Indexes document tokens into inverted postings lists (from L1)." },
        { cmd: "BM25 <term>", desc: "Ranks matching documents using BM25 (k1=1.2, b=0.75). Returns 'BM25 <doc_id>:<score>...' rounded to 2 decimals or 'NO_MATCH'." },
      ],
      examples: [
        {
          title: "BM25 Ranking",
          input: "INDEX d1 kafka streaming message queue\nINDEX d2 kafka kafka kafka\nBM25 kafka",
          output: "INDEXED d1 4\nINDEXED d2 1\nBM25 d2:0.35 d1:0.25",
        },
      ],
      constraints: ["k1 = 1.2, b = 0.75", "doc_len is total word tokens in document (including duplicates)"],
      cases: [
        {
          name: "Case 1: BM25 Term Saturation",
          input: "INDEX d1 kafka streaming message queue\nINDEX d2 kafka kafka kafka\nBM25 kafka",
          expected: "INDEXED d1 4\nINDEXED d2 1\nBM25 d2:0.35 d1:0.25",
        },
        {
          name: "Case 2: Short Concise Document Preferred",
          input: "INDEX short query\nINDEX long this is a very long document containing query and other filler words\nBM25 query",
          expected: "INDEXED short 1\nINDEXED long 12\nBM25 short:0.33 long:0.18",
        },
        {
          name: "Case 3: Term Not Present Returns NO_MATCH",
          input: "INDEX d1 test\nBM25 ghost",
          expected: "INDEXED d1 1\nNO_MATCH",
        },
        {
          name: "Case 4: Multi-Doc BM25 Ordering",
          input: "INDEX a1 engine\nINDEX a2 engine engine\nINDEX a3 car vehicle\nBM25 engine",
          expected: "INDEXED a1 1\nINDEXED a2 1\nINDEXED a3 2\nBM25 a2:0.37 a1:0.29",
        },
        {
          name: "Case 5: Equal BM25 Scores Sorted by Doc ID",
          input: "INDEX z apple\nINDEX a apple\nBM25 apple",
          expected: "INDEXED z 1\nINDEXED a 1\nBM25 a:0.29 z:0.29",
        },
      ],
    },
    5: {
      level: 5,
      shortTitle: "Positional Postings (Phrase)",
      title: "Positional Postings & Exact Phrase Search",
      difficulty: "Hard",
      tagline: "Record token position offsets to match exact multi-word phrases (e.g. 'quick brown fox').",
      whatAreYouBuilding: `You are going to build a positional phrase matcher. Think of searching the cookbook for 'fried chicken'. You don't just want a page that mentions 'fried' eggs and grilled 'chicken' somewhere in the same recipe. You need those two words to appear exactly next to each other in that exact sequence.

For example:
PHRASE quick brown fox

Your engine checks exactly where the words appear in the document to ensure they form the exact phrase:
PHRASE_MATCH d1`,
      howItWorks: `When a document is indexed:
1. Instead of just noting THAT a word appears, write down the exact numerical position it appears at (e.g., word 1, word 2, word 3).

When a phrase search runs:
1. Find the documents that contain all the words (Boolean AND).
2. Look at the exact positions of the first word.
3. Verify if the second word appears at exactly the position of the first word + 1.
4. Repeat for all words to ensure a perfect contiguous chain.`,
      technicalTerms: [
        {
          "term": "Positional Indexing",
          "definition": "Storing not just the document ID, but the exact integer offsets of where a keyword appears in the text."
        },
        {
          "term": "Phrase Search",
          "definition": "A query demanding that multiple keywords appear adjacently in a specific exact sequence."
        },
        {
          "term": "Proximity Match",
          "definition": "Evaluating the physical distance between two words inside a document."
        }
],
      description: `Standard inverted indices destroy word order. They view documents as a 'bag of words'. A search for 'president lincoln' will happily return a document reading 'lincoln met the president' because it contains both keywords.

To support exact quote matching, search engines use Positional Postings. By storing the absolute integer offset of every token during ingestion, the query engine can perform sliding-window math to verify that words sit adjacent to each other. This is highly accurate but requires significantly more RAM and disk space.`,
      implementationGuide: [
        "Update your indexing logic to store an array of integer positions for every term in every document. (e.g., term -> doc_id -> [pos1, pos2]).",
        "On 'PHRASE <w1> <w2>...', first perform a standard Boolean AND to get a list of candidate documents.",
        "For each candidate document, get the position arrays for all words in the phrase.",
        "Iterate through every position of the first word. Check if the second word exists at first_pos + 1, the third word at first_pos + 2, etc.",
        "If a perfect contiguous sequence is found, the document is a match.",
        "Sort matches alphabetically and print 'PHRASE_MATCH <doc1> <doc2>...' or 'NO_MATCH'."
],
      diagram: `PHRASE QUERY                              POSITIONAL INDEX (TERM -> OFFSETS)     EXACT PROXIMITY CHECK
PHRASE quick brown fox                    ┌──────────────────────────────────┐
       │                                  │ d1: "the quick brown fox jumps"  │
       ▼                                  │  • quick: pos 1                  │ ──► Consecutive offsets
Check: pos(w_i+1) == pos(w_i) + 1         │  • brown: pos 2 (1 + 1 = 2 ✓)    │     1 -> 2 -> 3
                                          │  • fox:   pos 3 (2 + 1 = 3 ✓)    │     ──► PHRASE_MATCH d1
                                          ├──────────────────────────────────┤
                                          │ d2: "fox brown quick"            │
                                          │  • offsets: 2 -> 1 -> 0 (Reversed│ ──► NO_MATCH (Disordered)
                                          └──────────────────────────────────┘`,
      learningLoop: {
        bottleneck: "Standard inverted indices lose word sequence. A search for 'president lincoln' matches 'lincoln told the president' without positional postings.",
        whatYouUnderstand: [
          "Positional postings: term -> doc_id -> [position_0, position_1, ...].",
          "Sliding phrase matcher: Verify word_(i+1).pos == word_i.pos + 1 in the same document.",
          "Preserving document token order.",
        ],
        productionParity: "Lucene PhraseQuery and proximity searching.",
        outcomeSummary: "You implement positional postings and exact phrase verification.",
      },
      operations: [
        { cmd: "INDEX <doc_id> <words...>", desc: "Indexes document tokens into inverted postings lists (from L1)." },
        { cmd: "PHRASE <w1> <w2>...", desc: "Matches exact sequential phrase. Returns 'PHRASE_MATCH <doc1> <doc2>...' or 'NO_MATCH'." },
      ],
      examples: [
        {
          title: "Exact Phrase Match",
          input: "INDEX d1 the quick brown fox jumps\nINDEX d2 fox brown quick\nPHRASE quick brown fox\nPHRASE brown fox",
          output: "INDEXED d1 5\nINDEXED d2 3\nPHRASE_MATCH d1\nPHRASE_MATCH d1",
        },
      ],
      constraints: ["All words in the phrase must appear consecutively in exact order"],
      cases: [
        {
          name: "Case 1: Consecutive Word Match",
          input: "INDEX d1 the quick brown fox jumps\nINDEX d2 fox brown quick\nPHRASE quick brown fox\nPHRASE brown fox",
          expected: "INDEXED d1 5\nINDEXED d2 3\nPHRASE_MATCH d1\nPHRASE_MATCH d1",
        },
        {
          name: "Case 2: Reversed Words Do Not Match Phrase",
          input: "INDEX d1 search engine\nINDEX d2 engine search\nPHRASE search engine",
          expected: "INDEXED d1 2\nINDEXED d2 2\nPHRASE_MATCH d1",
        },
        {
          name: "Case 3: Intervening Word Breaks Phrase",
          input: "INDEX d1 high performance caching\nINDEX d2 high and performance caching\nPHRASE high performance",
          expected: "INDEXED d1 3\nINDEXED d2 4\nPHRASE_MATCH d1",
        },
        {
          name: "Case 4: Single Word Phrase",
          input: "INDEX d1 hello world\nPHRASE hello",
          expected: "INDEXED d1 2\nPHRASE_MATCH d1",
        },
        {
          name: "Case 5: Multi-Doc Phrase Matches",
          input: "INDEX d1 cloud native\nINDEX d2 cloud native systems\nINDEX d3 native cloud\nPHRASE cloud native",
          expected: "INDEXED d1 2\nINDEXED d2 3\nINDEXED d3 2\nPHRASE_MATCH d1 d2",
        },
      ],
    },
    6: {
      level: 6,
      shortTitle: "Segment Merging & Compaction",
      title: "Immutable Segment Commits & Compaction",
      difficulty: "Hard",
      tagline: "Write incoming documents to immutable segments. Commit and merge segments into a single consolidated index.",
      whatAreYouBuilding: `You are going to build a segment compaction system. Think of writing a new cookbook index. Instead of erasing and re-writing the massive master index every time you add a single new recipe, you write small, temporary 'mini-indexes' (segments) in a notebook. Later, you do a batch job to merge all the mini-indexes into the master index to save lookup time.

For example:
COMMIT_SEGMENT
MERGE_SEGMENTS

Your engine freezes the current index into a segment, and then merges them all together:
COMMITTED seg-1
MERGED 2 -> 1`,
      howItWorks: `When writing data:
1. Index documents normally in memory.
2. When a COMMIT occurs, freeze that memory into an immutable 'segment' and start a fresh memory index.
3. When searching, you must now run the search against EVERY active segment and combine the results.

When merging (compacting):
1. Take all the multiple immutable segments.
2. Stitch their postings lists together into one single massive, highly optimized segment.
3. Delete the old fragmented segments.`,
      technicalTerms: [
        {
          "term": "Immutable Segment",
          "definition": "A chunk of the search index that, once written, is never modified or updated again."
        },
        {
          "term": "LSM Tree",
          "definition": "Log-Structured Merge-Tree. A database architecture that writes data sequentially to small files, merging them later in the background."
        },
        {
          "term": "Compaction",
          "definition": "The background process of combining multiple small index segments into one large segment to speed up search times."
        }
],
      description: `Updating a live search index in real-time is extremely slow because it requires acquiring locks on massive data structures, blocking incoming read queries. 

Modern search engines (like Elasticsearch) use an LSM-style architecture. They write incoming documents to small, append-only, immutable 'segments' in memory. Searches scatter-gather across all segments. Because having thousands of segments slows down searching, a background 'compaction' process merges these mini-segments into massive, highly optimized master segments, enabling blazing fast reads and writes simultaneously.`,
      implementationGuide: [
        "Maintain a list of completed 'segments' (dictionaries) and one active memory buffer segment.",
        "On 'INDEX', write the document only to the active memory buffer.",
        "On 'COMMIT_SEGMENT', freeze the active memory buffer, append it to your segments list, and give it an ID like 'seg-1'. Create a fresh memory buffer. Print 'COMMITTED <seg_id>'.",
        "On 'MERGE_SEGMENTS', combine the dictionaries of all frozen segments into a single new segment dictionary. Replace the old list with this single merged segment. Print 'MERGED <old_count> -> 1'.",
        "Update 'SEARCH_AND' logic so it queries ALL frozen segments plus the active buffer, combining the results seamlessly.",
        "On 'SEGMENT_STATS', print 'SEGMENTS <frozen_segment_count> TOTAL_DOCS <count_across_all_segments>'"
],
      diagram: `INGEST & COMMIT                           LSM SEGMENT ARCHITECTURE               CONSOLIDATED INDEX
INDEX d1 ... ──► COMMIT_SEGMENT ──► seg-1 ┌──────────────────────────────┐
INDEX d2 ... ──► COMMIT_SEGMENT ──► seg-2 │ seg-1: [d1: "hello world"]   │ ──► Active Segments: 2
                                          │ seg-2: [d2: "hello systems"] │     Search queries fan-out
MERGE_SEGMENTS                            └──────────────┬───────────────┘
       │                                                 │
       ▼                                                 ▼
Consolidate Postings Lists ──────────────────────────────┴──────────────► seg-merged (1 Segment)
                                                                          Total Docs: 2
                                                                          MERGED 2 -> 1`,
      learningLoop: {
        bottleneck: "Modifying a live inverted index requires locking the entire database. Writing append-only mini-segments and merging in the background gives 100x write throughput.",
        whatYouUnderstand: [
          "Segment architecture: Each commit freezes the current memory index as an immutable segment.",
          "Searching across all active segments seamlessly.",
          "Compacting / merging multiple segments into one consolidated segment.",
        ],
        productionParity: "Lucene SegmentInfos, TieredMergePolicy, and Elasticsearch _forcemerge.",
        outcomeSummary: "You master LSM-style segment architecture and background index compaction.",
      },
      operations: [
        { cmd: "INDEX <doc_id> <words...>", desc: "Indexes document tokens into inverted postings lists (from L1)." },
        { cmd: "COMMIT_SEGMENT", desc: "Freezes current buffer into an immutable segment. Returns 'COMMITTED <segment_id>'." },
        { cmd: "MERGE_SEGMENTS", desc: "Merges all segments into 1 consolidated segment. Returns 'MERGED <old_count> -> 1'." },
        { cmd: "SEGMENT_STATS", desc: "Returns 'SEGMENTS <count> TOTAL_DOCS <count>'." },
        { cmd: "SEARCH_AND <t1> <t2>...", desc: "Queries terms across all immutable segments and active buffer (from L2)." },
        { cmd: "SEARCH_OR <t1> <t2>...", desc: "Unions terms across all immutable segments and active buffer (from L2)." },
      ],
      examples: [
        {
          title: "Commit and Merge Segments",
          input: "INDEX d1 hello world\nCOMMIT_SEGMENT\nINDEX d2 hello systems\nCOMMIT_SEGMENT\nSEGMENT_STATS\nMERGE_SEGMENTS\nSEGMENT_STATS\nSEARCH_AND hello",
          output: "INDEXED d1 2\nCOMMITTED seg-1\nINDEXED d2 2\nCOMMITTED seg-2\nSEGMENTS 2 TOTAL_DOCS 2\nMERGED 2 -> 1\nSEGMENTS 1 TOTAL_DOCS 2\nMATCHES d1 d2",
        },
      ],
      constraints: ["Segments are numbered sequentially: seg-1, seg-2, etc."],
      cases: [
        {
          name: "Case 1: Commit and Search Across Segments",
          input: "INDEX d1 hello world\nCOMMIT_SEGMENT\nINDEX d2 hello systems\nCOMMIT_SEGMENT\nSEGMENT_STATS\nMERGE_SEGMENTS\nSEGMENT_STATS\nSEARCH_AND hello",
          expected: "INDEXED d1 2\nCOMMITTED seg-1\nINDEXED d2 2\nCOMMITTED seg-2\nSEGMENTS 2 TOTAL_DOCS 2\nMERGED 2 -> 1\nSEGMENTS 1 TOTAL_DOCS 2\nMATCHES d1 d2",
        },
        {
          name: "Case 2: Merge Single Segment Is No-Op",
          input: "INDEX d1 test\nCOMMIT_SEGMENT\nMERGE_SEGMENTS",
          expected: "INDEXED d1 1\nCOMMITTED seg-1\nMERGED 1 -> 1",
        },
        {
          name: "Case 3: Uncommitted Docs Included in Stats",
          input: "INDEX d1 item\nSEGMENT_STATS",
          expected: "INDEXED d1 1\nSEGMENTS 0 TOTAL_DOCS 1",
        },
        {
          name: "Case 4: Merge With Multiple Commits",
          input: "INDEX d1 a\nCOMMIT_SEGMENT\nINDEX d2 b\nCOMMIT_SEGMENT\nINDEX d3 c\nCOMMIT_SEGMENT\nMERGE_SEGMENTS\nSEGMENT_STATS",
          expected: "INDEXED d1 1\nCOMMITTED seg-1\nINDEXED d2 1\nCOMMITTED seg-2\nINDEXED d3 1\nCOMMITTED seg-3\nMERGED 3 -> 1\nSEGMENTS 1 TOTAL_DOCS 3",
        },
        {
          name: "Case 5: Search After Merge Preserves Match",
          input: "INDEX d1 fast search\nCOMMIT_SEGMENT\nINDEX d2 slow search\nCOMMIT_SEGMENT\nMERGE_SEGMENTS\nSEARCH_OR fast slow",
          expected: "INDEXED d1 2\nCOMMITTED seg-1\nINDEXED d2 2\nCOMMITTED seg-2\nMERGED 2 -> 1\nMATCHES d1 d2",
        },
      ],
    },
  },
  starterTemplates: {
    python: `"""
Search Engine - Challenge 10 Starter (Python 3.12)
Implements inverted index, boolean AND/OR, TF-IDF, Okapi BM25,
positional phrase search, and segment compaction.
"""
import sys
import math
import re

def tokenize(text: str):
    words = re.findall(r'[a-zA-Z0-9]+', text.lower())
    return words

class SearchEngine:
    def __init__(self):
        # Current active buffer:
        # doc_id -> list of raw words (with duplicates)
        self.doc_tokens = {}
        # term -> set of doc_ids
        self.postings = {}
        # term -> doc_id -> list of positions
        self.positions = {}

        # Segments
        self.committed_segments = []  # list of dicts: {"docs": set, "tokens": dict, "postings": dict, "positions": dict}
        self.segment_counter = 0

    def index_doc(self, doc_id: str, words: list) -> str:
        tokens = [w.lower() for w in words]
        self.doc_tokens[doc_id] = tokens
        seen_terms = set()
        for idx, t in enumerate(tokens):
            if t not in self.postings:
                self.postings[t] = set()
                self.positions[t] = {}
            self.postings[t].add(doc_id)
            if doc_id not in self.positions[t]:
                self.positions[t][doc_id] = []
            self.positions[t][doc_id].append(idx)
            seen_terms.add(t)
        return f"INDEXED {doc_id} {len(seen_terms)}"

    def doc_count(self) -> str:
        total_docs = len(self._all_doc_tokens())
        return f"DOCS {total_docs}"

    def postings_cmd(self, term: str) -> str:
        term = term.lower()
        docs = self._get_term_docs(term)
        if not docs:
            return "NOT_FOUND"
        sorted_docs = sorted(docs)
        return f"POSTINGS {term} " + " ".join(sorted_docs)

    def _all_doc_tokens(self):
        combined = {}
        for seg in self.committed_segments:
            combined.update(seg["tokens"])
        combined.update(self.doc_tokens)
        return combined

    def _get_term_docs(self, term: str) -> set:
        res = set()
        for seg in self.committed_segments:
            if term in seg["postings"]:
                res.update(seg["postings"][term])
        if term in self.postings:
            res.update(self.postings[term])
        return res

    def _get_term_positions(self, term: str) -> dict:
        combined = {}
        for seg in self.committed_segments:
            if term in seg["positions"]:
                for doc, pos_list in seg["positions"][term].items():
                    combined[doc] = pos_list
        if term in self.positions:
            for doc, pos_list in self.positions[term].items():
                combined[doc] = pos_list
        return combined

    def search_and(self, terms: list) -> str:
        if not terms:
            return "NO_MATCH"
        terms = [t.lower() for t in terms]
        matching = None
        for t in terms:
            docs = self._get_term_docs(t)
            if not docs:
                return "NO_MATCH"
            if matching is None:
                matching = set(docs)
            else:
                matching.intersection_update(docs)
                if not matching:
                    return "NO_MATCH"
        if not matching:
            return "NO_MATCH"
        return "MATCHES " + " ".join(sorted(matching))

    def search_or(self, terms: list) -> str:
        if not terms:
            return "NO_MATCH"
        terms = [t.lower() for t in terms]
        matching = set()
        for t in terms:
            docs = self._get_term_docs(t)
            matching.update(docs)
        if not matching:
            return "NO_MATCH"
        return "MATCHES " + " ".join(sorted(matching))

    def tfidf(self, term: str) -> str:
        term = term.lower()
        all_docs = self._all_doc_tokens()
        total_n = len(all_docs)
        if total_n == 0:
            return "NO_MATCH"

        matching_docs = self._get_term_docs(term)
        if not matching_docs:
            return "NO_MATCH"

        df = len(matching_docs)
        idf = math.log(total_n / float(df)) + 1.0

        scores = []
        for doc in matching_docs:
            tokens = all_docs[doc]
            tf = tokens.count(term)
            score = tf * idf
            scores.append((doc, score))

        # Sort descending by score, tie-break ascending by doc_id
        scores.sort(key=lambda item: (-round(item[1], 4), item[0]))
        parts = [f"{doc}:{score:.2f}" for doc, score in scores]
        return "RANKED " + " ".join(parts)

    def bm25(self, term: str) -> str:
        term = term.lower()
        all_docs = self._all_doc_tokens()
        total_n = len(all_docs)
        if total_n == 0:
            return "NO_MATCH"

        matching_docs = self._get_term_docs(term)
        if not matching_docs:
            return "NO_MATCH"

        df = len(matching_docs)
        idf = math.log((total_n - df + 0.5) / (df + 0.5) + 1.0)
        avg_doc_len = sum(len(toks) for toks in all_docs.values()) / float(total_n)

        k1 = 1.2
        b = 0.75

        scores = []
        for doc in matching_docs:
            tokens = all_docs[doc]
            doc_len = len(tokens)
            tf = tokens.count(term)
            len_norm = 1.0 - b + b * (doc_len / avg_doc_len)
            term_score = idf * (tf * (k1 + 1.0)) / (tf + k1 * len_norm)
            scores.append((doc, term_score))

        scores.sort(key=lambda item: (-round(item[1], 4), item[0]))
        parts = [f"{doc}:{score:.2f}" for doc, score in scores]
        return "BM25 " + " ".join(parts)

    def phrase(self, terms: list) -> str:
        if not terms:
            return "NO_MATCH"
        terms = [t.lower() for t in terms]
        first_term = terms[0]
        pos_maps = [self._get_term_positions(t) for t in terms]

        # Candidates must contain all terms
        candidates = set(pos_maps[0].keys())
        for pm in pos_maps[1:]:
            candidates.intersection_update(pm.keys())

        matched_docs = []
        for doc in sorted(candidates):
            p0_list = pos_maps[0][doc]
            # Check if any starting pos can continue sequentially
            found = False
            for start_p in p0_list:
                seq_ok = True
                for offset in range(1, len(terms)):
                    expected_p = start_p + offset
                    if expected_p not in pos_maps[offset][doc]:
                        seq_ok = False
                        break
                if seq_ok:
                    found = True
                    break
            if found:
                matched_docs.append(doc)

        if not matched_docs:
            return "NO_MATCH"
        return "PHRASE_MATCH " + " ".join(matched_docs)

    def commit_segment(self) -> str:
        self.segment_counter += 1
        seg_id = f"seg-{self.segment_counter}"
        self.committed_segments.append({
            "id": seg_id,
            "docs": set(self.doc_tokens.keys()),
            "tokens": dict(self.doc_tokens),
            "postings": {t: set(d) for t, d in self.postings.items()},
            "positions": {t: {d: list(p) for d, p in dm.items()} for t, dm in self.positions.items()},
        })
        self.doc_tokens.clear()
        self.postings.clear()
        self.positions.clear()
        return f"COMMITTED {seg_id}"

    def merge_segments(self) -> str:
        old_count = len(self.committed_segments)
        if old_count <= 1:
            return f"MERGED {max(1, old_count)} -> 1"

        merged_tokens = {}
        merged_postings = {}
        merged_positions = {}
        merged_docs = set()

        for seg in self.committed_segments:
            merged_docs.update(seg["docs"])
            merged_tokens.update(seg["tokens"])
            for t, dset in seg["postings"].items():
                if t not in merged_postings:
                    merged_postings[t] = set()
                merged_postings[t].update(dset)
            for t, dm in seg["positions"].items():
                if t not in merged_positions:
                    merged_positions[t] = {}
                for d, plist in dm.items():
                    merged_positions[t][d] = plist

        self.committed_segments = [{
            "id": "seg-1",
            "docs": merged_docs,
            "tokens": merged_tokens,
            "postings": merged_postings,
            "positions": merged_positions,
        }]
        return f"MERGED {old_count} -> 1"

    def segment_stats(self) -> str:
        count = len(self.committed_segments)
        all_docs = self._all_doc_tokens()
        return f"SEGMENTS {count} TOTAL_DOCS {len(all_docs)}"

def main():
    engine = SearchEngine()
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        parts = line.split()
        cmd = parts[0].upper()

        if cmd == "INDEX":
            print(engine.index_doc(parts[1], parts[2:]))
        elif cmd == "DOC_COUNT":
            print(engine.doc_count())
        elif cmd == "POSTINGS":
            print(engine.postings_cmd(parts[1]))
        elif cmd == "SEARCH_AND":
            print(engine.search_and(parts[1:]))
        elif cmd == "SEARCH_OR":
            print(engine.search_or(parts[1:]))
        elif cmd == "TFIDF":
            print(engine.tfidf(parts[1]))
        elif cmd == "BM25":
            print(engine.bm25(parts[1]))
        elif cmd == "PHRASE":
            print(engine.phrase(parts[1:]))
        elif cmd == "COMMIT_SEGMENT":
            print(engine.commit_segment())
        elif cmd == "MERGE_SEGMENTS":
            print(engine.merge_segments())
        elif cmd == "SEGMENT_STATS":
            print(engine.segment_stats())
        else:
            print("UNKNOWN_COMMAND")

if __name__ == "__main__":
    main()
`,
    cpp: `// Search Engine - Challenge 10 Starter (C++ 20)
#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <set>
#include <algorithm>
#include <sstream>
#include <cmath>
#include <iomanip>

struct Segment {
    std::string id;
    std::unordered_map<std::string, std::vector<std::string>> doc_tokens;
    std::unordered_map<std::string, std::set<std::string>> postings;
    std::unordered_map<std::string, std::unordered_map<std::string, std::vector<int>>> positions;
};

class SearchEngine {
    std::unordered_map<std::string, std::vector<std::string>> doc_tokens;
    std::unordered_map<std::string, std::set<std::string>> postings;
    std::unordered_map<std::string, std::unordered_map<std::string, std::vector<int>>> positions;

    std::vector<Segment> committed_segments;
    int segment_counter = 0;

    std::string to_lower(std::string s) {
        for (char& c : s) c = std::tolower(c);
        return s;
    }

public:
    std::string index_doc(const std::string& doc_id, const std::vector<std::string>& words) {
        std::vector<std::string> tokens;
        std::set<std::string> seen;
        for (size_t i = 0; i < words.size(); i++) {
            std::string t = to_lower(words[i]);
            tokens.push_back(t);
            postings[t].insert(doc_id);
            positions[t][doc_id].push_back((int)i);
            seen.insert(t);
        }
        doc_tokens[doc_id] = tokens;
        return "INDEXED " + doc_id + " " + std::to_string(seen.size());
    }

    std::unordered_map<std::string, std::vector<std::string>> get_all_doc_tokens() {
        std::unordered_map<std::string, std::vector<std::string>> combined;
        for (const auto& seg : committed_segments) {
            for (const auto& pair : seg.doc_tokens) combined[pair.first] = pair.second;
        }
        for (const auto& pair : doc_tokens) combined[pair.first] = pair.second;
        return combined;
    }

    std::set<std::string> get_term_docs(const std::string& term) {
        std::set<std::string> res;
        for (const auto& seg : committed_segments) {
            auto it = seg.postings.find(term);
            if (it != seg.postings.end()) {
                res.insert(it->second.begin(), it->second.end());
            }
        }
        auto it = postings.find(term);
        if (it != postings.end()) {
            res.insert(it->second.begin(), it->second.end());
        }
        return res;
    }

    std::unordered_map<std::string, std::vector<int>> get_term_positions(const std::string& term) {
        std::unordered_map<std::string, std::vector<int>> res;
        for (const auto& seg : committed_segments) {
            auto it = seg.positions.find(term);
            if (it != seg.positions.end()) {
                for (const auto& pair : it->second) res[pair.first] = pair.second;
            }
        }
        auto it = positions.find(term);
        if (it != positions.end()) {
            for (const auto& pair : it->second) res[pair.first] = pair.second;
        }
        return res;
    }

    std::string doc_count() {
        return "DOCS " + std::to_string(get_all_doc_tokens().size());
    }

    std::string postings_cmd(std::string term) {
        term = to_lower(term);
        auto docs = get_term_docs(term);
        if (docs.empty()) return "NOT_FOUND";
        std::string res = "POSTINGS " + term;
        for (const auto& d : docs) res += " " + d;
        return res;
    }

    std::string search_and(const std::vector<std::string>& raw_terms) {
        if (raw_terms.empty()) return "NO_MATCH";
        std::set<std::string> matching;
        bool first = true;
        for (auto t : raw_terms) {
            t = to_lower(t);
            auto docs = get_term_docs(t);
            if (docs.empty()) return "NO_MATCH";
            if (first) {
                matching = docs;
                first = false;
            } else {
                std::set<std::string> inter;
                std::set_intersection(matching.begin(), matching.end(), docs.begin(), docs.end(),
                                      std::inserter(inter, inter.begin()));
                matching = inter;
                if (matching.empty()) return "NO_MATCH";
            }
        }
        if (matching.empty()) return "NO_MATCH";
        std::string res = "MATCHES";
        for (const auto& d : matching) res += " " + d;
        return res;
    }

    std::string search_or(const std::vector<std::string>& raw_terms) {
        if (raw_terms.empty()) return "NO_MATCH";
        std::set<std::string> matching;
        for (auto t : raw_terms) {
            t = to_lower(t);
            auto docs = get_term_docs(t);
            matching.insert(docs.begin(), docs.end());
        }
        if (matching.empty()) return "NO_MATCH";
        std::string res = "MATCHES";
        for (const auto& d : matching) res += " " + d;
        return res;
    }

    std::string tfidf(std::string term) {
        term = to_lower(term);
        auto all_docs = get_all_doc_tokens();
        int total_n = (int)all_docs.size();
        if (total_n == 0) return "NO_MATCH";

        auto matching = get_term_docs(term);
        if (matching.empty()) return "NO_MATCH";

        int df = (int)matching.size();
        double idf = std::log((double)total_n / df) + 1.0;

        std::vector<std::pair<std::string, double>> scores;
        for (const auto& d : matching) {
            const auto& toks = all_docs[d];
            int tf = 0;
            for (const auto& t : toks) if (t == term) tf++;
            scores.push_back({d, tf * idf});
        }

        std::sort(scores.begin(), scores.end(), [](const std::pair<std::string, double>& a, const std::pair<std::string, double>& b) {
            double diff = a.second - b.second;
            if (std::abs(diff) > 1e-5) return a.second > b.second;
            return a.first < b.first;
        });

        std::ostringstream oss;
        oss << "RANKED";
        for (const auto& pair : scores) {
            oss << " " << pair.first << ":" << std::fixed << std::setprecision(2) << pair.second;
        }
        return oss.str();
    }

    std::string bm25(std::string term) {
        term = to_lower(term);
        auto all_docs = get_all_doc_tokens();
        int total_n = (int)all_docs.size();
        if (total_n == 0) return "NO_MATCH";

        auto matching = get_term_docs(term);
        if (matching.empty()) return "NO_MATCH";

        int df = (int)matching.size();
        double idf = std::log((total_n - df + 0.5) / (df + 0.5) + 1.0);

        double total_words = 0;
        for (const auto& pair : all_docs) total_words += pair.second.size();
        double avg_doc_len = total_words / total_n;

        double k1 = 1.2;
        double b = 0.75;

        std::vector<std::pair<std::string, double>> scores;
        for (const auto& d : matching) {
            const auto& toks = all_docs[d];
            int tf = 0;
            for (const auto& t : toks) if (t == term) tf++;
            double doc_len = (double)toks.size();
            double len_norm = 1.0 - b + b * (doc_len / avg_doc_len);
            double score = idf * (tf * (k1 + 1.0)) / (tf + k1 * len_norm);
            scores.push_back({d, score});
        }

        std::sort(scores.begin(), scores.end(), [](const std::pair<std::string, double>& a, const std::pair<std::string, double>& b) {
            double diff = a.second - b.second;
            if (std::abs(diff) > 1e-5) return a.second > b.second;
            return a.first < b.first;
        });

        std::ostringstream oss;
        oss << "BM25";
        for (const auto& pair : scores) {
            oss << " " << pair.first << ":" << std::fixed << std::setprecision(2) << pair.second;
        }
        return oss.str();
    }

    std::string phrase(const std::vector<std::string>& raw_terms) {
        if (raw_terms.empty()) return "NO_MATCH";
        std::vector<std::string> terms;
        for (const auto& t : raw_terms) terms.push_back(to_lower(t));

        std::vector<std::unordered_map<std::string, std::vector<int>>> pos_maps;
        for (const auto& t : terms) pos_maps.push_back(get_term_positions(t));

        std::set<std::string> candidates;
        for (const auto& pair : pos_maps[0]) candidates.insert(pair.first);
        for (size_t i = 1; i < pos_maps.size(); i++) {
            std::set<std::string> next_cands;
            for (const auto& pair : pos_maps[i]) {
                if (candidates.find(pair.first) != candidates.end()) next_cands.insert(pair.first);
            }
            candidates = next_cands;
        }

        std::vector<std::string> matched;
        for (const auto& doc : candidates) {
            const auto& p0_list = pos_maps[0][doc];
            bool found = false;
            for (int start_p : p0_list) {
                bool seq_ok = true;
                for (size_t offset = 1; offset < terms.size(); offset++) {
                    int expected = start_p + (int)offset;
                    const auto& plist = pos_maps[offset][doc];
                    if (std::find(plist.begin(), plist.end(), expected) == plist.end()) {
                        seq_ok = false;
                        break;
                    }
                }
                if (seq_ok) {
                    found = true;
                    break;
                }
            }
            if (found) matched.push_back(doc);
        }

        if (matched.empty()) return "NO_MATCH";
        std::string res = "PHRASE_MATCH";
        for (const auto& d : matched) res += " " + d;
        return res;
    }

    std::string commit_segment() {
        segment_counter++;
        std::string seg_id = "seg-" + std::to_string(segment_counter);
        committed_segments.push_back(Segment{seg_id, doc_tokens, postings, positions});
        doc_tokens.clear();
        postings.clear();
        positions.clear();
        return "COMMITTED " + seg_id;
    }

    std::string merge_segments() {
        int old_count = (int)committed_segments.size();
        if (old_count <= 1) return "MERGED " + std::to_string(std::max(1, old_count)) + " -> 1";

        std::unordered_map<std::string, std::vector<std::string>> m_tokens;
        std::unordered_map<std::string, std::set<std::string>> m_postings;
        std::unordered_map<std::string, std::unordered_map<std::string, std::vector<int>>> m_positions;

        for (const auto& seg : committed_segments) {
            for (const auto& pair : seg.doc_tokens) m_tokens[pair.first] = pair.second;
            for (const auto& pair : seg.postings) {
                m_postings[pair.first].insert(pair.second.begin(), pair.second.end());
            }
            for (const auto& pair : seg.positions) {
                for (const auto& p2 : pair.second) m_positions[pair.first][p2.first] = p2.second;
            }
        }

        committed_segments.clear();
        committed_segments.push_back(Segment{"seg-1", m_tokens, m_postings, m_positions});
        return "MERGED " + std::to_string(old_count) + " -> 1";
    }

    std::string segment_stats() {
        int count = (int)committed_segments.size();
        int total_docs = (int)get_all_doc_tokens().size();
        return "SEGMENTS " + std::to_string(count) + " TOTAL_DOCS " + std::to_string(total_docs);
    }
};

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    SearchEngine engine;
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::istringstream iss(line);
        std::string cmd;
        iss >> cmd;

        if (cmd == "INDEX") {
            std::string id; iss >> id;
            std::vector<std::string> words;
            std::string w;
            while (iss >> w) words.push_back(w);
            std::cout << engine.index_doc(id, words) << "\\n";
        } else if (cmd == "DOC_COUNT") {
            std::cout << engine.doc_count() << "\\n";
        } else if (cmd == "POSTINGS") {
            std::string term; iss >> term;
            std::cout << engine.postings_cmd(term) << "\\n";
        } else if (cmd == "SEARCH_AND") {
            std::vector<std::string> terms;
            std::string t;
            while (iss >> t) terms.push_back(t);
            std::cout << engine.search_and(terms) << "\\n";
        } else if (cmd == "SEARCH_OR") {
            std::vector<std::string> terms;
            std::string t;
            while (iss >> t) terms.push_back(t);
            std::cout << engine.search_or(terms) << "\\n";
        } else if (cmd == "TFIDF") {
            std::string term; iss >> term;
            std::cout << engine.tfidf(term) << "\\n";
        } else if (cmd == "BM25") {
            std::string term; iss >> term;
            std::cout << engine.bm25(term) << "\\n";
        } else if (cmd == "PHRASE") {
            std::vector<std::string> terms;
            std::string t;
            while (iss >> t) terms.push_back(t);
            std::cout << engine.phrase(terms) << "\\n";
        } else if (cmd == "COMMIT_SEGMENT") {
            std::cout << engine.commit_segment() << "\\n";
        } else if (cmd == "MERGE_SEGMENTS") {
            std::cout << engine.merge_segments() << "\\n";
        } else if (cmd == "SEGMENT_STATS") {
            std::cout << engine.segment_stats() << "\\n";
        }
    }
    return 0;
}
`,
  },
};
