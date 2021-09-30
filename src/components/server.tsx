import { useEffect, useState } from "react"
import { MinecraftServer } from "../types"
import McText from 'mctext-react'

export const Server: React.FC<{ server: MinecraftServer }> = ({ server }) => {
    const { status } = server
    return (
        <div className="flex flex-row bg-black text-white p-1" id="server">
            <img src={status.favicon} alt="" />

            <div className="ml-1 text-sm">
                <div>{server.host}</div>
                <McText>{status.description}</McText>
            </div>

            <div className="text-xs">
                <div className="px-2">{status.version.name}</div>
                <div className="px-2">{status.latency}ms</div>
            </div>

            <div className="px-2 text-xs">
                {status.players.online} / {status.players.max}
            </div>
        </div>
    )
}

export const ServerImageLinks: React.FC<{ server: MinecraftServer }> = ({ server }) => {
    return (
        <div className="flex flex-col space-y-1">
            <p>画像リンク</p>
            <textarea
                className="form-input mt-1 block w-full border-solid border-2 rounded-md resize-none"
                value={`https://motoped.vercel.app/image/${server.host}#.png`}
            />
            <p>Scrapbox</p>
            <textarea
                className="form-input mt-1 block w-full border-solid border-2 rounded-md resize-none"
                value={`[https://motoped.vercel.app/image/${server.host}#.png https://${server.host}]`}
            />
            <p>Markdown</p>
            <textarea
                className="form-input mt-1 block w-full border-solid border-2 rounded-md resize-none"
                value={`[![${server.host}](https://motoped.vercel.app/image/${server.host}#.png)](https://${server.host})`}
            />
            <p>HTML</p>
            <textarea
                className="form-input mt-1 block w-full border-solid border-2 rounded-md resize-none"
                value={`<a href="https://${server.host}"><img src="https://motoped.vercel.app/image/${server.host}#.png"></a>`}
            />
        </div>

    )
}
