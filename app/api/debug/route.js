import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'No userId found',
                userId: null 
            });
        }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        
        return NextResponse.json({ 
            success: true, 
            userId,
            role: user.publicMetadata.role,
            isSeller: user.publicMetadata.role === 'seller',
            metadata: user.publicMetadata
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: error.message,
            error: error.toString()
        });
    }
}