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
      whatAreYouBuilding: `In this level, you build: Basic Request Line Parsing.

Parse HTTP/1.1 methods and URI paths from raw streams. Return formatted 200 OK or 404 Not Found.

You are creating a reliable component of High-Concurrency HTTP Server. When commands arrive on standard input, your program parses the action and produces the expected output.`,
      howItWorks: `Core steps your code performs:
1. Read input command lines from standard input.
2. Parse the command name and extract arguments.
3. Update the internal state or data structure.
4. Format and print the exact result to standard output.

Supported Operations:
• GET /hello -> Returns HTTP/1.1 200 OK with body 'Hello World'.
• GET /ping -> Returns HTTP/1.1 200 OK with body 'PONG'.
• GET / -> Returns HTTP/1.1 200 OK with body 'ALGO'.`,
      technicalTerms: [
        {
                "term": "HTTP/1",
                "definition": "1 wire protocol structure. Request line (<METHOD> <PATH> <VERSION>\\r\\n)."
        },
        {
                "term": "Status codes and headers",
                "definition": "Formatting HTTP/1.1 200 OK and Content.Length."
        },
        {
                "term": "Deterministic 404 dispatch",
                "definition": "Handling unknown routes gracefully."
        }
],
      description: `HTTP/1.1 is the foundational wire protocol of the web. In Level 1, you build the initial request line parser.

Every HTTP request begins with a request line containing the HTTP method and URI path (e.g. 'GET /hello'). Your server reads standard input stream lines, parses the method and path, and responds with a properly formatted HTTP status line ('HTTP/1.1 200 OK' or 'HTTP/1.1 404 Not Found'), Content-Length header, and payload.`,
      implementationGuide: [
        "Read input lines from standard input until EOF.",
        "Parse the request line: extract the HTTP method and request path.",
        "Support static routes: '/hello' -> 'Hello World', '/ping' -> 'PONG', '/' -> 'ALGO'.",
        "If a route is unrecognized, return 'HTTP/1.1 404 Not Found' with body 'Not Found'.",
        "If a non-GET method targets a GET-only path, return 'HTTP/1.1 405 Method Not Allowed'.",
        "Format the response string: Status Line + '\\n' + 'Content-Length: <len>\\n\\n' + Body."
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
          "In real TCP networks, a single read() call might return half an HTTP header, or two pipelined requests stuck together. Here, you will read line by line scanning for the \\n delimiter rather than assuming one read = one HTTP request.",
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
      whatAreYouBuilding: `In this level, you build: Parameter Routing & Path Matching.

Implement parameterized route matching (e.g. /users/:id) and wildcard subpaths.

You are creating a reliable component of High-Concurrency HTTP Server. When commands arrive on standard input, your program parses the action and produces the expected output.`,
      howItWorks: `Core steps your code performs:
1. Read input command lines from standard input.
2. Parse the command name and extract arguments.
3. Update the internal state or data structure.
4. Format and print the exact result to standard output.

Supported Operations:
• GET /users/:id -> Extracts user ID and returns 'User <id>'.
• GET /posts/:slug -> Extracts slug parameter and returns 'Post <slug>'.`,
      technicalTerms: [
        {
                "term": "Prefix radix trees for route matching",
                "definition": ""
        },
        {
                "term": "Named parameter extraction (/users/",
                "definition": "id .> id=42)."
        },
        {
                "term": "Exact vs wildcard conflict precedence rules",
                "definition": ""
        }
],
      description: `Production web servers route thousands of dynamic endpoints using Radix Tries (prefix trees) rather than linear if/else scans.

In Level 2, you implement path routing with dynamic route parameters (e.g. '/users/:id'). A Radix Tree breaks the URL path by slashes ('/') and matches tokens against tree nodes. If a node begins with ':', it captures the parameter value dynamically and provides it to the route handler.`,
      implementationGuide: [
        "Construct a Radix Trie router where each node represents a path segment between slashes.",
        "Support parameter segments prefixed with ':' (e.g. '/users/:id').",
        "When routing an incoming path, match exact literal segments first, then parameter wildcard segments.",
        "Extract named parameter values (e.g. '/users/42' extracts id=42) and return 'User 42'.",
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
      whatAreYouBuilding: `In this level, you build: Header Parsing & Query Parameters.

Parse case-insensitive HTTP headers and URL query strings (?key=val&sort=asc).

You are creating a reliable component of High-Concurrency HTTP Server. When commands arrive on standard input, your program parses the action and produces the expected output.`,
      howItWorks: `Core steps your code performs:
1. Read input command lines from standard input.
2. Parse the command name and extract arguments.
3. Update the internal state or data structure.
4. Format and print the exact result to standard output.

Supported Operations:
• GET /search?q=<term> -> Extracts query parameter q and echoes 'Search: <term>'.
• GET /echo-agent with User-Agent header -> Extracts and returns User-Agent header value.`,
      technicalTerms: [
        {
                "term": "Case",
                "definition": "insensitive header dictionary lookup."
        },
        {
                "term": "Query string delimiter splitting and parameter map resolution",
                "definition": ""
        },
        {
                "term": "Content negotiation via Accept and Content",
                "definition": "Type headers."
        }
],
      description: `HTTP headers carry critical metadata for content negotiation, authentication, and caching. In Level 3, you implement full HTTP header parsing.

Header fields follow the request line as key-value pairs formatted as 'Key: Value'. Header names are strictly case-insensitive (e.g. 'content-type' is identical to 'Content-Type'). Headers terminate with an empty blank line ('\n') before any request body begins.`,
      implementationGuide: [
        "Read lines following the request line until encountering an empty line.",
        "Split each header line on the first ':' into key and value, trimming whitespace.",
        "Store headers in a case-insensitive map.",
        "Support 'GET /echo-header': inspect the requested header and return its value in the body.",
        "Properly compute and attach Content-Length and Content-Type response headers."
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
      whatAreYouBuilding: `In this level, you build: Payload Framing & POST Processing.

Handle POST requests with exact Content-Length body framing. Prevent HTTP request smuggling.

You are creating a reliable component of High-Concurrency HTTP Server. When commands arrive on standard input, your program parses the action and produces the expected output.`,
      howItWorks: `Core steps your code performs:
1. Read input command lines from standard input.
2. Parse the command name and extract arguments.
3. Update the internal state or data structure.
4. Format and print the exact result to standard output.

Supported Operations:
• POST /echo with Content-Length: <n> and payload -> Echoes received payload back to client.
• POST /uppercase with payload -> Returns uppercase version of body string.
• POST /json with payload -> Echoes JSON payload back.`,
      technicalTerms: [
        {
                "term": "Content",
                "definition": "Length framing rules. Exactly N bytes belong to this request body."
        },
        {
                "term": "Handling payloads with spaces, JSON, and binary data",
                "definition": ""
        },
        {
                "term": "Preventing buffer overflows and request smuggling desync",
                "definition": ""
        }
],
      description: `HTTP POST and PUT methods transmit arbitrary payloads within the request body. In Level 4, you implement body framing.

Because TCP streams do not preserve message boundaries, an HTTP parser relies on the 'Content-Length' header to know exactly how many bytes to read after the header separator blank line.`,
      implementationGuide: [
        "Detect if the request method has a body (e.g. POST).",
        "Parse the 'Content-Length' header to determine the exact byte count of the body payload.",
        "Read exactly Content-Length bytes from standard input immediately after the header blank line.",
        "For 'POST /echo': echo the exact request body back with 'Content-Type: text/plain'.",
        "For 'POST /json': parse the incoming JSON payload and respond with status 200."
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
      whatAreYouBuilding: `In this level, you build: Persistent TCP Keep-Alive Sessions.

Reuse a single persistent connection across multiple sequential HTTP requests without closing socket.

You are creating a reliable component of High-Concurrency HTTP Server. When commands arrive on standard input, your program parses the action and produces the expected output.`,
      howItWorks: `Core steps your code performs:
1. Read input command lines from standard input.
2. Parse the command name and extract arguments.
3. Update the internal state or data structure.
4. Format and print the exact result to standard output.

Supported Operations:
• Connection: keep-alive -> Instructs server to keep stream open for subsequent requests.
• Connection: close -> Closes connection after current response.
• --- -> Delimiter for pipelined requests on standard input.`,
      technicalTerms: [
        {
                "term": "Connection",
                "definition": "keep.alive state machine."
        },
        {
                "term": "Sequential request pipelining on single stream",
                "definition": ""
        },
        {
                "term": "Connection",
                "definition": "close handling and graceful termination."
        }
],
      description: `Opening a new connection for every request adds significant handshake latency. In Level 5, you implement persistent Keep-Alive connections and HTTP/1.1 pipelining.

Under Keep-Alive, multiple sequential requests are streamed over the same session. In ALGO's evaluation stream, requests are separated by the '---' delimiter. Your parser must process each request sequentially, flush its response, and immediately be ready for the next request.`,
      implementationGuide: [
        "Process request batches separated by the '---' delimiter on standard input.",
        "Format and flush the full HTTP response for request N before beginning output for request N+1.",
        "Attach 'Connection: keep-alive' or 'Connection: close' response headers appropriately.",
        "Terminate cleanly when 'Connection: close' is requested or EOF is reached."
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
      whatAreYouBuilding: `In this level, you build: Connection Pooling & Peak Throughput.

Scale to 50,000+ requests/sec. Implement non-blocking I/O event handling with sub-millisecond p99 latency.

You are creating a reliable component of High-Concurrency HTTP Server. When commands arrive on standard input, your program parses the action and produces the expected output.`,
      howItWorks: `Core steps your code performs:
1. Read input command lines from standard input.
2. Parse the command name and extract arguments.
3. Update the internal state or data structure.
4. Format and print the exact result to standard output.

Supported Operations:
• STATS -> Returns server metrics: REQUESTS: <n> ACTIVE_CONNS: <c> P99_MS: <ms>.
• QUIT -> Drains the server and exits with 'SERVER_DRAINED'.`,
      technicalTerms: [
        {
                "term": "Non",
                "definition": "blocking I/O multiplexing with event loops."
        },
        {
                "term": "Zero",
                "definition": "allocation buffer parsing for hot paths."
        },
        {
                "term": "Connection pool backpressure and overload shedding",
                "definition": ""
        }
],
      description: `Modern web servers use an asynchronous event loop (epoll on Linux, kqueue on macOS) to handle 50,000+ requests/sec on a single thread.

In Level 6, you build an event-driven request dispatcher. You will measure requests per second, monitor throughput, and handle concurrent connection states using streaming state machine parsing.`,
      implementationGuide: [
        "Implement a non-blocking streaming state machine parser that transitions between REQUEST_LINE, HEADERS, BODY, and RESPONSE states.",
        "Support 'GET /stats': report total requests processed, active connections, and requests per second.",
        "Ensure zero-copy buffer slicing so large request bodies do not allocate redundant memory strings."
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
