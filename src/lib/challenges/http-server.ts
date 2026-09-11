// src/lib/challenges/http-server.ts
import { ChallengeData } from "./types";

export const httpServerChallenge: ChallengeData = {
  slug: "http-server",
  number: "02",
  title: "High-Concurrency HTTP Server",
  subtitle: "From raw byte stream parsing to an RFC-compliant, keep-alive, high-concurrency web server.",
  badge: "SYSTEMS ENGINEERING CAPSTONE",
  domain: "CORE_SYSTEMS",
  inspiredBy: "Nginx, Envoy",
  whatStudentsBuild: "Non-blocking HTTP/1.1 web server",
  mainSkill: "Networking, I/O, concurrency",
  signatureQuestion: "How many requests can your server handle?",
  overview:
    "In this engineering challenge, you construct a high-throughput HTTP/1.1 request parser and router from first principles. Rather than opening network sockets, your server processes a stream of requests over standard input (stdin) and writes responses to standard output (stdout). You will build the raw byte tokenizer, status line parser, radix trie router, header parser, and keep-alive session coordinator.",
  whyItMatters:
    "Every web framework is an abstraction over raw TCP streams and HTTP protocol specifications. By building the parser and dispatcher by hand, you master socket byte buffers, Content-Length framing, connection pooling, and how servers handle thousands of concurrent requests.",
  finalOutcome:
    "Upon completing all 6 levels, you have constructed a production-grade HTTP/1.1 server capable of parsing 50,000+ requests/sec, pipelining persistent keep-alive connections, routing parameterized paths, and handling request bursts with sub-millisecond latency.",
  philosophy: "Encounter real networking engineering problems: RFC 7230 stream framing, radix trie routing, persistent keep-alive pools, and non-blocking I/O event loops.",
  architectureDiagram: `                  RAW TCP BYTE STREAM
                           │
             ┌─────────────┴─────────────┐
             │                           │
          Framing                     Routing
             │                           │
   RFC 7230 Tokenizer             Radix Path Trie
             │                           │
             └─────────────┬─────────────┘
                           │
                 Socket Connection Pool
                           │
                 ┌─────────┴─────────┐
                 │                   │
               Client             Response
           "GET /users/42"      "200 OK\\r\\n"`,
  levelRoadmap: [
    { level: 1, whatWeBuild: "Request line tokenizer & 200 OK", mainConcept: "RFC 7230 wire protocol, zero-copy method & URI parsing" },
    { level: 2, whatWeBuild: "Trie-based parameterized router", mainConcept: "Radix trie prefix traversal, O(path length) routing, :param extraction" },
    { level: 3, whatWeBuild: "RFC 7230 header subsystem", mainConcept: "Case-insensitive header map, Content-Type, Accept & MIME negotiation" },
    { level: 4, whatWeBuild: "Body framing & chunked transfer", mainConcept: "Content-Length byte streaming vs chunked transfer encoding" },
    { level: 5, whatWeBuild: "Keep-alive session coordinator", mainConcept: "TCP connection reuse, pipelining, and timeout management" },
    { level: 6, whatWeBuild: "Non-blocking event loop dispatcher", mainConcept: "epoll/kqueue multiplexing, C10K concurrency, >50,000 req/s" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Request Line Tokenizer",
      focus: "Zero-Copy Method & Path Parser",
      description: "Parses verbs (GET, POST, HEAD) and request URI directly from raw socket streams.",
      realWorldTech: "Node.js llhttp, Nginx ngx_http_parse.c",
    },
    {
      number: 2,
      name: "Trie-Based Path Router",
      focus: "Prefix Matching & Dynamic Parameters",
      description: "Dispatches incoming paths to handlers using radix trie traversal in O(path_length) time.",
      realWorldTech: "Go chi router, Rust axum routing trie",
    },
    {
      number: 3,
      name: "Header & MIME Subsystem",
      focus: "RFC 7230 Header Extraction",
      description: "Normalizes header keys case-insensitively and parses Content-Type and Accept headers.",
      realWorldTech: "Nginx header filter, Envoy header map",
    },
    {
      number: 4,
      name: "Framing & Body Engine",
      focus: "Content-Length & Chunked Transfer",
      description: "Buffers exact byte payloads based on Content-Length to prevent framing attacks.",
      realWorldTech: "HTTP/1.1 Chunked Transfer Encoding",
    },
    {
      number: 5,
      name: "Keep-Alive Connection Pool",
      focus: "TCP Session State & Pipelining",
      description: "Reuses established connections across sequential requests, avoiding TCP handshake overhead.",
      realWorldTech: "Nginx keepalive_timeout, HAProxy persistent connections",
    },
    {
      number: 6,
      name: "Event Loop & Non-Blocking I/O",
      focus: "epoll / kqueue Scalability",
      description: "Multiplexes concurrent client streams across an event loop without thread-per-client bottlenecks.",
      realWorldTech: "Nginx event loop, libuv, epoll(7)",
    },
  ],
  levels: {
    1: {
      level: 1,
      shortTitle: "Request Line & 200 OK",
      title: "Basic Request Line Parsing",
      difficulty: "Easy",
      tagline: "Parse HTTP/1.1 methods and URI paths from raw streams. Return formatted 200 OK or 404 Not Found.",
      whatAreYouBuilding: `You are going to build the first part of an HTTP server, which acts like a restaurant waiter taking orders from customers.\n\nYour server will read a text-based request (the order), check if it knows the path (the menu), and return a response (the food).\n\nFor example:\nGET /hello\n\nYour server should print:\nHTTP/1.1 200 OK\nContent-Length: 11\n\nHello World`,
      howItWorks: `When a web browser connects to a server, it sends a block of text called an HTTP request.\n1. The server reads the stream of characters until it finds a newline.\n2. It breaks that first line into the method (like GET) and the path (like /hello).\n3. If the path is known, it prepares a success response (200 OK).\n4. If the path is unknown, it prepares an error response (404 Not Found).\n5. It formats the output with a Content-Length header so the browser knows exactly how many bytes to read.`,
      technicalTerms: [
        {
                "term": "HTTP/1.1",
                "definition": "The standard text-based protocol that web browsers and servers use to communicate."
        },
        {
                "term": "Status Code",
                "definition": "A number like 200 or 404 that tells the client if the request succeeded or failed."
        },
        {
                "term": "Content-Length",
                "definition": "An HTTP header that specifies the exact size of the response body in bytes."
        }
],
      description: `At the core of the web, everything is just text sent over a network connection. In Level 1, you will process this raw text by extracting the first line of an HTTP request, known as the Request Line.\n\nWeb servers don't magically understand URLs—they must manually parse strings like 'GET /hello HTTP/1.1', separate the verb from the path, and explicitly format a response. You will learn exactly how a server determines whether an incoming request is valid and how to frame the response so that standard web browsers can understand it.`,
      implementationGuide: [
        "Read text from standard input line-by-line until you reach the end of the file.",
        "Split the first line by spaces to extract the HTTP method and the request path.",
        "Check the path against your known routes using a simple string comparison (e.g., if path == '/hello').",
        "If the method is GET and the path is known, format a 200 OK response string containing the correct Content-Length and body text.",
        "If the path is unknown, return a 404 Not Found response."
],
      diagram: `INPUT (Raw Stream)            PARSER / ENGINE               OUTPUT (HTTP Wire)
GET /hello             ──────► method="GET", path="/hello" ──► HTTP/1.1 200 OK\\n
                                                               Content-Length: 11\\n
                                                               \\n
                                                               Hello World

GET /missing           ──────► path not found              ──► HTTP/1.1 404 Not Found\\n
                                                              Content-Length: 9\\r\\n
                                                              \\r\\n
                                                              Not Found`,
      importantChallenge: {
        title: "TCP stream framing vs message boundaries",
        description:
          `At the core of the web, everything is just text sent over a network connection. In Level 1, you will process this raw text by extracting the first line of an HTTP request, known as the Request Line.\n\nWeb servers don't magically understand URLs—they must manually parse strings like 'GET /hello HTTP/1.1', separate the verb from the path, and explicitly format a response. You will learn exactly how a server determines whether an incoming request is valid and how to frame the response so that standard web browsers can understand it.`,
        codeOrFormat: "GET /hello\\nHost: algo.io\\n\\n ──► status line + headers + body",
      },
      endGoalDemonstration: `GET /hello
HTTP/1.1 200 OK
Content-Length: 11

Hello World
GET /notfound
HTTP/1.1 404 Not Found
Content-Length: 9

Not Found`,
      nextLevelTeaser:
        "In Level 2, we introduce a Radix Trie router supporting dynamic parameters (like /users/:id) and prefix wildcards in O(path length) time.",
      learningLoop: {
        bottleneck: "How do web servers extract verbs and paths from incoming byte streams without allocating memory on every space delimiter?",
        whatYouUnderstand: [
          "HTTP/1.1 wire protocol structure: Request line (<METHOD> <PATH> <VERSION>\\r\\n).",
          "Status codes and headers: Formatting HTTP/1.1 200 OK and Content-Length.",
          "Deterministic 404 dispatch: Handling unknown routes gracefully.",
        ],
        productionParity: "The core status line parser of Nginx (ngx_http_parse.c) and Node.js llhttp.",
        outcomeSummary: "You master HTTP method detection, path parsing, and RFC-compliant response framing.",
      },
      operations: [
        { cmd: "GET /hello", desc: "Returns HTTP/1.1 200 OK with body 'Hello World'." },
        { cmd: "GET /ping", desc: "Returns HTTP/1.1 200 OK with body 'PONG'." },
        { cmd: "GET /", desc: "Returns HTTP/1.1 200 OK with body 'ALGO'." },
        { cmd: "GET /<unknown>", desc: "Returns HTTP/1.1 404 Not Found." },
        { cmd: "<OTHER> <path>", desc: "Returns HTTP/1.1 405 Method Not Allowed." },
      ],
      examples: [
        {
          title: "GET /hello",
          input: "GET /hello",
          output: "HTTP/1.1 200 OK\nContent-Length: 11\n\nHello World",
        },
      ],
      constraints: ["Strict \\n newline delimiters", "Content-Length must match exact body bytes"],
      cases: [
        { name: "Case 1: GET /hello", input: "GET /hello", expected: "HTTP/1.1 200 OK\nContent-Length: 11\n\nHello World" },
        { name: "Case 2: GET /ping", input: "GET /ping", expected: "HTTP/1.1 200 OK\nContent-Length: 4\n\nPONG" },
        { name: "Case 3: Unknown Route 404", input: "GET /not-found", expected: "HTTP/1.1 404 Not Found\nContent-Length: 9\n\nNot Found" },
        { name: "Case 4: Root path GET /", input: "GET /", expected: "HTTP/1.1 200 OK\nContent-Length: 4\n\nALGO" },
        { name: "Case 5: Method Not Allowed", input: "DELETE /hello", expected: "HTTP/1.1 405 Method Not Allowed\nContent-Length: 18\n\nMethod Not Allowed" },
      ],
    },
    2: {
      level: 2,
      shortTitle: "Dynamic Routing",
      title: "Parameter Routing & Path Matching",
      difficulty: "Medium",
      tagline: "Implement parameterized route matching (e.g. /users/:id) and wildcard subpaths.",
      whatAreYouBuilding: `Your waiter can now take exact orders. Now we need to let customers customize their orders, like asking for a specific user ID or post name.\n\nYou will build a dynamic router that understands patterns.\n\nFor example:\nGET /users/42\n\nYour server should print:\nHTTP/1.1 200 OK\nContent-Length: 7\n\nUser 42`,
      howItWorks: `1. Split the incoming path by slashes into a list of segments (e.g., ['users', '42']).\n2. Traverse a tree structure (Radix Trie) where each node represents a path segment.\n3. If a node matches exactly, move to the next segment.\n4. If a node starts with a colon (like ':id'), it's a wildcard! Capture the value ('42') and continue.\n5. Pass the captured variables to the route handler to generate the final response.`,
      technicalTerms: [
        {
                "term": "Radix Trie",
                "definition": "A tree data structure where each node represents a segment of a path, allowing fast route lookups."
        },
        {
                "term": "Path Parameter",
                "definition": "A dynamic part of a URL, usually denoted with a colon like :id, that acts as a variable."
        },
        {
                "term": "Wildcard Matching",
                "definition": "Matching any value in a specific position of a URL path instead of an exact word."
        }
],
      description: `In Level 1, your server checked routes using exact string equality. As an application grows to hundreds of dynamic routes (like /users/1, /users/2), linear scanning becomes too slow.\n\nBy structuring the menu of routes as a Radix Trie, the server only needs to look at the exact segments requested by the user, achieving lightning-fast routing. This tree structure also naturally supports path parameters, which are essential for building modern REST APIs that serve dynamic content based on the URL.`,
      implementationGuide: [
        "Create a Trie Node class with a dictionary of children, a flag indicating if it's a parameter, and the parameter name.",
        "Build a function to insert routes (like '/users/:id') into the Trie by splitting the path by slashes.",
        "Build a function to search the Trie given an incoming path (like '/users/42'), capturing any wildcard values along the way.",
        "If the search succeeds, extract the named parameter values and return the dynamically generated string (e.g., 'User 42').",
        "Return 404 Not Found if no trie path matches the incoming request."
],
      diagram: `RADIX TRIE ROUTER                        PARAMETER EXTRACTION            DISPATCH
GET /users/42          ──► Trie Lookup ──► matches /users/:id (id=42) ──► 200 OK "User 42"
GET /posts/systems     ──► Trie Lookup ──► matches /posts/:slug       ──► 200 OK "Post systems"
GET /unknown           ──► Trie Lookup ──► no match in radix tree     ──► 404 Not Found

Trie Node Topology:
          / (root)
         ┌────────┴────────┐
      users/             posts/
     ┌───┴───┐             │
    :id     me          :slug
 (dynamic) (static)    (dynamic)

Lookup: O(path length) prefix traversal without linear route array scanning.`,
      learningLoop: {
        bottleneck: "Linear string comparisons on routes degrade routing latency from O(1) to O(N). How do production routers resolve parameterized paths in sub-microsecond time?",
        whatYouUnderstand: [
          "Prefix radix trees for route matching.",
          "Named parameter extraction (/users/:id -> id=42).",
          "Exact vs wildcard conflict precedence rules.",
        ],
        productionParity: "The routing trie of Go chi and Rust axum.",
        outcomeSummary: "You build dynamic path segment extraction and high-speed route dispatching.",
      },
      operations: [
        { cmd: "GET /users/:id", desc: "Extracts user ID and returns 'User <id>'." },
        { cmd: "GET /posts/:slug", desc: "Extracts slug parameter and returns 'Post <slug>'." },
      ],
      examples: [
        { title: "Dynamic User ID", input: "GET /users/42", output: "HTTP/1.1 200 OK\nContent-Length: 7\n\nUser 42" },
      ],
      constraints: ["Support alphanumeric path parameters", "Return 404 if path structure does not match"],
      cases: [
        { name: "Case 1: User Route", input: "GET /users/101", expected: "HTTP/1.1 200 OK\nContent-Length: 8\n\nUser 101" },
        { name: "Case 2: Post Route", input: "GET /posts/systems", expected: "HTTP/1.1 200 OK\nContent-Length: 12\n\nPost systems" },
        { name: "Case 3: Nested Parameter", input: "GET /users/42/status", expected: "HTTP/1.1 200 OK\nContent-Length: 13\n\nUser 42 Active" },
        { name: "Case 4: Fallback 404", input: "GET /users/", expected: "HTTP/1.1 404 Not Found\nContent-Length: 9\n\nNot Found" },
        { name: "Case 5: Exact Route Precedence", input: "GET /users/me", expected: "HTTP/1.1 200 OK\nContent-Length: 11\n\nCurrent User" },
      ],
    },
    3: {
      level: 3,
      shortTitle: "Headers & Query Strings",
      title: "Header Parsing & Query Parameters",
      difficulty: "Medium",
      tagline: "Parse case-insensitive HTTP headers and URL query strings (?key=val&sort=asc).",
      whatAreYouBuilding: `Customers might also have special requests written on the side of their order, like dietary restrictions. In HTTP, these are called headers and query strings.\n\nYour server will now extract this metadata to understand more about what the client wants.\n\nFor example:\nGET /search?q=database\n\nYour server should print:\nHTTP/1.1 200 OK\nContent-Length: 16\n\nSearch: database`,
      howItWorks: `1. After reading the first request line, continue reading the following lines one by one.\n2. Split each line by the first colon to separate the header name from its value.\n3. Convert all header names to lowercase, since HTTP headers are case-insensitive.\n4. Stop reading headers when you encounter a completely empty line.\n5. If the request path contains a question mark, split it to extract the query parameters (like q=database).`,
      technicalTerms: [
        {
                "term": "HTTP Headers",
                "definition": "Key-value pairs sent after the request line that contain metadata like browser type or content format."
        },
        {
                "term": "Query String",
                "definition": "The part of a URL after a question mark that contains extra data parameters."
        },
        {
                "term": "Case-Insensitive",
                "definition": "Treating uppercase and lowercase letters as identical, so 'Host' means the same as 'host'."
        }
],
      description: `A URL path and HTTP method only tell half the story. To fully understand a client's request, a server must parse the metadata provided in the headers and the query string.\n\nBecause HTTP was designed in the 1990s as a text protocol, it has quirks: headers are strictly case-insensitive, and the boundary between headers and the body is just a blank line. Correctly normalizing these inputs into predictable dictionaries is a core responsibility of any robust web framework.`,
      implementationGuide: [
        "Parse the path string: if it contains a '?', split it to separate the base path from the query string.",
        "Parse the query string by splitting on '&' and then on '=' to create a dictionary of query parameters.",
        "Read lines after the request line until an empty line is found to gather all HTTP headers.",
        "Store headers in a dictionary, ensuring you call lowercase on all header keys before storing them.",
        "Use these dictionaries to implement handlers like '/echo-agent' that respond with the client's User-Agent."
],
      diagram: `HEADER & QUERY PARSER                    EXTRACTION PIPELINE             NORMALIZED OUTPUT
GET /search?q=redis    ──► Query Tokenizer ──► param["q"] = "redis"   ──► 200 OK "Search: redis"
user-agent: AlgoClient ──► Lowercase Normalizer──► header["user-agent"] ──► 200 OK "Agent AlgoClient"

Header Normalization Table:
Raw Wire Header                 Normalized Internal Map
┌─────────────────────────┐    ┌─────────────────────────┐
│ User-Agent: AlgoClient  │ ──►│ "user-agent": AlgoClient│
│ CONTENT-TYPE: text/html │ ──►│ "content-type": text/html
│ X-Trace-ID: 99482       │ ──►│ "x-trace-id": 99482     │
└─────────────────────────┘    └─────────────────────────┘

Query String Splitting:
"/filter?type=db&sort=desc" ──► path: "/filter", params: { type: "db", sort: "desc" }`,
      learningLoop: {
        bottleneck: "HTTP header names are case-insensitive (Host vs host), and query strings require URL decoding. How do servers parse both without redundant allocations?",
        whatYouUnderstand: [
          "Case-insensitive header dictionary lookup.",
          "Query string delimiter splitting and parameter map resolution.",
          "Content negotiation via Accept and Content-Type headers.",
        ],
        productionParity: "HTTP header maps in Envoy proxy and Nginx ngx_http_headers_module.",
        outcomeSummary: "You parse multi-line headers, normalize keys, and decode query strings.",
      },
      operations: [
        { cmd: "GET /search?q=<term>", desc: "Extracts query parameter q and echoes 'Search: <term>'." },
        { cmd: "GET /echo-agent with User-Agent header", desc: "Extracts and returns User-Agent header value." },
      ],
      examples: [
        { title: "Query String", input: "GET /search?q=database", output: "HTTP/1.1 200 OK\nContent-Length: 16\n\nSearch: database" },
      ],
      constraints: ["Header names are case-insensitive", "Query parameters separated by '&' and '='"],
      cases: [
        { name: "Case 1: Single Query Parameter", input: "GET /search?q=redis", expected: "HTTP/1.1 200 OK\nContent-Length: 13\n\nSearch: redis" },
        { name: "Case 2: Multiple Query Parameters", input: "GET /filter?type=db&sort=desc", expected: "HTTP/1.1 200 OK\nContent-Length: 18\n\nType: db Sort: desc" },
        { name: "Case 3: Header Case Insensitivity", input: "GET /agent\nuser-agent: AlgoClient", expected: "HTTP/1.1 200 OK\nContent-Length: 16\n\nAgent AlgoClient" },
        { name: "Case 4: Missing Header Fallback", input: "GET /agent", expected: "HTTP/1.1 200 OK\nContent-Length: 13\n\nAgent Unknown" },
        { name: "Case 5: Empty Query String", input: "GET /search?", expected: "HTTP/1.1 200 OK\nContent-Length: 12\n\nSearch: None" },
      ],
    },
    4: {
      level: 4,
      shortTitle: "POST & Body Framing",
      title: "Payload Framing & POST Processing",
      difficulty: "Hard",
      tagline: "Handle POST requests with exact Content-Length body framing. Prevent HTTP request smuggling.",
      whatAreYouBuilding: `Sometimes a customer needs to hand the waiter a physical document, like a filled-out form. In HTTP, this is a POST request with a 'body'.\n\nYour server will now safely receive and process incoming data payloads.\n\nFor example:\nPOST /echo\nContent-Length: 5\n\nhello\n\nYour server should print:\nHTTP/1.1 200 OK\nContent-Length: 5\n\nhello`,
      howItWorks: `1. Look at the parsed headers to find 'Content-Length'.\n2. Convert that header value into an integer to know exactly how many bytes of data are coming.\n3. After the blank line that ends the headers, read exactly that many bytes from the input stream.\n4. Treat those bytes as the request body payload.\n5. Process the payload (like converting it to uppercase) and send it back.`,
      technicalTerms: [
        {
                "term": "Request Body",
                "definition": "The raw data payload sent by the client, placed after the HTTP headers."
        },
        {
                "term": "Framing",
                "definition": "The process of determining exactly where a message begins and ends in a continuous stream of data."
        },
        {
                "term": "HTTP POST",
                "definition": "An HTTP method typically used to send data to the server to create or update a resource."
        }
],
      description: `TCP network streams are continuous—they don't have built-in boundaries between messages. If a server reads too far, it might accidentally consume the beginning of the next request, corrupting the stream.\n\nThis is why the 'Content-Length' header is absolutely critical. By parsing this header, your server knows the exact framing of the payload. It can safely ingest JSON, text, or binary data without under-reading or over-reading, preventing security vulnerabilities like HTTP Request Smuggling.`,
      implementationGuide: [
        "Check if the request method is POST.",
        "Look up the 'content-length' key in your lowercase headers dictionary.",
        "If it exists, read exactly that number of characters or bytes from standard input immediately after the blank line.",
        "For the '/echo' route, take the body you just read and include it in your response.",
        "For the '/uppercase' route, call uppercase on the body string before responding."
],
      diagram: `POST PAYLOAD INGESTION                   BODY FRAMING ENGINE             PROCESSED RESPONSE
POST /echo             ──► Read Header: Content-Length: 5 ──► Payload: "hello" (5 bytes)
Payload: hello         ──► Buffer exact N bytes (no desync) ──► 200 OK "hello"

Framing Lifecycle:
Wire Stream: [POST /echo\\r\\n][Content-Length: 5\\r\\n\\r\\n][hello][Next Request...]
             │               │                          │       │
             ▼               ▼                          ▼       ▼
       Status Line      Header Map                 Exact 5B   Safe Boundary
       (Parsed)        (Len = 5)                  (Consumed) (No Smuggling)

Safety Invariant:
Under-read (Len < actual) ──► Rejects or waits for full packet.
Over-read (Len > actual)  ──► Reads exactly N bytes, leaving remainder for next message.`,
      learningLoop: {
        bottleneck: "TCP streams have no built-in packet boundaries. If a server reads too few or too many bytes, request smuggling or stream desynchronization occurs.",
        whatYouUnderstand: [
          "Content-Length framing rules: Exactly N bytes belong to this request body.",
          "Handling payloads with spaces, JSON, and binary data.",
          "Preventing buffer overflows and request smuggling desync.",
        ],
        productionParity: "Body buffer handlers in Nginx client_body_buffer_size and Go net/http.",
        outcomeSummary: "You implement rock-solid payload framing and safe POST body processing.",
      },
      operations: [
        { cmd: "POST /echo with Content-Length: <n> and payload", desc: "Echoes received payload back to client." },
        { cmd: "POST /uppercase with payload", desc: "Returns uppercase version of body string." },
        { cmd: "POST /json with payload", desc: "Echoes JSON payload back." },
      ],
      examples: [
        { title: "POST /echo", input: "POST /echo\nContent-Length: 5\n\nhello", output: "HTTP/1.1 200 OK\nContent-Length: 5\n\nhello" },
      ],
      constraints: ["Strictly consume Content-Length bytes", "Support arbitrary UTF-8 bodies"],
      cases: [
        { name: "Case 1: POST /echo basic", input: "POST /echo\nContent-Length: 5\n\nhello", expected: "HTTP/1.1 200 OK\nContent-Length: 5\n\nhello" },
        { name: "Case 2: POST /uppercase", input: "POST /uppercase\nContent-Length: 4\n\nalgo", expected: "HTTP/1.1 200 OK\nContent-Length: 4\n\nALGO" },
        { name: "Case 3: JSON payload echo", input: "POST /json\nContent-Length: 13\n\n{\"ok\":true}", expected: "HTTP/1.1 200 OK\nContent-Length: 13\n\n{\"ok\":true}" },
        { name: "Case 4: Zero length POST", input: "POST /echo\nContent-Length: 0\n\n", expected: "HTTP/1.1 200 OK\nContent-Length: 0\n\n" },
        { name: "Case 5: POST with extra trailing line", input: "POST /echo\nContent-Length: 4\n\ntest", expected: "HTTP/1.1 200 OK\nContent-Length: 4\n\ntest" },
      ],
    },
    5: {
      level: 5,
      shortTitle: "Keep-Alive & Pipelining",
      title: "Persistent TCP Keep-Alive Sessions",
      difficulty: "Hard",
      tagline: "Reuse a single persistent connection across multiple sequential HTTP requests without closing socket.",
      whatAreYouBuilding: `Instead of the waiter walking all the way back to the kitchen after every single item, they will now stay at the table to take multiple orders in a row.\n\nYour server will reuse the same network connection for multiple requests.\n\nFor example:\nGET /hello\n---\nGET /ping\n\nYour server should print responses for both without disconnecting.`,
      howItWorks: `1. Read and process a complete HTTP request (headers and body).\n2. Look for a 'Connection: close' header. If it's missing, assume the connection is kept alive.\n3. Send the response back to the client, but do NOT close the program or network socket.\n4. Immediately loop back to wait for the next request on the exact same stream.\n5. Continue this loop until the client explicitly asks to close the connection or the stream ends.`,
      technicalTerms: [
        {
                "term": "Keep-Alive",
                "definition": "A mechanism that allows a single TCP connection to remain open for multiple HTTP requests."
        },
        {
                "term": "TCP Handshake",
                "definition": "The slow, multi-step process required to establish a brand new network connection."
        },
        {
                "term": "Pipelining",
                "definition": "Sending multiple HTTP requests on a single connection without waiting for the corresponding responses."
        }
],
      description: `Establishing a new TCP connection requires a 3-way handshake, which introduces significant latency. If a browser had to open a new connection for every image on a webpage, the internet would be painfully slow.\n\nBy implementing HTTP Keep-Alive, your server can reuse a single established socket for dozens of sequential requests. This dramatically increases throughput and reduces latency, but it requires your parsing logic to perfectly reset its state after every single request to avoid mixing up data.`,
      implementationGuide: [
        "Wrap your entire request parsing logic in a continuous loop that runs until EOF.",
        "When processing the ALGO test stream, treat the '---' line as the delimiter for a new pipelined request.",
        "After generating a response, flush it to standard output immediately.",
        "If the client sends 'Connection: close', break the loop and terminate cleanly after sending the response.",
        "Ensure your response headers explicitly include 'Connection: keep-alive' or 'Connection: close'."
],
      diagram: `CLIENT TCP STREAM                        SESSION COORDINATOR             PIPELINED STREAM
Request 1: GET /hello  ──► Process Req 1 ──► Keep socket OPEN ──────► Res 1: 200 OK (keep-alive)
Request 2: GET /ping   ──► Process Req 2 ──► Final req in stream ───► Res 2: 200 OK (close)

Keep-Alive Connection Timeline:
TCP Handshake (SYN, SYN-ACK, ACK) [Paid ONCE]
  │
  ├──► [Request 1: GET /hello] ────► [Response 1: keep-alive]
  ├──► [Request 2: POST /echo] ────► [Response 2: keep-alive]
  └──► [Request 3: GET /ping]  ────► [Response 3: close] ──► FIN (Socket Closed)

Throughput Advantage:
Eliminates 3-way TCP handshake + TLS negotiation on repeated asset requests.`,
      learningLoop: {
        bottleneck: "Opening a new TCP connection (3-way handshake + slow start) for every asset adds 50-100ms latency per request. Keep-alive is mandatory for high throughput.",
        whatYouUnderstand: [
          "Connection: keep-alive state machine.",
          "Sequential request pipelining on single stream.",
          "Connection: close handling and graceful termination.",
        ],
        productionParity: "Nginx keepalive_requests and HTTP/1.1 persistent connections.",
        outcomeSummary: "You maintain stream state across multiple requests on a single connection.",
      },
      operations: [
        { cmd: "Connection: keep-alive", desc: "Instructs server to keep stream open for subsequent requests." },
        { cmd: "Connection: close", desc: "Closes connection after current response." },
        { cmd: "---", desc: "Delimiter for pipelined requests on standard input." },
      ],
      examples: [
        { title: "2 Pipelined Requests", input: "GET /hello\n---\nGET /ping", output: "HTTP/1.1 200 OK\nContent-Length: 11\nConnection: keep-alive\n\nHello World\n---\nHTTP/1.1 200 OK\nContent-Length: 4\nConnection: close\n\nPONG" },
      ],
      constraints: ["Must include Connection header", "Accurate Content-Length on every pipelined response"],
      cases: [
        { name: "Case 1: Pipelined Sequential Reads", input: "GET /hello\n---\nGET /ping", expected: "HTTP/1.1 200 OK\nContent-Length: 11\nConnection: keep-alive\n\nHello World\n---\nHTTP/1.1 200 OK\nContent-Length: 4\nConnection: close\n\nPONG" },
        { name: "Case 2: 3-Request Pipeline", input: "GET /\n---\nGET /hello\n---\nGET /ping", expected: "HTTP/1.1 200 OK\nContent-Length: 4\nConnection: keep-alive\n\nALGO\n---\nHTTP/1.1 200 OK\nContent-Length: 11\nConnection: keep-alive\n\nHello World\n---\nHTTP/1.1 200 OK\nContent-Length: 4\nConnection: close\n\nPONG" },
        { name: "Case 3: POST followed by GET", input: "POST /echo\nContent-Length: 2\n\nok\n---\nGET /hello", expected: "HTTP/1.1 200 OK\nContent-Length: 2\nConnection: keep-alive\n\nok\n---\nHTTP/1.1 200 OK\nContent-Length: 11\nConnection: close\n\nHello World" },
        { name: "Case 4: Explicit Connection Close", input: "GET /ping\nConnection: close", expected: "HTTP/1.1 200 OK\nContent-Length: 4\nConnection: close\n\nPONG" },
        { name: "Case 5: Route 404 in Pipeline", input: "GET /missing\n---\nGET /hello", expected: "HTTP/1.1 404 Not Found\nContent-Length: 9\nConnection: keep-alive\n\nNot Found\n---\nHTTP/1.1 200 OK\nContent-Length: 11\nConnection: close\n\nHello World" },
      ],
    },
    6: {
      level: 6,
      shortTitle: "High-Throughput Concurrency",
      title: "Connection Pooling & Peak Throughput",
      difficulty: "Hard",
      tagline: "Scale to 50,000+ requests/sec. Implement non-blocking I/O event handling with sub-millisecond p99 latency.",
      whatAreYouBuilding: `You now have a highly efficient waiter. But what if 10,000 customers show up at once? You need a manager to coordinate everything asynchronously.\n\nYou will build a high-throughput event loop to handle massive concurrency.\n\nFor example, when asked for STATS, your server should print:\nREQUESTS: 2 CONNS: 1 STATUS: HEALTHY`,
      howItWorks: `1. Instead of pausing (blocking) while waiting for a slow client to send data, the server registers the connection with the operating system.\n2. The event loop continuously asks the OS, 'Which connections have new data ready right now?'\n3. It quickly reads the available data, advances the parsing state machine for that specific client, and moves on.\n4. If a complete request is formed, it immediately dispatches it to the router.\n5. This allows a single thread to juggle thousands of connections simultaneously without ever getting stuck.`,
      technicalTerms: [
        {
                "term": "Event Loop",
                "definition": "A programming construct that waits for and dispatches events or messages in a program."
        },
        {
                "term": "Non-blocking I/O",
                "definition": "Network operations that return immediately instead of waiting for data to arrive."
        },
        {
                "term": "State Machine",
                "definition": "An architecture where each connection remembers its current phase (e.g., reading headers vs reading body)."
        }
],
      description: `The traditional approach to web servers was to spawn a new operating system thread for every client. But threads consume heavy memory, and an OS struggles to context-switch between 10,000 threads. This was known as the C10K problem.\n\nModern servers solve this using Non-blocking I/O and an Event Loop. By never waiting on the network and processing bytes strictly as they arrive via a state machine, a single CPU core can handle tens of thousands of concurrent requests with sub-millisecond latency.`,
      implementationGuide: [
        "Implement a counter to track the total number of requests successfully processed across all connections.",
        "Implement a state machine for parsing: track whether you are currently parsing the REQUEST_LINE, HEADERS, or BODY.",
        "Support the 'STATS' command to output the current metrics (e.g., 'REQUESTS: <count> STATUS: HEALTHY').",
        "Ensure memory isn't leaked over time by completely resetting the state for a connection once its response is sent.",
        "Support 'QUIT' to break the loop and gracefully drain the server."
],
      diagram: `EVENT LOOP (epoll/kqueue)                WORKER DISPATCHER               CONCURRENCY PEAK
Socket 1: Ready to Read ──► epoll_wait() ──► Zero-Copy Parse ──► 200 OK
Socket 2: Ready to Read ──► Non-Blocking ──► Direct Write    ──► 200 OK
Throughput: > 50,000 req/sec | Latency: p99 < 1.0ms

C10K Event Loop Architecture:
                 ┌─────────────────────────┐
Client Sockets ──►   Linux epoll / kqueue  │
(10,000 Conns)   └────────────┬────────────┘
                              │ Readiness Events
                              ▼
                 ┌─────────────────────────┐
                 │    Single-Thread Loop   │
                 │ 1. Read Available Bytes │
                 │ 2. Dispatch Handler     │
                 │ 3. Non-Blocking Flush   │
                 └─────────────────────────┘`,
      learningLoop: {
        bottleneck: "Thread-per-connection architectures crash under 10,000 concurrent clients due to OS stack memory exhaustion. Non-blocking event loops solve the C10K problem.",
        whatYouUnderstand: [
          "Non-blocking I/O multiplexing with event loops.",
          "Zero-allocation buffer parsing for hot paths.",
          "Connection pool backpressure and overload shedding.",
        ],
        productionParity: "Nginx master-worker architecture and Node.js libuv event loop.",
        outcomeSummary: "You master high-speed non-blocking I/O, event dispatching, and zero-allocation parsing.",
      },
      operations: [
        { cmd: "STATS", desc: "Returns server metrics: REQUESTS: <n> ACTIVE_CONNS: <c> P99_MS: <ms>." },
        { cmd: "QUIT", desc: "Drains the server and exits with 'SERVER_DRAINED'." },
      ],
      examples: [
        { title: "Server Stats", input: "GET /hello\nGET /ping\nSTATS", output: "HTTP/1.1 200 OK\nContent-Length: 11\n\nHello World\nHTTP/1.1 200 OK\nContent-Length: 4\n\nPONG\nREQUESTS: 2 CONNS: 1 STATUS: HEALTHY" },
      ],
      constraints: ["> 20,000 requests/sec target", "p99 latency < 1.0ms"],
      cases: [
        { name: "Case 1: Burst GETs", input: "GET /hello\nGET /ping\nGET /hello", expected: "HTTP/1.1 200 OK\nContent-Length: 11\n\nHello World\nHTTP/1.1 200 OK\nContent-Length: 4\n\nPONG\nHTTP/1.1 200 OK\nContent-Length: 11\n\nHello World" },
        { name: "Case 2: STATS Output", input: "GET /hello\nSTATS", expected: "HTTP/1.1 200 OK\nContent-Length: 11\n\nHello World\nREQUESTS: 1 STATUS: HEALTHY", check: (act) => act.includes("REQUESTS") && act.includes("HEALTHY") },
        { name: "Case 3: Mixed GET & POST Burst", input: "GET /hello\nPOST /echo\nContent-Length: 4\n\nfast\nGET /ping", expected: "HTTP/1.1 200 OK\nContent-Length: 11\n\nHello World\nHTTP/1.1 200 OK\nContent-Length: 4\n\nfast\nHTTP/1.1 200 OK\nContent-Length: 4\n\nPONG" },
        { name: "Case 4: Fast 404 Resolution", input: "GET /404a\nGET /404b", expected: "HTTP/1.1 404 Not Found\nContent-Length: 9\n\nNot Found\nHTTP/1.1 404 Not Found\nContent-Length: 9\n\nNot Found" },
        { name: "Case 5: Clean Drain", input: "GET /hello\nQUIT", expected: "HTTP/1.1 200 OK\nContent-Length: 11\n\nHello World\nSERVER_DRAINED" },
      ],
    },
  },
  starterTemplates: {
    python: `"""
ALGO Challenge 02: Build an HTTP Server (Python 3.12)
Inspired by Nginx & Node.js llhttp
Supporting Levels 1 - 6
"""
import sys

def build_response(status_code: int, status_text: str, body: str, keep_alive: bool = False) -> str:
    body_bytes = body.encode("utf-8")
    conn_header = "\\nConnection: " + ("keep-alive" if keep_alive else "close")
    return f"HTTP/1.1 {status_code} {status_text}\\nContent-Length: {len(body_bytes)}{conn_header}\\n\\n{body}"

def main():
    for line in sys.stdin:
        line = line.rstrip("\\n")
        if line == "EXIT":
            break
        if line == "QUIT":
            print("SERVER_DRAINED")
            break
        if line == "STATS":
            print("REQUESTS: 1 STATUS: HEALTHY")
            continue
            
        # Parse pipelined requests separated by '---'
        if line == "---":
            continue

        parts = line.split(" ", 2)
        if len(parts) >= 2:
            method, path = parts[0], parts[1]
            
            # --- LEVEL 1: Basic Request Line Parsing ---
            if method == "GET":
                if path == "/hello":
                    print(build_response(200, "OK", "Hello World"))
                elif path == "/ping":
                    print(build_response(200, "OK", "PONG"))
                elif path == "/":
                    print(build_response(200, "OK", "ALGO"))
                # --- HIGHER LEVEL STUBS ---
                elif path.startswith("/users/") or path.startswith("/posts/"):
                    # TODO: Level 2 - Implement Radix Trie for parameterized routing
                    print(build_response(200, "OK", "Stub Response"))
                elif path.startswith("/search"):
                    # TODO: Level 3 - Implement Query String parsing
                    print(build_response(200, "OK", "Search: None"))
                else:
                    print(build_response(404, "Not Found", "Not Found"))
            elif method == "POST":
                # TODO: Level 4 - Implement exact Content-Length body framing
                print(build_response(200, "OK", "hello"))
            else:
                print(build_response(405, "Method Not Allowed", "Method Not Allowed"))

if __name__ == "__main__":
    main()
`,
    cpp: `// ALGO Challenge 02: Build an HTTP Server (C++20)
// Inspired by Nginx
#include <iostream>
#include <string>
#include <sstream>

std::string build_response(int code, const std::string& text, const std::string& body, bool keep_alive = false) {
    std::string conn = keep_alive ? "\\nConnection: keep-alive" : "\\nConnection: close";
    return "HTTP/1.1 " + std::to_string(code) + " " + text + 
           "\\nContent-Length: " + std::to_string(body.size()) + conn + "\\n\\n" + body;
}

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    std::string line;
    while (std::getline(std::cin, line)) {
        while (!line.empty() && (line.back() == '\\r' || line.back() == '\\n')) {
            line.pop_back();
        }
        if (line.empty() || line == "EXIT") break;
        if (line == "QUIT") {
            std::cout << "SERVER_DRAINED\\n";
            break;
        }
        if (line == "STATS") {
            std::cout << "REQUESTS: 1 STATUS: HEALTHY\\n";
            continue;
        }
        if (line == "---") continue;

        std::stringstream ss(line);
        std::string method, path;
        ss >> method >> path;

        // --- LEVEL 1: Basic Request Line Parsing ---
        if (method == "GET") {
            if (path == "/hello") {
                std::cout << build_response(200, "OK", "Hello World") << "\\n";
            } else if (path == "/ping") {
                std::cout << build_response(200, "OK", "PONG") << "\\n";
            } else if (path == "/") {
                std::cout << build_response(200, "OK", "ALGO") << "\\n";
            } 
            // --- HIGHER LEVEL STUBS ---
            else if (path.rfind("/users/", 0) == 0 || path.rfind("/posts/", 0) == 0) {
                // TODO: Level 2 - Implement Radix Trie for parameterized routing
                std::cout << build_response(200, "OK", "Stub Response") << "\\n";
            } else if (path.rfind("/search", 0) == 0) {
                // TODO: Level 3 - Implement Query String parsing
                std::cout << build_response(200, "OK", "Search: None") << "\\n";
            } else {
                std::cout << build_response(404, "Not Found", "Not Found") << "\\n";
            }
        } else if (method == "POST") {
            // TODO: Level 4 - Implement exact Content-Length body framing
            std::cout << build_response(200, "OK", "hello") << "\\n";
        } else {
            std::cout << build_response(405, "Method Not Allowed", "Method Not Allowed") << "\\n";
        }
    }
    return 0;
}
`,
  },
};
