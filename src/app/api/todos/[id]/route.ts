import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function DELETE(request: NextRequest) {
    try {
        // Change from [4] to [3] since the ID is the third segment
        const todoId = request.nextUrl.pathname.split('/')[3];
        
        if (!todoId || typeof todoId !== 'string') {
            return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
        }

        const deletedTodo = await prisma.todo.delete({
            where: { id: todoId },
        });

        if (!deletedTodo) {
            return NextResponse.json({ success: false, message: 'Todo not found.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Todo deleted successfully.' }, { status: 200 });
    } catch (error) {
        console.error("Error Deleting Todo:", error || "Unknown error occurred");
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
}