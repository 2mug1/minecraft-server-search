import { NewPingResult } from "minecraft-protocol";

export type MinecraftServer = {
    host: string
    imageUrl: string
    status: NewPingResult
}