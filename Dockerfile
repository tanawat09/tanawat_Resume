FROM rust:bookworm AS builder

WORKDIR /app

COPY Cargo.toml Cargo.toml
COPY src src
COPY public public

RUN cargo build --release

FROM debian:bookworm-slim

WORKDIR /app

COPY --from=builder /app/target/release/tanawat_resume /usr/local/bin/tanawat_resume

EXPOSE 8080

ENV PORT=8080

CMD ["tanawat_resume"]
