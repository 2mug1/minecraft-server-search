import { NewPingResult } from "minecraft-protocol";

export type MinecraftServer = {
    host: string
    status: NewPingResult
}