import assert from "node:assert/strict";
import { test } from "node:test";
import axios from "axios";

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
};
let handler;
axios.defaults.adapter = (config) => handler(config);
const { httpClient, refreshSession } = await import("../src/shared/api/httpClient.js");
const { clearToken, loadToken, saveToken } = await import("../src/shared/api/tokenStorage.js");

function response(config, data) {
  return { data, status: 200, statusText: "OK", headers: {}, config };
}

function unauthorized(config) {
  throw new axios.AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null,
    { status: 401, data: { message: "Phiên hết hạn" }, config });
}

test("concurrent expired requests share one refresh and retry with the new token", async () => {
  saveToken("expired");
  let refreshCount = 0;
  handler = async (config) => {
    if (config.url === "/api/auth/refresh") {
      refreshCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return response(config, { token: "renewed", user: { id: 1 } });
    }
    if (config.headers.Authorization !== "Bearer renewed") unauthorized(config);
    return response(config, { paymentStatus: "paid" });
  };
  const results = await Promise.all([httpClient.get("/api/orders/a"), httpClient.get("/api/orders/b")]);
  assert.equal(refreshCount, 1);
  assert.equal(loadToken(), "renewed");
  assert.ok(results.every((result) => result.data.paymentStatus === "paid"));
});

test("login failure does not trigger token refresh", async () => {
  const calls = [];
  handler = async (config) => { calls.push(config.url); unauthorized(config); };
  await assert.rejects(httpClient.post("/api/auth/login", {}));
  assert.deepEqual(calls, ["/api/auth/login"]);
});

test("a failed refresh does not clear the saved session token", async () => {
  saveToken("expired");
  let refreshCount = 0;
  handler = async (config) => {
    if (config.url === "/api/auth/refresh") refreshCount += 1;
    unauthorized(config);
  };
  await assert.rejects(httpClient.get("/api/orders/a"));
  assert.equal(refreshCount, 1);
  assert.equal(loadToken(), "expired");
});

test("a request is retried only once if the server keeps rejecting it", async () => {
  saveToken("expired");
  let refreshCount = 0;
  let requestCount = 0;
  handler = async (config) => {
    if (config.url === "/api/auth/refresh") {
      refreshCount += 1;
      return response(config, { token: "renewed", user: { id: 1 } });
    }
    requestCount += 1;
    unauthorized(config);
  };
  await assert.rejects(httpClient.get("/api/orders/a"));
  assert.equal(refreshCount, 1);
  assert.equal(requestCount, 2);
});

test("refresh cookie can restore a session without a local token", async () => {
  clearToken();
  handler = async (config) => {
    assert.equal(config.url, "/api/auth/refresh");
    assert.equal(config.withCredentials, true);
    return response(config, { token: "restored", user: { id: 1, role: "CUSTOMER" } });
  };
  const session = await refreshSession();
  assert.equal(session.user.id, 1);
  assert.equal(loadToken(), "restored");
});

test("logging out during session restoration prevents a late refresh from signing back in", async () => {
  clearToken();
  let finishRefresh;
  handler = (config) => new Promise((resolve) => {
    finishRefresh = () => resolve(response(config, { token: "late", user: { id: 1 } }));
  });
  const pending = refreshSession();
  await Promise.resolve();
  clearToken();
  finishRefresh();
  await assert.rejects(pending, /Phiên đăng nhập đã thay đổi/);
  assert.equal(loadToken(), null);
});
