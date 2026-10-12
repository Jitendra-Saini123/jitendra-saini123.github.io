// Local-only harness: serves three.js + the FBX to headless Chrome and
// receives results. Usage: node server.mjs <threeDir> <fbxPath> <outDir> <page.html>
import http from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { spawn } from "node:child_process";

const [threeDir, fbxPath, outDir, pagePath] = process.argv.slice(2);
const types = { ".js": "text/javascript", ".html": "text/html", ".fbx": "application/octet-stream" };
let chrome;
const finish = (code) => { try { chrome?.kill("SIGKILL"); } catch {} server.close(); process.exit(code); };

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "POST") {
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = Buffer.concat(chunks);
      if (url.pathname === "/log") { console.log(body.toString()); res.end("ok"); return; }
      if (url.pathname === "/result") {
        const name = (url.searchParams.get("name") || "out.glb").replace(/[^\w.-]/g, "");
        await writeFile(join(outDir, name), body); console.log(`WROTE ${name} ${body.length} bytes`); res.end("ok"); return;
      }
      if (url.pathname === "/done") { res.end("ok"); setTimeout(() => finish(0), 200); return; }
    }
    let file;
    if (url.pathname === "/") file = pagePath;
    else if (url.pathname === "/model.fbx") file = fbxPath;
    else if (url.pathname.startsWith("/three/")) file = join(threeDir, url.pathname.slice(7).replace(/\.\.+/g, ""));
    else { res.statusCode = 404; res.end(); return; }
    const data = await readFile(file);
    res.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
    res.end(data);
  } catch (e) { res.statusCode = 500; res.end(String(e)); }
});

server.listen(4599, "127.0.0.1", () => {
  chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new", "--no-first-run", "--disable-gpu", `--user-data-dir=${outDir}/.chrome`,
    "--remote-debugging-port=0", "http://127.0.0.1:4599/",
  ], { stdio: "ignore" });
  setTimeout(() => { console.log("TIMEOUT"); finish(1); }, 180000);
});
