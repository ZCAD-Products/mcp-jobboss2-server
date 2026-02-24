mod bridge;
mod config;
mod native_tools;

use anyhow::{Context, Result};
use bridge::{read_frame, write_frame, BunBridge};
use native_tools::NativeTools;
use serde_json::{json, Value};
use tokio::io::BufReader;

#[tokio::main(flavor = "multi_thread")]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .with_writer(std::io::stderr)
        .init();

    let cfg = config::Config::from_env()?;
    let native = NativeTools::new(cfg)?;
    let bridge = BunBridge::start().await?;

    let stdin = tokio::io::stdin();
    let mut reader = BufReader::new(stdin);
    let mut stdout = tokio::io::stdout();

    loop {
        let msg = match read_frame(&mut reader).await {
            Ok(v) => v,
            Err(_) => break,
        };
        let Some(method) = msg.get("method").and_then(Value::as_str) else {
            continue;
        };
        let id = msg.get("id").cloned();
        let params = msg.get("params").cloned().unwrap_or(Value::Null);

        let Some(id) = id else {
            continue;
        };
        let response = match method {
            "initialize" => {
                json!({"jsonrpc":"2.0","id":id,"result":{"protocolVersion":"2024-11-05","serverInfo":{"name":"jobboss2-rust","version":"0.3.0"},"capabilities":{"tools":{}}}})
            }
            "tools/list" => {
                let tools = bridge
                    .list_tools()
                    .await
                    .unwrap_or_else(|e| json!({"tools":[],"error":e.to_string()}));
                json!({"jsonrpc":"2.0","id":id,"result":tools})
            }
            "tools/call" => {
                let name = params
                    .get("name")
                    .and_then(Value::as_str)
                    .unwrap_or_default();
                let args = params.get("arguments").cloned().unwrap_or(json!({}));
                let result = if NativeTools::supports(name) {
                    native
                        .call(name, args.clone())
                        .await
                        .map(|v| json!({"content":[{"type":"text","text":v.to_string()}]}))
                } else {
                    bridge.call_tool(name, args).await
                };

                match result {
                    Ok(v) => json!({"jsonrpc":"2.0","id":id,"result":v}),
                    Err(e) => {
                        json!({"jsonrpc":"2.0","id":id,"error":{"code":-32000,"message":e.to_string()}})
                    }
                }
            }
            _ => {
                json!({"jsonrpc":"2.0","id":id,"error":{"code":-32601,"message":"Method not found"}})
            }
        };
        write_frame(&mut stdout, &response)
            .await
            .context("write response failed")?;
    }

    Ok(())
}
