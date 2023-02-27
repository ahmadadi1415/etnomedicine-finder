import { createProxyMiddleware } from "http-proxy-middleware";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {query} = req.query
    const proxy = createProxyMiddleware({
        target: `https://serpapi.com/search.json?q=${query}&tbm=isch&ijn=0`,
        changeOrigin: true,
        pathRewrite: {
            [`^/api/serpapi-google`]: '',
        }
    }) as NextApiHandler;
    return proxy(req, res);
}