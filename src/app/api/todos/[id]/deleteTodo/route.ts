import { prisma } from "@/utils/prisma";
// import Todo from "@/types/todo";
import { NextResponse } from "next/server";

// type Data = {
//     todos : Todo[]
// }

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const todoId = params.id;

        if (!todoId || typeof todoId !== 'string') {
            return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
        }

        await prisma.todo.delete({
            where: { id: todoId },
        });

        return NextResponse.json({ success: true, message: 'Todo deleted successfully.' }, { status: 200 });
    } catch (error) {
        console.error("Error Deleting Todo: ", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
        }, {
            status: 500,
        });
    }
}