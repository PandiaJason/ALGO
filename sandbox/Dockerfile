FROM python:3.12-slim

# Install toolchains for C++20, Go, Rust, and Java
RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    golang-go \
    rustc \
    default-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged sandbox user
RUN groupadd -g 1000 sandbox && \
    useradd -u 1000 -g sandbox -m -s /bin/bash sandbox

WORKDIR /workspace
USER sandbox

CMD ["bash"]
