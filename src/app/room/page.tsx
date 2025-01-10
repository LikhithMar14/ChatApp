"use client"
import { Button } from "@/components/ui/button";
import {Card,CardContent,CardTitle,CardFooter, CardHeader} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const Home = () => {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement | null>(null)

    const onSubmitHandler = () => {
        router.push(`/room/${inputRef.current?.value}`)
        console.log(inputRef.current?.value)

    }
    const generateRandomRoom = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const randomId = Array.from({ length: 6 }, () =>
            characters.charAt(Math.floor(Math.random() * characters.length))
        ).join("");
        if (inputRef.current) {
            inputRef.current.value = randomId.toString();
        }

    }
    return (
        <div className="min-h-screen w-full bg-pink-200 flex items-center justify-center">
            <Card>
                <CardHeader>Create or Join the room</CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <div>
                    <div className="flex gap-x-4">
                        
                        <Input ref = {inputRef} placeholder="Room Id"/>
                        <Button onClick={onSubmitHandler}>Enter</Button>
                    </div>
                    </div>

                    <div> 
                        <Button className="w-full" onClick={generateRandomRoom}>Generate new Room ID</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
     );
}
 
export default Home;