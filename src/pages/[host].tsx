import Link from 'next/link'
import Head from 'next/head'

import protocol, { NewPingResult } from 'minecraft-protocol'

import { Server, ServerImageLinks } from '../components/server';
import { MinecraftServer } from '../types';

type Context = {
    query: {
        host: string
    }
}

type ServerSideProps = {
    error?: {
        code: number
        message: string
    }
    server?: MinecraftServer
}

export const getServerSideProps = async (context: Context) => {
    const { host } = context.query
    const port = host.split(":")[1] == null ? 25565 : Number(host.split(":")[1])
    const server = await new Promise<MinecraftServer | null>((resolve) => {
        protocol.ping({ host, port }, (err, result) => {
            if (err) {
                return resolve(null)
            }
            resolve({
                host,
                status: result as NewPingResult
            })
        })
    })
    if (!server) {
        return {
            props: {
                error: {
                    code: 404,
                    message: "サーバーが見つかりませんでした"
                }
            } as ServerSideProps
        }
    }
    return {
        props: {
            server: server
        } as ServerSideProps
    }
}

const ServerPage: React.FC<ServerSideProps> = ({ server, error }) => {
    if (error) {
        return (
            <div className="mt-5">
                <p>{error.code}: {error.message}</p>
                <div className="mt-10">
                    <Link href="/">
                        インデックスに戻る
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            {server &&
                <>
                    <Head>
                        <title>motoped - {server.host}</title>
                    </Head>
                    <div className="mt-5">
                        <Server server={server} />
                    </div>
                    <div className="mt-5">
                        <ServerImageLinks server={server} />
                    </div>
                    <div className="mt-10">
                        <Link href="/">
                            インデックスに戻る
                        </Link>
                    </div>
                </>
            }
        </>
    )
}

export default ServerPage
