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
export async function POST(req:Request) {

    try {
        const bodyText = await req.text();
        const body = bodyText ? JSON.parse(bodyText) : null;

        if (!body || typeof body.title !== 'string') {
            return NextResponse.json({
                success: false,
                message: "Title is required and must be a string."
            }, {
                status: 400
            });
        }

        const { title, priority, date, tags } = body;

        const newTodo = await prisma.todo.create({
        data: {
            title,
            priority, 
            date,   
            tags,
            },
        });

        return NextResponse.json({
            success:true,
            todo:newTodo,
            message: "Todo created successfully."
        },{
            status:201
        })

        
    } catch (error) {
        console.error("Error Adding Todo: ", error instanceof Error ? error.message : error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
        }, {
            status: 500,
        });
    }
    
}