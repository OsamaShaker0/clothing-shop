import { registerAs } from "@nestjs/config";

export default registerAs('messages' , () =>({
    content: process.env.MESSAGE_CONTENT
}))