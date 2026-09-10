export const SUPPORTED_BENCHMARK_SLUGS = [
  'shell',
  'http-server',
  'git',
  'kv-store',
  'object-store',
  'lru-cache',
  'database-index',
  'container-runtime',
  'message-queue',
  'log-engine',
  'rate-limiter',
  'load-balancer',
  'task-scheduler',
  'distributed-consensus',
  'service-discovery',
  'distributed-object-storage',
  'search-engine',
  'vector-database',
  'llm-inference',
  'mcp-runtime'
];

export function generateBenchmarkWorkload(slug: string, operations: number): string {
  const lines: string[] = [];

  for (let i = 0; i < operations; i++) {
    switch (slug) {
      case 'shell':
        if (i % 4 === 0) lines.push(`echo hello_world_${i}`);
        else if (i % 4 === 1) lines.push(`ls`);
        else if (i % 4 === 2) lines.push(`pwd`);
        else lines.push(`cat file_${i}.txt`);
        break;
      case 'http-server':
        if (i % 4 === 0) lines.push(`GET /ping`);
        else if (i % 4 === 1) lines.push(`GET /users/${i}`);
        else if (i % 4 === 2) lines.push(`GET /search?q=term_${i}`);
        else lines.push(`POST /echo payload_${i}`);
        break;
      case 'git':
        if (i % 3 === 0) lines.push(`hash-object content_${i}`);
        else if (i % 3 === 1) lines.push(`cat-file -p hash_${i}`);
        else lines.push(`cat-file -s hash_${i}`);
        break;
      case 'object-store':
        if (i % 4 === 0) lines.push(`PUT key_${i} data_${i}`);
        else if (i % 4 === 1) lines.push(`GET key_${i}`);
        else if (i % 4 === 2) lines.push(`DELETE key_${i}`);
        else lines.push(`LIST`);
        break;
      case 'lru-cache':
        if (i === 0) lines.push(`CAPACITY 1000`);
        else if (i % 3 === 0) lines.push(`PUT key_${i} val_${i}`);
        else lines.push(`GET key_${i}`);
        break;
      case 'database-index':
        if (i % 4 === 0) lines.push(`INSERT ${i} val_${i}`);
        else if (i % 4 === 1) lines.push(`BTREE_GET ${i}`);
        else if (i % 4 === 2) lines.push(`RANGE 0 ${i}`);
        else lines.push(`SCAN ${i}`);
        break;
      case 'container-runtime':
        if (i % 3 === 0) lines.push(`spawn-ns host_${i} echo hello`);
        else if (i % 3 === 1) lines.push(`get-container-pid`);
        else lines.push(`ls-container-root`);
        break;
      case 'message-queue':
        if (i % 4 === 0) lines.push(`PUB topic_${i % 10} msg_${i}`);
        else if (i % 4 === 1) lines.push(`POLL topic_${i % 10}`);
        else if (i % 4 === 2) lines.push(`READ_AT topic_${i % 10} ${i}`);
        else lines.push(`LEN topic_${i % 10}`);
        break;
      case 'log-engine':
        if (i % 4 === 0) lines.push(`INGEST 200 50 /api/v1/user`);
        else if (i % 4 === 1) lines.push(`COUNT`);
        else if (i % 4 === 2) lines.push(`STATUS_COUNT 200`);
        else lines.push(`ERROR_RATE`);
        break;
      case 'rate-limiter':
        if (i === 0) lines.push(`CONFIG 100 60`);
        else if (i % 3 === 0) lines.push(`REQUEST client_${i % 50} ${i * 1000}`);
        else lines.push(`RESET client_${i % 50}`);
        break;
      case 'load-balancer':
        if (i % 3 === 0) lines.push(`ADD_WEIGHTED server_${i} ${i % 10 + 1}`);
        else if (i % 3 === 1) lines.push(`ROUTE_WEIGHTED req_${i}`);
        else lines.push(`ROUTE_LEAST_CONN req_${i}`);
        break;
      case 'task-scheduler':
        if (i % 4 === 0) lines.push(`ADD_NODE node_${i} 4 8192`);
        else if (i % 4 === 1) lines.push(`SUBMIT task_${i} 1 1024`);
        else if (i % 4 === 2) lines.push(`SCHEDULE`);
        else lines.push(`STATUS task_${i}`);
        break;
      case 'distributed-consensus':
        if (i % 5 === 0) lines.push(`tick node_${i % 5}`);
        else if (i % 5 === 1) lines.push(`request-vote node_${i % 5} ${i}`);
        else if (i % 5 === 2) lines.push(`status`);
        else if (i % 5 === 3) lines.push(`client-write cmd_${i}`);
        else lines.push(`replicate`);
        break;
      case 'service-discovery':
        if (i % 4 === 0) lines.push(`register svc_${i % 10} id_${i} 10.0.0.${i % 255} 8080 30`);
        else if (i % 4 === 1) lines.push(`heartbeat id_${i % 10}`);
        else if (i % 4 === 2) lines.push(`lookup svc_${i % 10}`);
        else lines.push(`tick 1000`);
        break;
      case 'distributed-object-storage':
        if (i === 0) lines.push(`cluster-init 6`);
        else if (i % 2 === 0) lines.push(`put-distributed key_${i} data_${i}`);
        else lines.push(`get-distributed key_${i}`);
        break;
      case 'search-engine':
        if (i % 5 === 0) lines.push(`INDEX doc_${i} word1 word2 word3`);
        else if (i % 5 === 1) lines.push(`DOC_COUNT`);
        else if (i % 5 === 2) lines.push(`POSTINGS word1`);
        else if (i % 5 === 3) lines.push(`SEARCH_AND word1 word2`);
        else lines.push(`BM25 word1`);
        break;
      case 'vector-database':
        if (i % 4 === 0) lines.push(`insert-vector id_${i} 0.1,0.2,0.3`);
        else if (i % 4 === 1) lines.push(`query-knn 0.1,0.2,0.3 5`);
        else if (i % 4 === 2) lines.push(`hnsw-insert id_${i} 0.4,0.5,0.6`);
        else lines.push(`hnsw-search 0.4,0.5,0.6 5 10`);
        break;
      case 'llm-inference':
        if (i % 4 === 0) lines.push(`decode-step prompt_${i} 50`);
        else if (i % 4 === 1) lines.push(`sample-token 0.1,0.2,0.3 0.7`);
        else if (i % 4 === 2) lines.push(`enable-kv-cache`);
        else lines.push(`inspect-kv-size`);
        break;
      case 'mcp-runtime':
        if (i % 4 === 0) lines.push(`send-rpc {"method":"ping","id":${i}}`);
        else if (i % 4 === 1) lines.push(`register-tool tool_${i} desc_${i}`);
        else if (i % 4 === 2) lines.push(`execute-tool-sandboxed tool_${i} arg_${i}`);
        else lines.push(`list-tools`);
        break;
      case 'kv-store':
      default:
        const mod = i % 10;
        if (mod < 6) {
          lines.push(`SET key_${i} val_${i}`);
        } else if (mod < 9) {
          lines.push(`GET key_${i}`);
        } else {
          lines.push(`DELETE key_${i}`);
        }
        break;
    }
  }

  lines.push('EXIT');
  return lines.join('\n');
}
