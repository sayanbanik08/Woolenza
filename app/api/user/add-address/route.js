import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {

        const { userId } = getAuth(request);
        const { address } = await request.json();

        await connectDB();

        // Ensure pincode stored as number and fullname matches schema field name
        const payload = {
            userId,
            fullname: address.fullName || address.fullname || '',
            phoneNumber: address.phoneNumber || '',
            pincode: Number(address.pincode) || 0,
            area: address.area || '',
            city: address.city || '',
            state: address.state || '',
        };

        // Use the model's static create method (do not use `new Address.create`)
        const newAddress = await Address.create(payload);

        return NextResponse.json({ success: true, message: "Address added successfully", newAddress });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}