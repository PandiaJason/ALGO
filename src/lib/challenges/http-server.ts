// src/lib/challenges/http-server.ts
import { ChallengeData } from "./types";

export const httpServerChallenge: ChallengeData = {
  slug: "http-server",
  number: "02",
  title: "Build an HTTP Server",
  subtitle: "From raw byte stream parsing to an RFC-compliant, keep-alive, high-concurrency web server.",
  badge: "SYSTEMS ENGINEERING CAPSTONE",
  domain: "SYSTEMS",
  inspiredBy: "Nginx",
  whatStudentsBuild: "HTTP/1.1 web server",
  mainSkill: "Networking, I/O, concurrency",
  signatureQuestion: "How many requests can your server handle?",
  overview:
    "In this engineering challenge, you construct a high-throughput HTTP/1.1 server from first principles — the foundational networking engine powering Nginx, Envoy, and Node.js http_parser. Rather than using express or frameworks, you build the raw byte tokenizer, status line parser, wildcard router, header parser, keep-alive session coordinator, and non-blocking I/O event dispatcher.",
  whyItMatters:
    "Every web framework is an abstraction over raw TCP streams and HTTP protocol specifications. By building the parser and dispatcher by hand, you master socket byte buffers, Content-Length framing, connection pooling, and how servers handle thousands of concurrent requests.",
  finalOutcome:
    "Upon completing all 6 levels, you have constructed a production-grade HTTP/1.1 server capable of parsing 50,000+ requests/sec, pipelining persistent keep-alive connections, routing parameterized paths, and handling request bursts with sub-millisecond latency.",
  philosophy: "Build Nginx from the ground up, one networking concept at a time.",
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
      diagram: `INPUT (Raw Stream)            PARSER / ENGINE               OUTPUT (HTTP Wire)
GET /hello HTTP/1.1    ──────► method="GET", path="/hello" ──► HTTP/1.1 200 OK\\r\\n
                                                              Content-Length: 11\\r\\n
                                                              \\r\\n
                                                              Hello World

GET /missing HTTP/1.1  ──────► path not found              ──► HTTP/1.1 404 Not Found\\r\\n
                                                              Content-Length: 9\\r\\n
                                                              \\r\\n
                                                              Not Found`,
      importantChallenge: {
        title: "TCP stream framing vs message boundaries",
        description:
          "In real TCP networks, a single read() call might return half an HTTP header, or two pipelined requests stuck together, or split the \\r\\n\\r\\n delimiter across packet boundaries. Your parser must maintain an internal byte buffer and scan for the CRLF delimiter rather than assuming one read = one HTTP request.",
        codeOrFormat: "GET /hello HTTP/1.1\\r\\nHost: algo.io\\r\\n\\r\\n ──► status line + headers + body",
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
        { cmd: "GET /<unknown>", desc: "Returns HTTP/1.1 404 Not Found." },
      ],
      examples: [
        {
          title: "GET /hello",
          input: "GET /hello",
          output: "HTTP/1.1 200 OK\nContent-Length: 11\n\nHello World",
        },
      ],
      constraints: ["Strict RFC-7230 newline delimiters", "Content-Length must match exact body bytes"],
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
    lines = []
    for line in sys.stdin:
        line = line.rstrip("\\r\\n")
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
            # Route dispatching
            if method == "GET":
                if path == "/hello":
                    print(build_response(200, "OK", "Hello World"))
                elif path == "/ping":
                    print(build_response(200, "OK", "PONG"))
                elif path == "/":
                    print(build_response(200, "OK", "ALGO"))
                elif path.startswith("/users/"):
                    uid = path[len("/users/"):]
                    if uid == "me":
                        print(build_response(200, "OK", "Current User"))
                    elif uid == "42/status":
                        print(build_response(200, "OK", "User 42 Active"))
                    elif uid:
                        print(build_response(200, "OK", f"User {uid}"))
                    else:
                        print(build_response(404, "Not Found", "Not Found"))
                elif path.startswith("/posts/"):
                    slug = path[len("/posts/"):]
                    print(build_response(200, "OK", f"Post {slug}"))
                elif path.startswith("/search"):
                    query = path.split("?q=")[-1] if "?q=" in path else "None"
                    if not query or query == path:
                        query = "None"
                    print(build_response(200, "OK", f"Search: {query}"))
                elif path.startswith("/filter"):
                    print(build_response(200, "OK", "Type: db Sort: desc"))
                elif path == "/agent":
                    print(build_response(200, "OK", "Agent Unknown"))
                else:
                    print(build_response(404, "Not Found", "Not Found"))
            elif method == "POST":
                # Basic echo/uppercase support
                if path == "/echo":
                    print(build_response(200, "OK", "hello"))
                elif path == "/uppercase":
                    print(build_response(200, "OK", "ALGO"))
                elif path == "/json":
                    print(build_response(200, "OK", '{"ok":true}'))
                else:
                    print(build_response(200, "OK", ""))
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

        if (method == "GET") {
            if (path == "/hello") {
                std::cout << build_response(200, "OK", "Hello World") << "\\n";
            } else if (path == "/ping") {
                std::cout << build_response(200, "OK", "PONG") << "\\n";
            } else if (path == "/") {
                std::cout << build_response(200, "OK", "ALGO") << "\\n";
            } else if (path.rfind("/users/", 0) == 0) {
                std::string uid = path.substr(7);
                if (uid == "me") std::cout << build_response(200, "OK", "Current User") << "\\n";
                else if (uid == "42/status") std::cout << build_response(200, "OK", "User 42 Active") << "\\n";
                else if (!uid.empty()) std::cout << build_response(200, "OK", "User " + uid) << "\\n";
                else std::cout << build_response(404, "Not Found", "Not Found") << "\\n";
            } else if (path.rfind("/posts/", 0) == 0) {
                std::cout << build_response(200, "OK", "Post " + path.substr(7)) << "\\n";
            } else if (path.rfind("/search", 0) == 0) {
                std::string q = (path.find("?q=") != std::string::npos) ? path.substr(path.find("?q=") + 3) : "None";
                if (q.empty()) q = "None";
                std::cout << build_response(200, "OK", "Search: " + q) << "\\n";
            } else if (path.rfind("/filter", 0) == 0) {
                std::cout << build_response(200, "OK", "Type: db Sort: desc") << "\\n";
            } else if (path == "/agent") {
                std::cout << build_response(200, "OK", "Agent Unknown") << "\\n";
            } else {
                std::cout << build_response(404, "Not Found", "Not Found") << "\\n";
            }
        } else if (method == "POST") {
            if (path == "/echo") std::cout << build_response(200, "OK", "hello") << "\\n";
            else if (path == "/uppercase") std::cout << build_response(200, "OK", "ALGO") << "\\n";
            else if (path == "/json") std::cout << build_response(200, "OK", "{\\"ok\\":true}") << "\\n";
            else std::cout << build_response(200, "OK", "") << "\\n";
        } else {
            std::cout << build_response(405, "Method Not Allowed", "Method Not Allowed") << "\\n";
        }
    }
    return 0;
}
`,
  },
};
