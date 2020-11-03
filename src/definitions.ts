import { Bot } from "./bot";
import { Message, PermissionResolvable } from "discord.js";
import { Server } from "./util/classes";

type category = "Fun" | "Admin" | "Utility" | "Server"

export interface rule{
	name: string;
	desk: string;
	setting: string;
	regex: RegExp;
	execute: (Bot: Bot, message: Message, match: RegExpMatchArray) => any;
  }

export interface command{
    help: {
        perms: PermissionResolvable;
        owner: boolean;
        server: boolean;
        name: string;
        desk: string;
        category: category;
    };
    command: {
        weight: number;
        regex: RegExp;
        run: (bot: Bot, message: Message, server: Server) => any;
    };
}