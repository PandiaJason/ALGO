FROM python:3.12-slim

# Install g++ for C++20 compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged sandbox user
RUN groupadd -g 1000 sandbox && \
    useradd -u 1000 -g sandbox -m -s /bin/bash sandbox

WORKDIR /workspace
USER sandbox

CMD ["bash"]
