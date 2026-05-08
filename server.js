const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");

function readData() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // GET /  — API info
  if (method === "GET" && url === "/") {
    return sendJSON(res, 200, {
      message: "Node.js Docker API",
      version: "1.0.0",
      endpoints: [
        "GET  /",
        "GET  /users",
        "GET  /users/:id",
        "POST /users",
      ],
    });
  }

  // GET /users — list all users
  if (method === "GET" && url === "/users") {
    const data = readData();
    return sendJSON(res, 200, { users: data.users });
  }

  // GET /users/:id — get one user
  const matchGet = url.match(/^\/users\/(\d+)$/);
  if (method === "GET" && matchGet) {
    const id = parseInt(matchGet[1]);
    const data = readData();
    const user = data.users.find((u) => u.id === id);
    if (!user) return sendJSON(res, 404, { error: "User not found" });
    return sendJSON(res, 200, user);
  }

  // POST /users — add a new user
  if (method === "POST" && url === "/users") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const newUser = JSON.parse(body);
        if (!newUser.name || !newUser.email) {
          return sendJSON(res, 400, { error: "name and email are required" });
        }
        const data = readData();
        newUser.id = data.users.length
          ? Math.max(...data.users.map((u) => u.id)) + 1
          : 1;
        newUser.createdAt = new Date().toISOString();
        data.users.push(newUser);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return sendJSON(res, 201, newUser);
      } catch {
        return sendJSON(res, 400, { error: "Invalid JSON body" });
      }
    });
    return;
  }

  // 404 fallback
  sendJSON(res, 404, { error: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
