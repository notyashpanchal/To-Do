import { prisma } from "@/utils/prisma";
// import Todo from "@/types/todo";
import { NextResponse } from "next/server";

// type Data = {
//     todos : Todo[]
// }

export async function GET() {
    try {
        const todos = await prisma.todo.findMany();

        return NextResponse.json({
            success:true,
            todos,
        },{
            status:201
        })

        
    } catch (error) {
        console.error("Error Adding Todo: ", error);
        return NextResponse.json({
            success:false,
            message:"Something went wrong",
        },{
            status:500,
        });
    }
    
}