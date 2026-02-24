use anyhow::{anyhow, Context, Result};
use serde_json::{json, Value};
use tokio::io::{AsyncBufReadExt, AsyncRead, AsyncReadExt, AsyncWrite, AsyncWriteExt, BufReader};
use tokio::process::{Child, ChildStdin, ChildStdout, Command};
use tokio::sync::Mutex;

pub struct BunBridge {
    inner: Mutex<Inner>,
}

struct Inner {
    _child: Child,
    writer: ChildStdin,
    reader: BufReader<ChildStdout>,
    next_id: u64,
}

impl BunBridge {
    pub async fn start() -> Result<Self> {
        let mut child = Command::new("bun")
            .arg("run")
            .arg("start")
            .stdin(std::process::Stdio::piped())
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::inherit())
            .spawn()
            .context("failed to spawn bun server")?;

        let writer = child.stdin.take().context("missing child stdin")?;
        let stdout = child.stdout.take().context("missing child stdout")?;
        let mut inner = Inner {
            _child: child,
            writer,
            reader: BufReader::new(stdout),
            next_id: 1,
        };

        let _ = inner
            .rpc("initialize", json!({"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"rust-bridge","version":"0.1.0"}}))
            .await?;
        Ok(Self {
            inner: Mutex::new(inner),
        })
    }

    pub async fn list_tools(&self) -> Result<Value> {
        let mut guard = self.inner.lock().await;
        guard.rpc("tools/list", json!({})).await
    }

    pub async fn call_tool(&self, name: &str, arguments: Value) -> Result<Value> {
        let mut guard = self.inner.lock().await;
        guard
            .rpc("tools/call", json!({"name":name,"arguments":arguments}))
            .await
    }
}

impl Inner {
    async fn rpc(&mut self, method: &str, params: Value) -> Result<Value> {
        let id = self.next_id;
        self.next_id += 1;
        let req = json!({"jsonrpc":"2.0","id":id,"method":method,"params":params});
        write_frame(&mut self.writer, &req).await?;

        loop {
            let msg = read_frame(&mut self.reader).await?;
            if msg.get("id") == Some(&json!(id)) {
                if let Some(err) = msg.get("error") {
                    return Err(anyhow!("bun rpc error: {err}"));
                }
                return Ok(msg
                    .get("result")
                    .cloned()
                    .ok_or_else(|| anyhow!("bun rpc missing result"))?);
            }
        }
    }
}

pub async fn read_frame<R: AsyncRead + Unpin>(reader: &mut BufReader<R>) -> Result<Value> {
    let mut len: Option<usize> = None;
    loop {
        let mut line = String::new();
        if reader.read_line(&mut line).await? == 0 {
            return Err(anyhow!("eof"));
        }
        let line = line.trim_end_matches(['\r', '\n']);
        if line.is_empty() {
            break;
        }
        if let Some(v) = line.strip_prefix("Content-Length:") {
            len = Some(v.trim().parse()?);
        }
    }
    let len = len.context("missing Content-Length")?;
    let mut buf = vec![0u8; len];
    reader.read_exact(&mut buf).await?;
    Ok(serde_json::from_slice(&buf)?)
}

pub async fn write_frame<W: AsyncWrite + Unpin>(writer: &mut W, payload: &Value) -> Result<()> {
    let buf = serde_json::to_vec(payload)?;
    writer
        .write_all(format!("Content-Length: {}\r\n\r\n", buf.len()).as_bytes())
        .await?;
    writer.write_all(&buf).await?;
    writer.flush().await?;
    Ok(())
}
